import { ARROW_SCORE_KEY, MOUSE_CONTROL_SCORE_KEY, TOUCH_NUMBER_SCORE_KEY } from "./constants/localStorage.js";
import { appendChildrenList, makeDOMwithProperties } from "./utils/dom.js";
import { getTimeString } from "./utils/timer.js";

const gameInfoList = [
  {
    id: 1,
    url: 'mouse_control.html',
    thumnail: './public/assets/mouse_control_thumbnail.png',
    title: '마우스 컨트롤 게임',
    isNew: false,
  },
  {
    id: 2,
    url: 'touch_number.html',
    thumnail: './public/assets/touch_number_thumbnail.png',
    title: '숫자 클릭 게임',
    isNew: true,
  },
  {
    id: 3,
    url: 'arrow_speed.html',
    thumnail: './public/assets/arrow_speed_thumbnail.png',
    title: '방향키 게임',
    isNew: false,
  },
]

const localStorageKeyMap = {
  1: MOUSE_CONTROL_SCORE_KEY,
  2: TOUCH_NUMBER_SCORE_KEY,
  3: ARROW_SCORE_KEY
}

const getGameCard = ({
  id,
  url,
  thumnail,
  title,
  isNew
}) => {
  const gameCardDOM = makeDOMwithProperties('a', {
    className: 'game-card',
    href: url
  });
  const thumnailDOM = makeDOMwithProperties('img', {
    src: thumnail,
    alt: title,
  });
  const newBadgeDOM = isNew ? makeDOMwithProperties('span', {
    className: 'game-new-badge',
    innerHTML: 'new'
  }) : null;
  const titleDOM = makeDOMwithProperties('div', {
    className: 'game-title',
    innerHTML: title
  });

  const result = localStorage.getItem(localStorageKeyMap[id]);

  const resultDOM = makeDOMwithProperties('div', {
    className: 'game-result',
    innerHTML: result ? `최고 기록 : ${getTimeString(result)}` : '도전해 보세요!'
  });

  appendChildrenList(gameCardDOM, [thumnailDOM, newBadgeDOM, titleDOM, resultDOM]);

  return gameCardDOM;
};

const gameListContainer = document.getElementById('game-list-container');

gameInfoList.forEach((element) => {
  const cardDOM = getGameCard(element);
  gameListContainer.appendChild(cardDOM);
});

