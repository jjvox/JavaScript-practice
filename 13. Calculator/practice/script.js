;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  class Calculator {
    constructor(element) {
      this.element = element;
      this.currentValue = '';
      this.prevValue = '';
      this.operation = null;
      this.prevCalValue = null;
    }

    reset() {
      this.currentValue = '';
      this.prevValue = '';
      this.resetOperation();
    }

    clear() {
      if (this.currentValue) {
        this.currentValue = '';
        return;
      }
      if (this.operation) {
        this.resetOperation();
        this.currentValue = this.prevValue;
        this.prevValue = '';
        return;
      }
      if (this.prevValue) {
        this.prevValue = '';
      }
    }

    appendNumber(number) {
      if (number === '.' && this.currentValue.includes('.')) return;
      if (this.element.value === '0' && number === '0') return;
      if (this.prevCalValue) {
        this.currentValue = '';
        this.prevCalValue = null;
      }
      this.currentValue = this.currentValue.toString() + number.toString();
    }

    setoperation(operation) {
      this.resetOperation();
      this.operation = operation
      this.prevValue = this.currentValue;
      this.currentValue = '';

      const elements = Array.from(getAll('.operation'));
      const element = elements.filter((element) => element.innerText.includes(operation))[0];
      element.classList.add('active');
    }

    updateDisplay() {
      if (this.currentValue) {
        this.element.value = this.currentValue;
        return;
      }
      if (this.prevValue) {
        this.element.value = this.prevValue;
        return;
      }
      this.element.value = 0
    }

    resetOperation() {
      this.operation = null;
      const elements = Array.from(getAll('.operation'));
      elements.forEach((element) => {
        element.classList.remove('active');
      })
    }

    compute() {
      let computation;
      const prev = parseFloat(this.prevValue);  // 문자열을 계산을 위해 숫자(실수) 로 변형 해준다. 
      const current = parseFloat(this.currentValue);
      if (isNaN(prev) || isNaN(current)) return;
      
      switch (this.operation) {
        case '+': computation = prev + current;
          break;
        case '-': computation = prev - current;
          break;
        case '*': computation = prev * current;
          break;
        case '÷': computation = prev / current;
          break;
        default:
          return;
        }

      if (computation === 0) {
        this.currentValue = '';
      } else {
        this.currentValue = computation.toString()
      }
      this.prevCalValue = this.currentValue;
      this.resetOperation();
    }
  }


  const numberButtons = getAll('.cell_button.number');
  const operationButton = getAll('.cell_button.operation');
  const computeButton = get('.cell_button.compute');
  const clearButton = get('.cell_button.clear');
  const allClearButton = get('.cell_button.all_clear');
  const display = get('.display');

  const calculator = new Calculator(display)

  numberButtons.forEach((button) => button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  }))

  operationButton.forEach((button) => button.addEventListener('click', () => {
    calculator.compute();
    calculator.setoperation(button.innerText);
    calculator.updateDisplay();
  }))

  computeButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
  })

  clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
  })

  allClearButton.addEventListener('click', () => {
    calculator.reset();
    calculator.updateDisplay();
  })

})()


// operation으로 연속 계산하기, 클리어 없이 바로 숫자를 눌렀을때 새로운 계산 시작하기 두가지 추가.  
//clear기능을 좀더 강화 하고 싶다. clear만 눌러서 모든 연산을 뒤로 되돌릴수 있게. 추후 배열을 사용해서 해봐야겟따. 