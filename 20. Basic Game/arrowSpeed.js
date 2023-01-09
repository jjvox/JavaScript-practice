import { ARROW_SCORE_KEY } from "./constants/localStorage.js";
import { makeDOMwithProperties } from "./utils/dom.js";
import { handleModalOpen, handleModalClose } from "./utils/modal.js";
import { getResultTimeString, setTimer, startTimer, stopTimer, getNowTime } from "./utils/timer.js";

const MAX_ARROW = 8;
const MAX_ROUND = 3;

let arrowDOMList = [];
let currentIndex = 0;
let round = 1;

const arrowFieldDOM = document.getElementById('arrow-field');

const clearArrowDOM = () => {
  arrowDOMList.forEach((element) => {
    element.remove();  // dom을 삭제 해준다. 
  });
  arrowDOMList = [];
}

const setArrowDOM = () => {

  clearArrowDOM();

  for (let i = 0; i < MAX_ARROW; i++) {
    const direction = Math.random() < 0.5 ? 'left' : 'right';  // left와 right 가 50% 확률로 나오게 한다.
    const arrowDOM = makeDOMwithProperties('span', {   // 화살표를 만든다. 
      className: `arrow arrow-${direction}`,
      innerHTML: direction === 'left' ? '&lt;' : '&gt;'  // &lt;는 < left를 의미, &gt;는 > right를 의미 한다. 
    });
    arrowDOMList.push(arrowDOM);  // arrowDOM을 배열에 순서대로 보관
    arrowFieldDOM.appendChild(arrowDOM);
  };
};

const handleSuccessGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });

  const nowScore = getNowTime();
  const currentScore = localStorage.getItem(ARROW_SCORE_KEY);
  if (!currentScore || nowScore < currentScore) {   // 로컬 스토리지에 점수 업로드
    localStorage.setItem(ARROW_SCORE_KEY, nowScore);
  }
  setTimer(0);
};

const handleFailedGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};


const setKeyboardEvent = () => {
  
  const handleCorrect = () => {
    
    arrowDOMList[currentIndex].style.display = 'none';  // 누른 키를 지워준다.
    currentIndex++  
    
    if (currentIndex === MAX_ARROW) {    // 한 라운드가 끝났을때.
      if (round === MAX_ROUND) {    // 게임이 다 끝났을때. 
        handleSuccessGame();
        return;
      }
      currentIndex = 0;
      setArrowDOM();
      round += 1;
    };

  };
  
  window.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.code)) return;   // 'ArrowLeft', 'ArrowRight' 가 아닐때는 return
    
    const isFirst = currentIndex === 0 && round === 1;
    if (isFirst) {
      startTimer(handleFailedGame);
    }

    const isLeft = (arrowDOMList[currentIndex].innerHTML === '&lt;');
    
    if (isLeft && e.code === 'ArrowLeft') {
      handleCorrect();
    };

    const isRight = (arrowDOMList[currentIndex].innerHTML === '&gt;');

    if (isRight && e.code === 'ArrowRight') {
      handleCorrect();
    }
  });
};

const initialize = () => {
  
  const [headerRetryButton, modalRetryButton] = document.getElementsByClassName('retry-button');
  headerRetryButton.addEventListener('click', () => {
    handleModalClose(setArrowDOM);
    currentIndex = 0;
    round = 1;
  })
  modalRetryButton.addEventListener('click', () => {
    handleModalClose(setArrowDOM);
    currentIndex = 0;
    round = 1;
  })
};

setArrowDOM();
setKeyboardEvent();
initialize();