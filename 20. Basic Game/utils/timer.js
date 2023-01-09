const MAX_TIME = 10;
const timerDOM = document.getElementsByClassName('game-time')[0];

export let isGameStart = false;
let time = 0;
let timerId = null;

export const getTimeString = (time) => {
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  time = time % 3600;
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  time = time % 60;
  const seconds = String(time).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`
};

export const startTimer = (onTimeOver) => {

  if (isGameStart) return
  isGameStart = true
  timerId = setInterval(() => {
    time++;
    timerDOM.innerHTML = getTimeString(time);

    if (MAX_TIME < time) {
      onTimeOver?.();        // 시간이 초과되면 넘겨받은 onTimeOver(실패함수)를 실행 시킨다. 
      clearInterval(timerId);
    }
  }, 1000);
}

export const stopTimer = () => {
  isGameStart = false;
  if (timerId == null) return;
  clearInterval(timerId);
}

export const setTimer = (initTime) => {
  setTimeout(() => {
    time = initTime;
    timerDOM.innerHTML = getTimeString(time);
  }, 2000)
};

export const getResultTimeString = () => {
  return getTimeString(time);
};

export const getNowTime = () => {
  return time;
}