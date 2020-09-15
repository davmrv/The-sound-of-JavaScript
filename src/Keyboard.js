export default class Keyboard {
  constructor(element) {
    this.element = document.querySelector(element);
    this.notesList = [
      {
        note: 'C',
        frequency: 523.25,
        octave: 5,
      },
      {
        note: 'CS',
        frequency: 554.37,
        octave: 5,
      },
      {
        note: 'D',
        frequency: 587.33,
        octave: 5,
      },
      {
        note: 'DS',
        frequency: 622.25,
        octave: 5,
      },
      {
        note: 'E',
        frequency: 659.25,
        octave: 5,
      },
      {
        note: 'F',
        frequency: 698.46,
        octave: 5,
      },
      {
        note: 'FS',
        frequency: 739.99,
        octave: 5,
      },
      {
        note: 'G',
        frequency: 783.99,
        octave: 5,
      },
      {
        note: 'GS',
        frequency: 830.61,
        octave: 5,
      },
      {
        note: 'A',
        frequency: 880,
        octave: 5,
      },
      {
        note: 'AS',
        frequency: 932.33,
        octave: 5,
      },
      {
        note: 'B',
        frequency: 987.77,
        octave: 5,
      },
    ];
    this.oscList = {};
    this.audioContext = new AudioContext;

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  createKeyboard() {
    this.element.className = 'keyboard';

    this.notesList.forEach((note, index) => {
      const div = this.createKey(note, index);
      div.addEventListener('mousedown', this.playNote);
      div.addEventListener('mouseup', this.stopNote);
      div.addEventListener('mouseleave', this.stopNote);

      this.element.appendChild(div);
    });
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

    if (isInList) {
      oscillator = this.oscList[dataset.key] = this.audioContext.createOscillator();
    }

    oscillator.connect(this.audioContext.destination);
    oscillator.frequency.value = event.target.dataset.frequency;
    oscillator.start();
  }

  stopNote(event) {
    const dataset = event.target.dataset;
    const oscillator = this.oscList[dataset.key];

    oscillator.stop();
    oscillator.disconnect();
    delete this.oscList[dataset.key];
  }
}