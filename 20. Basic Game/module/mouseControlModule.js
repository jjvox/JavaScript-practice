import { MOUSE_CONTROL_SCORE_KEY } from "../constants/localStorage.js";
import { makeDOMwithProperties } from "../utils/dom.js";
import { handleModalOpen } from "../utils/modal.js";
import { stopTimer, startTimer, isGameStart, setTimer, getResultTimeString, getNowTime } from "../utils/timer.js";

let boxDOMList = [];
let wallBoxDOMList = [];
let startBoxDOM = null;
let endBoxDOM = null;

const gameFiledDOM = document.getElementById('game-field');

export const initMouseControlGame = () => {
  startBoxDOM.innerHTML = '시작';
  endBoxDOM.innerHTML = '끝';
  boxDOMList.forEach((box) => {
    box.style.backgroundColor = 'transparent';
  })
  stopTimer();
  setTimer(0);
}

const handleSuccessGame = () => {
  stopTimer();
  handleModalOpen({ isSuccess: true, timeString: getResultTimeString() });
  
  const nowScore = getNowTime();
  const currentScore = localStorage.getItem(MOUSE_CONTROL_SCORE_KEY);
  if (!currentScore || nowScore < currentScore) {
    localStorage.setItem(MOUSE_CONTROL_SCORE_KEY, nowScore);
  }

  setTimer(0);
};

const handleFailedGame = () => {
  stopTimer();
  handleModalOpen({ isSuccess: false });
  setTimer(0);
};

export const setBoxDOM = ({
  row,  // 행의 수
  col,  // 열의 수
  start,  // 시작 위치
  end,  // 끝 위치
  walls  // 벽의 위치
}) => {
  
  const controllBoxContainer = makeDOMwithProperties('div', {
    id: 'control-box-container',
    onmouseleave: () => {
      if (!isGameStart) return;
      handleFailedGame();
    },
  });

  controllBoxContainer.style.display = 'grid';
  controllBoxContainer.style.gridTemplateRows = `repeat(${row}, 1fr)`;      // row행 col열인 그리드를 만든다. 
  controllBoxContainer.style.gridTemplateColumns = `repeat(${col}, 1fr)`;


  for (let i = 0; i < row; i++) {    // 행열에 의한 수만큼 박스가 필요 하기 때문에 for문으로 box를 반복 생산 해준다. 
    for (let j = 0; j < col; j++) {

      const { className = '', innerHTML = '', type, onmouseover } = (() => {  // 함수가 return하는 값을 바로 변수로 쓸 수 있다. 
        if (i === start[0] && j === start[1]) {  // 시작 위치는 [행, 열] 로 주어진다.
          return {
            className: 'control-box start',
            innerHTML: 'start',
            type: 'start',
            onmouseover: (event) => {
              const modalDOM = document.getElementsByClassName('modal')[0];
              if(modalDOM.classList.contains('open')) return;
              startTimer(handleFailedGame);
              event.target.innerHTML = '';
            },
          }
        };

        if (i === end[0] && j === end[1]) {  // end위치에 해당하는 box값 전달
          return {
            className: 'control-box end',
            innerHTML: 'end',
            type: 'end',
            onmouseover: (event) => {
              if (!isGameStart) return;
              event.target.innerHTML = '';
              handleSuccessGame();
            },
          }
        };

        for (let wall of walls) {
          if (i === wall[0] && j === wall[1]) {  // wall위치에 해당하는 box값 전달
            return {
              className: 'control-box wall',
              type: 'wall',
              onmouseover: () => {
                if (!isGameStart) return;
                handleFailedGame();
            },
            }
          }
        };

        return {
          className: 'control-box',
          type: 'nomal',
          onmouseover: (event) => {
            if (!isGameStart) return;
            
            event.target.style.backgroundColor = 'linen';
            },
        }
      })();

      const boxDom = makeDOMwithProperties('div', {
        className,                  // 원래는 className: className 처럼 키값과 value값을 따로 써야 하지만
        innerHTML,                  // key와 value의 이름이 같으면 하나만 써줘도 된다. 
        id: `box-${i}-${j}`,
        onmouseover,
      });

      switch (type) {   // box를 종류별로 구분지어 보관(나중에 불러오기 좋게)
        case 'start':
          startBoxDOM = boxDom;
          break;
        case 'end':
          endBoxDOM = boxDom;
          break;
        case 'wall':
          wallBoxDOMList.push(boxDom);
          break;
        default:
          boxDOMList.push(boxDom);
      }

      controllBoxContainer.appendChild(boxDom);
    };
  };

  gameFiledDOM.appendChild(controllBoxContainer);

};