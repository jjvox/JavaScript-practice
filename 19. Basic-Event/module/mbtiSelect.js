const mbtiQuestionDOM = document.getElementsByClassName('mbti-question')[0];
const [ yesButton, noButton ] = document.getElementsByClassName('mbti-select')[0].children;
const [ selectDOM, pendingDOM, resultDOM ] = document.getElementsByClassName('mbti-container');
const mbtiResultTitleDOM = document.getElementsByClassName('mbti-result')[0];
const mbtiResultDescriptonDOM = document.getElementsByClassName('mbti-description')[0];
const reTryButton = document.getElementsByClassName('mbti-retry-button')[0];

const mbtiQuestionList = [
  '짠 과자가 단 과자보다 좋다.',
  '봉지 과자가 박스 과자보다 좋다.',
  '과자를 뜯으면 한 번에 다 먹는다.'
];

let result;
const getMbtiResult = (resultValue) => {
  switch (resultValue) {
    case 0:
      result = {
        title: '과자 어린이 (A유형) ',
        description: '과자 어린이 (A유형)'
        }
      break;
    case 1:
      result = {
        title: '과자 초심자 (B유형) ',
        description: '과자 초심자 (B유형)'
        }
      break;
    case 2:
      result = {
        title: '과자 중급자 (C유형) ',
        description: '과자 중급자 (C유형)'
        }
      break;
    case 3:
      result = {
        title: '과자 고수 (D유형) ',
        description: '과자 고수 (D유형)'
        }
      break;
  }
}

let currentRound = 0;
let resultValue = 0;
const maxRound = mbtiQuestionList.length;

const setPendingSection = () => {
  pendingDOM.style.display = 'block';
  selectDOM.style.display = 'none';

  setTimeout(() => {
    pendingDOM.style.display = 'none';
    resultDOM.style.display = 'block';
  }, 2000)
};

const setResultSection = () => {

  getMbtiResult(resultValue);
  const { title, description } = result;

  mbtiResultTitleDOM.innerHTML = title;
  mbtiResultDescriptonDOM.innerHTML = description;

  console.log(reTryButton)
  reTryButton.onclick = () => {
    currentRound = 0;
    resultValue = 0;
    selectDOM.style.display = 'block';
    resultDOM.style.display = 'none';
    setMbtiSection();
  }

};

export const setMbtiSection = () => {

  if (currentRound === maxRound) {
    setPendingSection();
    setResultSection();
    return;
  }

  selectDOM.style.display = 'block';

  mbtiQuestionDOM.innerHTML = mbtiQuestionList[currentRound++];


  yesButton.onclick = () => {    // addEventListener 를 쓰면 세번째 부터 자동으로 클릭 이벤트가 발생하는 문제가 생김 
    resultValue++
    setMbtiSection();                                //재귀 사용
  }

  noButton.onclick = () => {
    setMbtiSection();
  }

}