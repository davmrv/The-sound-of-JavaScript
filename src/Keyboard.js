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
    this.audioContext = new AudioContext;
  }

  createKeyboard() {
    this.element.className = 'keyboard';

    this.notesList.forEach((note, index) => {
      const div = document.createElement('div');

      div.className = 'key';
      div.dataset.frequency = note.frequency;
      div.innerHTML = note.note;

      div.addEventListener('click', (event) => {
        let oscillator = this.audioContext.createOscillator;

        oscillator.frequency.value = event.dataset.frequency;
        oscillator.play();
        oscillator.connect(this.audioContext.destination);
      });

      this.element.appendChild(div);
    });
  }

  createKey() {}
}