export default class Keyboard {
  constructor(element) {
    this.element = document.querySelector(element);
    this.notesList = [
      {
        note: 'C',
        frequency: 523.25,
        octave: 5,
        key: 'a',
      },
      {
        note: 'CS',
        frequency: 554.37,
        octave: 5,
        key: 'w',
      },
      {
        note: 'D',
        frequency: 587.33,
        octave: 5,
        key: 's',
      },
      {
        note: 'DS',
        frequency: 622.25,
        octave: 5,
        key: 'e',
      },
      {
        note: 'E',
        frequency: 659.25,
        octave: 5,
        key: 'd',
      },
      {
        note: 'F',
        frequency: 698.46,
        octave: 5,
        key: 'f',
      },
      {
        note: 'FS',
        frequency: 739.99,
        octave: 5,
        key: 't',
      },
      {
        note: 'G',
        frequency: 783.99,
        octave: 5,
        key: 'g',
      },
      {
        note: 'GS',
        frequency: 830.61,
        octave: 5,
        key: 'y',
      },
      {
        note: 'A',
        frequency: 880,
        octave: 5,
        key: 'h',
      },
      {
        note: 'AS',
        frequency: 932.33,
        octave: 5,
        key: 'u',
      },
      {
        note: 'B',
        frequency: 987.77,
        octave: 5,
        key: 'j',
      },
    ];
    this.oscList = {};
    this.audioContext = new AudioContext;
    this.waveType = 'sine';

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.playNoteFromKey = this.playNoteFromKey.bind(this);
    this.stopNoteFromKey = this.stopNoteFromKey.bind(this);
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