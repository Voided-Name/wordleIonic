import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {
    fetch('../../assets/words.json')
      .then((res) => res.json())
      .then((json) => {
        this.randomWords = json['words'];
        this.randomWord = this.randomWords[this.randomInt(0, 3102)];
        console.log(this.randomWord);
      });
  }

  public randomWord: string = '';
  public randomWords: string[] = [];

  public randomInt = (min: any, max: any) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  public keySound01 = new Audio('../../assets/sounds/1real.wav');
  public keySound02 = new Audio('../../assets/sounds/2real.wav');
  public keySound03 = new Audio('../../assets/sounds/3real.wav');
  public keySoundEnter = new Audio('../../assets/sounds/enter.wav');
  public keySoundBack = new Audio('../../assets/sounds/backspace.wav');
  public keyPop = new Audio('../../assets/sounds/pop.wav');
  public success = new Audio('../../assets/sounds/ding.mp3');
  public error = new Audio('../../assets/sounds/errorBeep.wav');

  public audioArray: any[] = [
    this.keySound01,
    this.keySound02,
    this.keySound03,
  ];

  public guessMatrix: string[][] = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  public matrixState: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  public gridColor: { [id: number]: string } = {
    0: 'empty',
    1: 'hasKey',
    2: 'letterExists',
    3: 'properPosition',
    4: 'invalid',
  };

  public keyColor: { [id: string]: string } = {
    Q: 'dark',
    W: 'dark',
    E: 'dark',
    R: 'dark',
    T: 'dark',
    Y: 'dark',
    U: 'dark',
    I: 'dark',
    O: 'dark',
    P: 'dark',
    A: 'dark',
    S: 'dark',
    D: 'dark',
    F: 'dark',
    G: 'dark',
    H: 'dark',
    J: 'dark',
    K: 'dark',
    L: 'dark',
    Z: 'dark',
    X: 'dark',
    C: 'dark',
    V: 'dark',
    B: 'dark',
    N: 'dark',
    M: 'dark',
  };

  public focusRow: boolean[] = [true, false, false, false, false];

  public pos: number = 0;
  public try: number = 0;

  public playKeyIndex = 0;

  public playKey() {
    if (this.playKeyIndex == 2) {
      this.playKeyIndex = 0;
      this.audioArray[this.playKeyIndex].play();
    } else {
      this.playKeyIndex++;
      this.audioArray[this.playKeyIndex].play();
    }
  }

  public showRules() {
    Swal.fire({
      title: 'Wordle Rules',
      html: `
      <p>Guess the <strong>WORDLE</strong> in five tries.</p>
      <ol>
    <li>Each guess must be a valid five-letter word.</li>

    <li>The color of a tile will change to show you how close your guess was.</li>

    <li>If the tile turns green, the letter is in the word, and it is in the correct spot.</li>

    <li>If the tile turns yellow, the letter is in the word, but it is not in the correct spot.</li>
    `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-fullscreen',
      },
      backdrop: true,
      heightAuto: false,
    });
  }

  public keyPress(keyVal: string) {
    if (this.pos > 4 || this.try > 4) {
      this.keyPop.play();

      if (!(this.try > 4)) {
        const matrixRow = document.getElementById(
          '_' + this.try,
        ) as HTMLElement;

        matrixRow.classList.add('animate__animated');
        matrixRow.classList.add('animate__swing');

        matrixRow.addEventListener(
          'animationend',
          () => {
            matrixRow.classList.remove('animate__animated');
            matrixRow.classList.remove('animate__swing');
          },
          { once: true },
        );
      }

      return;
    }

    this.guessMatrix[this.try][this.pos] = keyVal;
    this.matrixState[this.try][this.pos] = 1;

    const matrixElement = document.getElementById(
      '_' + this.try + this.pos,
    ) as HTMLElement;

    matrixElement.classList.add('animate__animated');
    matrixElement.classList.add('animate__tada');

    matrixElement.addEventListener(
      'animationend',
      () => {
        matrixElement.classList.remove('animate__animated');
        matrixElement.classList.remove('animate__tada');
      },
      { once: true },
    );

    this.pos++;
    this.playKey();
  }

  public backKey() {
    if (this.pos == 0 || this.try > 4) {
      this.keyPop.play();

      if (!(this.try > 4)) {
        const matrixRow = document.getElementById(
          '_' + this.try,
        ) as HTMLElement;

        matrixRow.classList.add('animate__animated');
        matrixRow.classList.add('animate__swing');

        matrixRow.addEventListener(
          'animationend',
          () => {
            matrixRow.classList.remove('animate__animated');
            matrixRow.classList.remove('animate__swing');
          },
          { once: true },
        );
      }
      return;
    }

    this.pos--;

    this.guessMatrix[this.try][this.pos] = '';
    this.matrixState[this.try][this.pos] = 0;

    const matrixElement = document.getElementById(
      '_' + this.try + this.pos,
    ) as HTMLElement;

    matrixElement.classList.add('animate__animated');
    matrixElement.classList.add('animate__headShake');

    matrixElement.addEventListener(
      'animationend',
      () => {
        matrixElement.classList.remove('animate__animated');
        matrixElement.classList.remove('animate__headShake');
      },
      { once: true },
    );

    this.keySoundBack.play();
  }

  public refresh() {
    this.guessMatrix = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ];

    this.matrixState = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    this.gridColor = {
      0: 'empty',
      1: 'hasKey',
      2: 'letterExists',
      3: 'properPosition',
      4: 'invalid',
    };

    this.keyColor = {
      Q: 'dark',
      W: 'dark',
      E: 'dark',
      R: 'dark',
      T: 'dark',
      Y: 'dark',
      U: 'dark',
      I: 'dark',
      O: 'dark',
      P: 'dark',
      A: 'dark',
      S: 'dark',
      D: 'dark',
      F: 'dark',
      G: 'dark',
      H: 'dark',
      J: 'dark',
      K: 'dark',
      L: 'dark',
      Z: 'dark',
      X: 'dark',
      C: 'dark',
      V: 'dark',
      B: 'dark',
      N: 'dark',
      M: 'dark',
    };

    this.focusRow = [true, false, false, false, false];

    this.pos = 0;
    this.try = 0;

    this.playKeyIndex = 0;
    this.randomWord = this.randomWords[this.randomInt(0, 3102)];

    console.log(this.randomWord);
  }

  public enterKey() {
    if (this.try > 4) {
      return;
    }

    if (this.guessMatrix[this.try][4] == '') {
      return;
    }

    let guessedWord: string =
      this.guessMatrix[this.try][0] +
      this.guessMatrix[this.try][1] +
      this.guessMatrix[this.try][2] +
      this.guessMatrix[this.try][3] +
      this.guessMatrix[this.try][4];

    if (!this.randomWords.includes(guessedWord.toLowerCase())) {
      this.error.play();
      const matrixRow = document.getElementById('_' + this.try) as HTMLElement;

      matrixRow.classList.add('animate__animated');
      matrixRow.classList.add('animate__swing');

      matrixRow.addEventListener(
        'animationend',
        () => {
          matrixRow.classList.remove('animate__animated');
          matrixRow.classList.remove('animate__swing');
        },
        { once: true },
      );

      return;
    }

    let randomWord: string = this.randomWord;
    let address: number = 0;
    let correct: number = 0;
    let guessesCount: number[] = [];

    this.guessMatrix[this.try].forEach((value) => {
      if (value.toLowerCase() == randomWord[address]) {
        this.matrixState[this.try][address] = 3;
        this.keyColor[value] = 'success';
        correct++;
      } else if (this.randomWord.indexOf(value.toLowerCase()) != -1) {
        let addressCount = 0;
        this.matrixState[this.try][address] = 2;
        this.keyColor[value] = 'warning';
      } else {
        this.matrixState[this.try][address] = 4;
        this.keyColor[value] = 'medium';
      }

      address++;
    });

    if (correct == 5) {
      this.success.play();
      Swal.fire({
        title: 'You Won!',
        text: 'Do you want to try again?',
        icon: 'success',
        confirmButtonText: 'Try Again',
        heightAuto: false,
        customClass: {
          popup: 'swal-theme',
        },
      }).then(() => {
        this.refresh();
      });
    } else {
      this.try++;
      this.pos = 0;
    }

    if (this.try == 5) {
      this.error.play();
      Swal.fire({
        title: 'You Lost',
        text: 'The word was ' + this.randomWord + ', do you want to try again?',
        icon: 'error',
        confirmButtonText: 'Try Again',
        heightAuto: false,
      }).then(() => {
        this.refresh();
      });
    }

    this.keySoundEnter.play();
  }
}
