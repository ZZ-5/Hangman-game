"use strict";
import { questionsAndAnswers } from "./questions.js";

// - newGame() - создает новую игру
// - createGame(params) - создает компонентs для поля (виселица, клавиатура, вопрос-ответ) на основе json-файла, описывающего структуру тэгов (задание со звездочкой) **
// - validateAnswer(word) - проверяет соответствие текущей буквы ответу
// - this.renderHangman() - рисует человечка по частям на основе текущего значения итератора
// - gameOver() - вызывается когда мы ответили правильно, либо проиграли. рисует текст и кнопку "начать заново"

class Hangman {
  constructor() {
    this.currentAnswer = [];
    this.countWrong = -1;
    this.trueAnswer = [];
    this.maxAttempt = 5;
    this.createGame();
  }

  // Проверка слова
  onSymbolClick = (event) => {
    const char = event.target.innerText;

    if (this.trueAnswer.includes(char)) {
      return;
    }

    if (this.currentAnswer.includes(char)) {
      this.currentAnswer.map((el, index) => {
        if (el === char) {
          this.trueAnswer = this.trueAnswer + el;
          this.word.querySelectorAll("li")[index].innerHTML = char;
          this.word.querySelectorAll("li")[index].className = "word__letter-guessed";

          event.target.disabled = true;
        }
      });
    } else {
      // this.renderHangman()
      this.countWrong++;
      let parts = this.hangman.getElementsByClassName("hangman__part");
      this.renderHangman(parts, "show", this.countWrong);
    }

    if (this.countWrong === this.maxAttempt) return this.gameResult(false);
    if (this.currentAnswer.length === this.trueAnswer.length)
      return this.gameResult(true);
  };

  //Случайный вопрос и ответ
  generateRandomQuestion() {
    let { answer, question } =
      questionsAndAnswers[
      Math.floor(Math.random() * questionsAndAnswers.length)
      ];

    this.currentAnswer = answer.toLocaleUpperCase().split("");

    answer = answer
      .toLocaleUpperCase()
      .split("")
      .map((i) => {
        const letter = document.createElement("li");
        letter.className = "word__letter";
        this.word.append(letter);
      });
    this.clue.innerHTML = question;
  }

  // Экранная клавиатура
  getKeyboard() {
    const alph = "йцукенгшщзхъфывапролджэячсмитьбю";

    const keyboard = document.createElement("div");
    keyboard.className = "keyboard";

    const keyboardBtns = alph
      .toUpperCase()
      .split("")
      .map((word) => {
        const button = document.createElement("button");
        button.append(word);
        button.className = "keyboard__btn";
        button.onclick = this.onSymbolClick;

        return button;
      });

    keyboard.append(...keyboardBtns);

    return keyboard;
  }

  // Победа или поражение
  gameResult(victory) {
    if (victory == true) {
      this.container.querySelector(".modal").className = "modal-active";
      this.modal.querySelector(".modal__img").src = "../assets/win.png";
      this.modal.querySelector(".modal__text").innerHTML = "Ты выиграл!";
    } else {
      this.container.querySelector(".modal").className = "modal-active";
      this.modal.querySelector(".modal__img").src = "../assets/lose.png";
      this.modal.querySelector(".modal__text").innerHTML = "Ты проиграл!";
    }
  }

  // Играть заново
  gameRestart = () => {
    this.countWrong = -1;
    this.trueAnswer = [];
    this.modal.className = "modal";
    this.word.innerHTML = "";

    let parts = this.hangman.getElementsByClassName("hangman__part");
    this.renderHangman(parts, "hide");

    // удаляем и рисуем клавиатуру
    // TODO: подумать как сделать лучше
    this.game.querySelector(".keyboard").remove();
    this.game.append(this.getKeyboard());

    this.generateRandomQuestion();
  };

  renderHangman(collection, type, counter) {
    // type = "show" | "hide"
    if (counter !== undefined) {
      if (type === "show") {
        collection[`${counter}`].style = "display: block";
      } else if (type === "hide") {
        collection[`${counter}`].style = "display: none";
      }
      return;
    }

    if (type === "show") {
      this.changeHangmanStyle(collection, { display: "block" });
    } else if (type === "hide") {
      this.changeHangmanStyle(collection, { display: "none" });
    }
  }

