import { TOUCH_NUMBER_SCORE_KEY } from "./constants/localStorage.js";
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import { getResultTimeString, setTimer, startTimer, stopTimer, getNowTime } from "./utils/timer.js";

const numberButtonList = document.getElementsByClassName('number-button');
const maxId = numberButtonList.length;
let currentNumber = 1;

const handleSuccessGame = () => {  // 성공시 시행 시키는 함수. 
  stopTimer();   // 타이머 정지
  handleModalOpen({   // 모달 오픈
    isSuccess: true,
    timeString: getResultTimeString(),   // 게임 결과 시간 표시
  })

  const nowScore = getNowTime();
  const currentScore = localStorage.getItem(TOUCH_NUMBER_SCORE_KEY);
  if (!currentScore || nowScore < currentScore) {   // 로컬 스토리지에 점수 업로드
    localStorage.setItem(TOUCH_NUMBER_SCORE_KEY, nowScore);
  }

  setTimer(0);   // 타이머 리셋
};

const handleFailedGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};



const setButtonDOM = () => {

  for (let numberButton of numberButtonList) {
    numberButton.style.display = 'block';
    numberButton.style.top = `${Math.floor(Math.random()*100*0.9)}%`;   // 숫자를 랜덤하게 화면에 띄워주기
    numberButton.style.left = `${Math.floor(Math.random()*100*0.9)}%`;

    numberButton.addEventListener('click', (e) => {
      const numId = Number(e.target.innerHTML);
      if (isNaN(numId)) return;
      if (numId !== currentNumber) return;  // 순서를 어길 경우 return 한다 

      e.target.style.display = 'none'; // 클릭을 한 숫자는 가려준다. 

      if (numId === 1) {  // 게임 시작
        startTimer(handleFailedGame);
      }
      if (numId === maxId) {  // 마지막 숫자를 클릭 하면 게임 끝, 성공. 
        handleSuccessGame();
        return;
      }

      currentNumber++;
    })
  }
};



const initialize = () => {
  const [headerRetryButton, modalRetryButton] = document.getElementsByClassName('retry-button');
  headerRetryButton.addEventListener('click', () => {
    handleModalClose(setButtonDOM);
    currentNumber = 1;
  })
  modalRetryButton.addEventListener('click', () => {
    handleModalClose(setButtonDOM);
    currentNumber = 1;
  })
}

setButtonDOM();
initialize();