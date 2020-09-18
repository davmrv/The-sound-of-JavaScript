export default class Keyboard {
  constructor(element) {
    this.element = document.querySelector(element);
    this.notesList = [
      {
        note: 'C',
        frequency: 523.25,
        octave: 5,
        key: 'a',
        midiKey: 36,
      },
      {
        note: 'CS',
        frequency: 554.37,
        octave: 5,
        key: 'w',
        midiKey: 37,
      },
      {
        note: 'D',
        frequency: 587.33,
        octave: 5,
        key: 's',
        midiKey: 38,
      },
      {
        note: 'DS',
        frequency: 622.25,
        octave: 5,
        key: 'e',
        midiKey: 39,
      },
      {
        note: 'E',
        frequency: 659.25,
        octave: 5,
        key: 'd',
        midiKey: 40,
      },
      {
        note: 'F',
        frequency: 698.46,
        octave: 5,
        key: 'f',
        midiKey: 41,
      },
      {
        note: 'FS',
        frequency: 739.99,
        octave: 5,
        key: 't',
        midiKey: 42,
      },
      {
        note: 'G',
        frequency: 783.99,
        octave: 5,
        key: 'g',
        midiKey: 43,
      },
      {
        note: 'GS',
        frequency: 830.61,
        octave: 5,
        key: 'y',
        midiKey: 44,
      },
      {
        note: 'A',
        frequency: 880,
        octave: 5,
        key: 'h',
        midiKey: 45,
      },
      {
        note: 'AS',
        frequency: 932.33,
        octave: 5,
        key: 'u',
        midiKey: 46,
      },
      {
        note: 'B',
        frequency: 987.77,
        octave: 5,
        key: 'j',
        midiKey: 47,
      },
    ];
    this.oscList = {};
    this.audioContext = new AudioContext;
    this.waveType = 'sine';
    this.setupMidi();

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.playNoteFromKey = this.playNoteFromKey.bind(this);
    this.stopNoteFromKey = this.stopNoteFromKey.bind(this);
    this.setupMidi = this.setupMidi.bind(this);
  }

  setupMidi() {
    navigator.requestMIDIAccess({
      sysex: true,
    })
      .then((access) => {
        const inputs = access.inputs;
        const controllerId = Array.from(inputs.keys())[1];
        const controller = inputs.get(controllerId);

        controller.onmidimessage = (event) => {
          const midiKeydown = 144;
          const midiKeyup = 128;
          const playedNote = this.notesList.find(note => note.midiKey === event.data[1]);
          const element = document.querySelector(`div[data-frequency="${playedNote.frequency}"`);

          if (event.data[0] === midiKeydown) {
            this.playNote({ target: element });
          }

          if (event.data[0] === midiKeyup) {
            this.stopNote({ target: element });
          }
        }
      });
  }

  createKeyboard() {
    this.element.className = 'keyboard';

    this.addKeyListener();

    this.notesList.forEach((note, index) => {
      const div = this.createKey(note, index);
      div.addEventListener('mousedown', this.playNote);
      div.addEventListener('mouseup', this.stopNote);
      div.addEventListener('mouseleave', this.stopNote);

      this.element.appendChild(div);
    });

    this.addWaveOptions();
  }

  addKeyListener() {
    document.addEventListener('keydown', this.playNoteFromKey);
    document.addEventListener('keyup', this.stopNoteFromKey);
  }

  playNoteFromKey(event) {
    const playedNote = this.notesList.find(note => note.key === event.key);
    const element = document.querySelector(`div[data-frequency="${playedNote.frequency}"`);

    this.playNote({ target: element });
  }

  stopNoteFromKey(event) {
    const stopedNote = this.notesList.find(note => note.key === event.key);
    const element = document.querySelector(`div[data-frequency="${stopedNote.frequency}"`);

    this.stopNote({ target: element });
  }

  /**
   * @param object note
   * @param string key
   */
  createKey(note, key) {
    const div = document.createElement('div');

    div.className = 'key';

    if (note.note.length > 1) {
      div.classList.add('black');
    }

    div.dataset.frequency = note.frequency;
    div.dataset.key = key;
    div.innerHTML = note.note;

    return div;
  }

  playNote(event) {
    const dataset = event.target.dataset;
    let oscillator = this.oscList[dataset.key];
    const isInList = !oscillator;

    event.target.classList.add('pressed');

    if (isInList) {
      oscillator = this.oscList[dataset.key] = this.audioContext.createOscillator();
    }

    oscillator.type = this.waveType;
    oscillator.connect(this.audioContext.destination);
    oscillator.frequency.value = event.target.dataset.frequency;
    oscillator.start();
  }

  stopNote(event) {
    const dataset = event.target.dataset;
    const oscillator = this.oscList[dataset.key];

    event.target.classList.remove('pressed');

    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      delete this.oscList[dataset.key];
    }
  }

  addWaveOptions() {
    const container = document.createElement('div');
    const options = [
      'sine',
      'square',
      'triangle',
      'sawtooth',
    ];

    container.id = 'waveTypesContainer';

    for (const option of options) {
      const wrapper = document.createElement('div');
      const input = document.createElement('input');
      const label = document.createElement('label');

      container.appendChild(wrapper);

      label.innerText = option;
      label.htmlFor = option;

      input.type = 'radio';
      input.value = option;
      input.id = option;
      input.name = 'waveType';

      if (this.waveType === option) {
        input.checked = true;
      }

      input.addEventListener('change', (event) => {
        this.waveType = event.target.value;
      });

      wrapper.appendChild(input);
      wrapper.appendChild(label);
    }


    this.element.appendChild(container);
  }
}