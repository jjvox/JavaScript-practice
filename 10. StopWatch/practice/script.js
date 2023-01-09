;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  class Stopwatch {
    constructor(element) {
      this.timer = element;
      this.interval = null;
      this.defaultTime = '00:00.00';
      this.startTime = 0;
      this.elapsedTime = 0;  // 경과된 시간
    }

    timeToString(time) {
      const date = new Date(time);
      const minutes = String(date.getUTCMinutes()).padStart(2,0);
      const seconds = String(date.getUTCSeconds()).padStart(2,0);
      const millisecond = String(date.getUTCMilliseconds()).slice(0,2);
      return `${minutes}:${seconds}.${millisecond}`;
    }

    print(text) {
      this.timer.innerHTML = text
    }

    startTimer() {
      this.elapsedTime = Date.now() - this.startTime;
      const item = this.timeToString(this.elapsedTime);
      this.print(item);
    }

    start() {
      clearInterval(this.interval); // start를 누르면 interval을 한번 clear하고 시작 한다. 안그러면 start를 누를 때마다 interval이 계속 생성됨. 
      this.startTime = Date.now() - this.elapsedTime; 
      this.interval = setInterval(this.startTimer.bind(this), 10);
    }
    stop() {
      clearInterval(this.interval);
    }
    reset() {
      clearInterval(this.interval);
      this.print(this.defaultTime);
      this.interval = null;
      this.startTime = 0;
      this.elapsedTime = 0;
    }
  }

  const $startButton = get('.timer_button.start');
  const $stopButton = get('.timer_button.stop');
  const $resetButton = get('.timer_button.reset');
  const $timer = get('.timer');
  const stopwatch = new Stopwatch($timer);

  $startButton.addEventListener('click', () => {
    stopwatch.start();
  })
  $stopButton.addEventListener('click', () => {
    stopwatch.stop();
  })
  $resetButton.addEventListener('click', () => {
    stopwatch.reset();
  })

})()
