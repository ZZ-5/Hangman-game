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
    gallowsImg.src = '../assets/gallows.png'
    gallowsImg.alt = 'gallows'
    gallows.append(gallowsImg)

    const gallowsHead = document.createElement('img')
    gallowsHead.className = 'gallows__head gallows__part'
    gallowsHead.src = '../assets/hangman-1.png'
    gallowsHead.alt = 'head'
    gallows.append(gallowsHead)


    const gallowsBody = document.createElement('img')
    gallowsBody.className = 'gallows__body gallows__part'
    gallowsBody.src = '../assets/hangman-2.png'
    gallowsBody.alt = 'Body'
    gallows.append(gallowsBody)

    const gallowsRigthHand = document.createElement('img')
    gallowsRigthHand.className = 'gallows__rigthHand gallows__part'
    gallowsRigthHand.src = '../assets/hangman-3.png'
    gallowsRigthHand.alt = 'RigthHand'
    gallows.append(gallowsRigthHand)

    const gallowsLeftHand = document.createElement('img')
    gallowsLeftHand.className = 'gallows__leftHand gallows__part'
    gallowsLeftHand.src = '../assets/hangman-4.png'
    gallowsLeftHand.alt = 'LeftHand'
    gallows.append(gallowsLeftHand)

    const gallowsRigthLeg = document.createElement('img')
    gallowsRigthLeg.className = 'gallows__rigthLeg gallows__part'
    gallowsRigthLeg.src = '../assets/hangman-5.png'
    gallowsRigthLeg.alt = 'RigthLeg'
    gallows.append(gallowsRigthLeg)


    const gallowsLeftLeg = document.createElement('img')
    gallowsLeftLeg.className = 'gallows__leftLeg gallows__part'
    gallowsLeftLeg.src = '../assets/hangman-6.png'
    gallowsLeftLeg.alt = 'LeftLeg'
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



    //Переменные
    let currentAnswer;
    let countWrong = -1;
    let trueAnswer = [];
    let maxAttempt = 5;
    let letters;

    //Случайный вопрос и ответ
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



    // Экранная клавиатура
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


    // Проверка слова
    function onSymbolClick(event) {

      const char = event.target.innerText;

      if (currentAnswer.includes(char)) {
        currentAnswer.map((el, index) => {
          if (el === char) {
            trueAnswer.push(char)
            word.querySelectorAll('li')[index].innerHTML = char;
            word.querySelectorAll('li')[index].className = 'word__letter-guessed'
          }
        })
      } else {
        // renderHangman()
        countWrong++
        document.getElementsByClassName('gallows__part')[`${countWrong}`].style = "display: block"
      }

      if (countWrong === maxAttempt) return gameOver(false)
      if (currentAnswer.length === trueAnswer.length) return gameOver(true)

    };


    // Модальное окно
    const modale = document.createElement('div')
    modale.className = 'modale'
    container.append(modale)

    const modaleImg = document.createElement('img')
    modaleImg.className = 'modale__img'
    modaleImg.src = '../assets/lose.png'
    modale.append(modaleImg)

    const modaleText = document.createElement('h3')
    modaleText.className = 'modale__text'
    modaleText.innerText.toLocaleUpperCase()
    modale.append(modaleText)

    const modaleBtn = document.createElement('button')
    modaleBtn.className = 'modale__btn'
    modaleBtn.innerHTML = 'Играть заново'
    modale.append(modaleBtn)


    // Победа или поражение
    let gameOver = (victory) => {
      if (victory == true) {
        container.getElementsByClassName('modale')[0].className = "modale-active"

        modale.getElementsByClassName('modale__img')[0].src = '../assets/win.png'
        modale.getElementsByClassName('modale__text')[0].innerHTML = 'Ты выиграл!'
      } else {
        container.getElementsByClassName('modale')[0].className = "modale-active"

        modale.getElementsByClassName('modale__img')[0].src = '../assets/lose.png'
        modale.getElementsByClassName('modale__text')[0].innerHTML = 'Ты проиграл!'
      }
    }

    // Играть заново
    function gameRestart() {
      countWrong = -1;
      trueAnswer = []

      // Нужно удалить из DOM-дерева узлы отвечающие за отрисовку слова и вопроса
      // Затем вызвать getRandom
      let a = document.body.getElementsByClassName('word__letter')
      a.remove()
      // answer = answer.toLocaleUpperCase().split('').map((i) => {
      //   const letter = document.createElement('li');
      //   letter.className = 'word__letter'
      //   word.append(letter)
      // })
      modale.className = "modale"
      // Сделать так, чтоб человечек был обернут в свой тэг. Менять только его стиль. Не искать каждый раз элементы в DOM
      gallows.getElementsByTagName('div').style = "display: none"

      // getRandom()
    }

    modaleBtn.onclick = gameRestart
  }
}

new Hangman();


const root = document.getElementById('root')
