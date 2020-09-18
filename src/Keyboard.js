export default class Keyboard {
  constructor(element) {
    this.element = document.querySelector(element);
    this.notesList = [
      {
        note: 'C',
        frequency: 65.41,
        octave: 2,
        key: 'a',
        midiKey: 36,
      },
      {
        note: 'CS',
        frequency: 69.30,
        octave: 2,
        key: 'w',
        midiKey: 37,
      },
      {
        note: 'D',
        frequency: 73.42,
        octave: 2,
        key: 's',
        midiKey: 38,
      },
      {
        note: 'DS',
        frequency: 77.78,
        octave: 2,
        key: 'e',
        midiKey: 39,
      },
      {
        note: 'E',
        frequency: 82.41,
        octave: 2,
        key: 'd',
        midiKey: 40,
      },
      {
        note: 'F',
        frequency: 87.31,
        octave: 2,
        key: 'f',
        midiKey: 41,
      },
      {
        note: 'FS',
        frequency: 92.50,
        octave: 2,
        key: 't',
        midiKey: 42,
      },
      {
        note: 'G',
        frequency: 98,
        octave: 2,
        key: 'g',
        midiKey: 43,
      },
      {
        note: 'GS',
        frequency: 103.83,
        octave: 2,
        key: 'y',
        midiKey: 44,
      },
      {
        note: 'A',
        frequency: 110,
        octave: 2,
        key: 'h',
        midiKey: 45,
      },
      {
        note: 'AS',
        frequency: 116.54,
        octave: 2,
        key: 'u',
        midiKey: 46,
      },
      {
        note: 'B',
        frequency: 123.47,
        octave: 2,
        key: 'j',
        midiKey: 47,
      },
      {
        note: 'C',
        frequency: 65.41 * 2,
        octave: 3,
        key: 'a',
        midiKey: 48,
      },
      {
        note: 'CS',
        frequency: 69.30 * 2,
        octave: 3,
        key: 'w',
        midiKey: 49,
      },
      {
        note: 'D',
        frequency: 73.42 * 2,
        octave: 3,
        key: 's',
        midiKey: 50,
      },
      {
        note: 'DS',
        frequency: 77.78 * 2,
        octave: 3,
        key: 'e',
        midiKey: 51,
      },
      {
        note: 'E',
        frequency: 82.41 * 2,
        octave: 3,
        key: 'd',
        midiKey: 52,
      },
      {
        note: 'F',
        frequency: 87.31 * 2,
        octave: 3,
        key: 'f',
        midiKey: 53,
      },
      {
        note: 'FS',
        frequency: 92.50 * 2,
        octave: 3,
        key: 't',
        midiKey: 54,
      },
      {
        note: 'G',
        frequency: 98 * 2,
        octave: 3,
        key: 'g',
        midiKey: 55,
      },
      {
        note: 'GS',
        frequency: 103.83 * 2,
        octave: 3,
        key: 'y',
        midiKey: 56,
      },
      {
        note: 'A',
        frequency: 110 * 2,
        octave: 3,
        key: 'h',
        midiKey: 57,
      },
      {
        note: 'AS',
        frequency: 116.54 * 2,
        octave: 3,
        key: 'u',
        midiKey: 58,
      },
      {
        note: 'B',
        frequency: 123.47 * 2,
        octave: 3,
        key: 'j',
        midiKey: 59,
      },
    ];
    this.oscList = {};
    this.audioContext = new AudioContext;
    this.mainGain = this.audioContext.createGain();
    this.waveType = 'sine';

    this.setupGain();
    this.setupMidi();

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.playNoteFromKey = this.playNoteFromKey.bind(this);
    this.stopNoteFromKey = this.stopNoteFromKey.bind(this);
    this.setupMidi = this.setupMidi.bind(this);
  }

  setupGain() {
    this.mainGain.connect(this.audioContext.destination);
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
            this.mainGain.gain.setValueAtTime(event.data[2] / 100, this.audioContext.currentTime);
            this.playNote({ target: element });
          }

          if (event.data[0] === midiKeyup) {
            this.stopNote({ target: element });
            this.mainGain.gain.setValueAtTime(1, this.audioContext.currentTime);
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
    oscillator.connect(this.mainGain);
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