  changeHangmanStyle(collection, options) {
    for (const el of collection) {
      el.style = {
        ...el.style,
        ...options,
      };
    }
  }

  createGame() {
    // TODO: генерировать gameField из json-файла
    // const gameField = generateFromJson();
    this.root = document.getElementById("root");

    // Основной блок
    this.container = document.createElement("div");
    this.container.className = "container";
    this.root.append(this.container);

    this.h1 = document.createElement("h1");
    this.h1.className = "title";
    this.h1.innerHTML = "ВИСИЛИЦА";

    this.container.append(this.h1);

    this.content = document.createElement("div");
    this.content.className = "content";
    this.container.append(this.content);

    // Блок висилицы
    this.gallows = document.createElement("div");
    this.gallows.className = "gallows";
    this.content.append(this.gallows);

    this.gallowsImg = document.createElement("img");
    this.gallowsImg.className = "gallows__img";
    this.gallowsImg.src = "../assets/gallows.png";
    this.gallowsImg.alt = "gallows";
    this.gallows.append(this.gallowsImg);

    // Блок человека
    this.hangman = document.createElement("div");
    this.hangman.className = "hangman";
    this.gallows.append(this.hangman);

    this.hangmanHead = document.createElement("img");
    this.hangmanHead.className = "hangman__head hangman__part";
    this.hangmanHead.src = "../assets/hangman-1.png";
    this.hangmanHead.alt = "head";
    this.hangman.append(this.hangmanHead);

    this.hangmanBody = document.createElement("img");
    this.hangmanBody.className = "hangman__body hangman__part";
    this.hangmanBody.src = "../assets/hangman-2.png";
    this.hangmanBody.alt = "Body";
    this.hangman.append(this.hangmanBody);

    this.hangmanRigthHand = document.createElement("img");
    this.hangmanRigthHand.className = "hangman__rigthHand hangman__part";
    this.hangmanRigthHand.src = "../assets/hangman-3.png";
    this.hangmanRigthHand.alt = "RigthHand";
    this.hangman.append(this.hangmanRigthHand);

    this.hangmanLeftHand = document.createElement("img");
    this.hangmanLeftHand.className = "hangman__leftHand hangman__part";
    this.hangmanLeftHand.src = "../assets/hangman-4.png";
    this.hangmanLeftHand.alt = "LeftHand";
    this.hangman.append(this.hangmanLeftHand);

    this.hangmanRigthLeg = document.createElement("img");
    this.hangmanRigthLeg.className = "hangman__rigthLeg hangman__part";
    this.hangmanRigthLeg.src = "../assets/hangman-5.png";
    this.hangmanRigthLeg.alt = "RigthLeg";
    this.hangman.append(this.hangmanRigthLeg);

    this.hangmanLeftLeg = document.createElement("img");
    this.hangmanLeftLeg.className = "hangman__leftLeg hangman__part";
    this.hangmanLeftLeg.src = "../assets/hangman-6.png";
    this.hangmanLeftLeg.alt = "LeftLeg";
    this.hangman.append(this.hangmanLeftLeg);

    // Блок с вопросом и словом
    this.game = document.createElement("div");
    this.game.className = "game";
    this.content.append(this.game);

    this.word = document.createElement("ul");
    this.word.className = "word";
    this.game.append(this.word);

    this.clue = document.createElement("div");
    this.clue.className = "clue";
    this.game.append(this.clue);

    // Модальное окно
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.container.append(this.modal);

    this.modalImg = document.createElement("img");
    this.modalImg.className = "modal__img";
    this.modalImg.src = "../assets/lose.png";
    this.modal.append(this.modalImg);

    this.modalText = document.createElement("h3");
    this.modalText.className = "modal__text";
    this.modalText.innerText.toLocaleUpperCase();
    this.modal.append(this.modalText);

    this.modalBtn = document.createElement("button");
    this.modalBtn.className = "modal__btn";
    this.modalBtn.innerHTML = "Играть заново";
    this.modal.append(this.modalBtn);

    this.generateRandomQuestion();
    this.game.append(this.getKeyboard());
    this.modalBtn.onclick = this.gameRestart;
  }
}

new Hangman();
