"use strict";
import { questionsAndAnswers } from "./questions.js";

class Hangman {
  constructor(data) {
    this.data = data;
    this.currentAnswer = [];
    this.countWrong = -1;
    this.trueAnswer = [];
    this.maxAttempt = 5;
    this.createGame();
  }

  createElem(objData) {
    const elem = document.createElement(objData.tagName);

    Object.keys(objData).map((key) => {
      if (key !== "tagName" && key !== "children") {
        elem[key] = objData[key];
      }
    });

    return elem;
  }

  createNodes(objData) {
    if (!objData.children) {
      return this.createElem(objData);
    }

    const elem = this.createElem(objData);

    objData.children.forEach((child) => {
      elem.append(this.createNodes(child));
    });

    return elem;
  }

  // Проверка слова
  onSymbolClick = (event, isKeyboardPressed) => {
    let char;

    if (isKeyboardPressed) {
      char = event.key.toUpperCase();
    } else {
      char = event.target.innerText;
    }

    if (this.trueAnswer.includes(char)) {
      return;
    }

    if (this.currentAnswer.includes(char)) {
      this.currentAnswer.map((el, index) => {
        if (el === char) {
          this.trueAnswer = this.trueAnswer + el;
          this.wordChars[index].innerHTML = char;
          this.wordChars[index].className = "word__letter-guessed";

          event.target.disabled = true;
        }
      });
    } else {
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

  // Победа или поражение
  gameResult(victory) {
    if (victory == true) {
      this.modal.className = "modal-active";
      this.modalImg.src = "../assets/win.png";
      this.modalText.innerHTML = "Ты выиграл!";
    } else {
      this.modal.className = "modal-active";
      this.modalImg.src = "../assets/lose.png";
      this.modalText.innerHTML = "Ты проиграл!";
    }
  }

  // Играть заново
  gameRestart = () => {
    this.countWrong = -1;
    this.trueAnswer = [];

    this.container.remove();
    this.createGame();
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

  onKeyboardBtnClick = (e) => {
    e.preventDefault();
    console.log("e target ", e);
    this.onSymbolClick(e, true);
  };

  async createGame() {
    // найдем корневой тег
    let root = document.getElementById("root");
    root.append(this.createNodes(this.data));

    this.game = document.querySelector(".game");
    this.hangman = document.querySelector(".hangman");
    this.container = document.querySelector(".container");

    this.word = document.querySelector(".word");
    this.wordChars = this.word.getElementsByTagName("li");

    this.clue = document.querySelector(".clue");

    this.modal = document.querySelector(".modal");
    this.modalImg = document.querySelector(".modal__img");
    this.modalText = document.querySelector(".modal__text");

    this.generateRandomQuestion();

    this.keyboard = document.querySelector(".keyboard");

    document.addEventListener("keypress", this.onKeyboardBtnClick);

    this.keyboard.addEventListener("click", (e) => {
      if (e.target === this.keyboard) return;
      this.onSymbolClick(e);
    });

    this.modalBtn = document.querySelector(".modal__btn");
    this.modalBtn.onclick = this.gameRestart;
  }
}

// загрузим данные из json асинхронно в браузере
let data = await fetch("./data.json"); // получить json
data = await data.json(); // приведем к обьекту

new Hangman(data);
