
import { SELECT_RESULT_KEY } from "../constants/result.js";
import { appendChildrenList, makeDOMwithProperties } from "../utils/dom.js";

const cardInfoList = [
  {
    id: 1,
    imgSrc: './public/assets/초코꼬북칩.jpeg',
    name: '초코꼬북칩',
    description: '맛있는 초코 꼬북칩'
  },
  {
    id: 2,
    imgSrc: './public/assets/나쵸.jpeg',
    name: '나쵸',
    description: '맛있는 나쵸'
  },
  {
    id: 3,
    imgSrc: './public/assets/허니버터칩.jpeg',
    name: '허니버터칩',
    description: '구하기 힘들었던 허니버터칩'
  },
  {
    id: 4,
    imgSrc: './public/assets/홈런볼.jpeg',
    name: '홈런볼',
    description: '맛있는 홈런볼'
  },
]

const snackCardList = document.getElementsByClassName('snack-card-list')[0];
const selectButtonDOM = document.getElementsByClassName('participate-button')[0];
const [notyetContainerDOM, resultContainerDOM] = document.getElementsByClassName('result-container');
const [, resultImageDOM, resultNameDOM, resultDescriptionDOM, reTryDOM] = resultContainerDOM.children; // resultContainerDOM의 자식 element들을 가져 온다. 
 //배열 구조분해 할당으로 첫번째는 건너 뛰고 2,3,4, 5 번째 요소를 가져 온다. 

const getSelectCard = () => {
  return document.getElementsByClassName('select')[0];
}

const getCardById = (id) => {
  return document.getElementById(`select-${id}`);
}

const handleSelectCard = (cardId) => {
  const originalSelectedCard = getSelectCard();  // 클릭시 다른 과자가 선택되어 있다면
  if (originalSelectedCard) {
    originalSelectedCard.classList.remove('select');  // 선택을 없애준다.
  }

  const newSelectedCard = getCardById(cardId);  // 클릭한 과자의 id값으로 DOM 을 찾아
  if (newSelectedCard) {
    newSelectedCard.classList.add('select');  // select class를 추가 해준다. 
  }
}

const getSelectCardDOM = ({   // 과자 버튼을 그려준다. 
  id,
  imgSrc,
  name,
  description
}) => {
  const snackCardDOM = makeDOMwithProperties('button', {
    id: `select-${id}`,
    className: 'snack-card',
    onclick: () => handleSelectCard(id)       // button을 클릭 하면 선택 되는 함수 연결
  });

  const imgDOM = makeDOMwithProperties('img', {
    src: imgSrc,
    alt: name
  });
  const descriptionContainerDOM = makeDOMwithProperties('div', {
    className: 'snack-description'
  });
  const nameDOM = makeDOMwithProperties('div', {
    innerHTML: name
  });
  const descriptionDOM = makeDOMwithProperties('div', {
    innerHTML: description
  });

  appendChildrenList(descriptionContainerDOM, [nameDOM, descriptionDOM]);
  appendChildrenList(snackCardDOM, [imgDOM, descriptionContainerDOM]);

  return snackCardDOM;
};

export const setSelectCards = () => {
  cardInfoList.forEach((cardInfo) => {
    const selectCardDOM = getSelectCardDOM(cardInfo);
    snackCardList.appendChild(selectCardDOM);
  });
  const cardId = Number(localStorage.getItem(SELECT_RESULT_KEY));
  if (!cardId || isNaN(cardId)) return;
  
  handleSelectCard(cardId);
};

export const setSelectButton = () => {

  selectButtonDOM.addEventListener('click', () => {
    const selectedCard = getSelectCard();
    if (!selectedCard) {
      alert('선택된 카드가 없습니다.');
      return;
    }
    const cardId = selectedCard.id?.split("-")[1];
    localStorage.setItem(SELECT_RESULT_KEY, cardId);  // 선택하기 버튼을 누르면 해당 DOM 의 id가 localstorage에 저장 된다. 

    const selecttedName = selectedCard.getElementsByTagName('img')[0].alt;
    alert(`${selecttedName} 을(를) 선택 하셨습니다.`);

    setResultContainer();

    const resultSectionDOM = document.getElementById('result-section')
    const scrollTargetY = resultSectionDOM.offsetTop;
    window.scroll({                                    
    top: scrollTargetY,
    left: 0,
    behavior: 'smooth'
    });
  });
};

export const setResultContainer = () => {
  const selectedId = Number(localStorage.getItem(SELECT_RESULT_KEY));
  if (!selectedId) {
    notyetContainerDOM.style.display = 'block';
    resultContainerDOM.style.display = 'none';
    return;
  };

  notyetContainerDOM.style.display = 'none';
  resultContainerDOM.style.display = 'flex';

  const cardInfo = cardInfoList.find((element) => element.id === selectedId);
  
  resultImageDOM.src = cardInfo.imgSrc;
  resultImageDOM.alt = cardInfo.name;
  resultNameDOM.innerHTML = cardInfo.name;
  resultDescriptionDOM.innerHTML = cardInfo.description;

  reTryDOM.addEventListener('click', () => {  // 다시하기 버튼

    localStorage.removeItem(SELECT_RESULT_KEY);

    const originalSelectedCard = getSelectCard(); 
    originalSelectedCard.classList.remove('select');

    setResultContainer();

    const selectSectionDOM = document.getElementById('participate-section');
    const scrollTargetY = selectSectionDOM.offsetTop;
    window.scroll({                                    
    top: scrollTargetY,
    left: 0,
    behavior: 'smooth'
    });
  })
}