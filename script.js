'use strict'
import { questionsAndAnswers } from './questions.js'

// - newGame() - создает новую игру
// - createGame(params) - создает компонентs для поля (виселица, клавиатура, вопрос-ответ) на основе json-файла, описывающего структуру тэгов (задание со звездочкой) **
// - validateAnswer(word) - проверяет соответствие текущей буквы ответу
// - renderHangman() - рисует человечка по частям на основе текущего значения итератора
// - gameOver() - вызывается когда мы ответили правильно, либо проиграли. рисует текст и кнопку "начать заново"
class Hangman {
  constructor() {
    this.createGame()
  }

  createGame() {
    const root = document.getElementById('root')

    // Основной блок
    const container = document.createElement('div')
    container.className = 'container'
    document.body.append(container)

    const h1 = document.createElement('h1')
    h1.className = 'title'
    h1.innerHTML = 'ВИСИЛИЦА'

    container.append(h1)

    const content = document.createElement('div');
    content.className = 'content'
    container.append(content)

    // Блок висилицы
    const gallows = document.createElement('div')
    gallows.className = 'gallows'
    content.append(gallows)

    // Блок человека
    const gallowsImg = document.createElement('img')
    gallowsImg.className = 'gallows__img'
    gallowsImg.src = '../assest/gallows.png'
    gallowsImg.alt = 'gallows'
    gallows.append(gallowsImg)

    const gallowsHead = document.createElement('img')
    gallowsHead.className = 'gallows__head'
    gallowsHead.src = '../assest/head.png'
    gallowsHead.alt = 'head'
    gallows.append(gallowsHead)

    const gallowsBody = document.createElement('img')
    gallowsBody.className = 'gallows__body'
    gallowsBody.src = '../assest/body.png'
    gallowsBody.alt = 'gallowsBody'
    gallows.append(gallowsBody)

    const gallowsRigthHand = document.createElement('img')
    gallowsRigthHand.className = 'gallows__rigthHand'
    gallowsRigthHand.src = '../assest/hand-one.png'
    gallowsRigthHand.alt = 'gallowsRigthHand'
    gallows.append(gallowsRigthHand)

    const gallowsLeftHand = document.createElement('img')
    gallowsLeftHand.className = 'gallows__leftHand'
    gallowsLeftHand.src = '../assest/hand-two.png'
    gallowsLeftHand.alt = 'gallowsLeftHand'
    gallows.append(gallowsLeftHand)

    const gallowsRigthLeg = document.createElement('img')
    gallowsRigthLeg.className = 'gallows__rigthLeg'
    gallowsRigthLeg.src = '../assest/leg-one.png'
    gallowsRigthLeg.alt = 'gallowsRigthLeg'
    gallows.append(gallowsRigthLeg)

    const gallowsLeftLeg = document.createElement('img')
    gallowsLeftLeg.className = 'gallows__leftLeg'
    gallowsLeftLeg.src = '../assest/leg-two.png'
    gallowsLeftLeg.alt = 'gallowsLeftLeg'
    gallows.append(gallowsLeftLeg)


    // Блок с вопросом и словом
    const game = document.createElement('div')
    game.className = 'game'
    content.append(game)

    const word = document.createElement('ul')
    word.className = 'word'
    game.append(word)

    const clue = document.createElement('div');
    clue.className = 'clue'
    game.append(clue)

    // Вопросы и Ответы
    let currentAnswer;

    const getRandom = () => {
      let { answer, question } = questionsAndAnswers[Math.floor(Math.random() * questionsAndAnswers.length)]

      currentAnswer = answer.toLocaleUpperCase().split('');

      answer = answer.toLocaleUpperCase().split('').map((i) => {
        const letter = document.createElement('li');
        letter.className = 'word__letter'
        word.append(letter)
      })
      clue.innerHTML = question;
    }

    getRandom();

    console.log(currentAnswer);

    // Экранная клавиатура
    const onSymbolClick = (event) => {
      const char = event.target.innerText;

      currentAnswer.map((el, index) => {
        if (el === char) {
          word.querySelectorAll('li')[index].innerHTML = char;
          word.querySelectorAll('li')[index].className = 'word__letter-guessed'
        } else {
          // renderHangman()
        }
      })
    };

    const getKeyboard = () => {
      const alph = "йцукенгшщзхъфывапролджэячсмитьбю";

      const keyboard = document.createElement("div");
      keyboard.className = "keyboard";

      const keyboardBtns = alph.toUpperCase().split("").map((word) => {
        const button = document.createElement("button");
        button.append(word);
        button.className = "keyboard__btn";
        button.onclick = onSymbolClick;

        return button;
      });

      keyboard.append(...keyboardBtns);

      return keyboard;
    };

    game.append(getKeyboard())
  }
}

new Hangman();


const root = document.getElementById('root')
