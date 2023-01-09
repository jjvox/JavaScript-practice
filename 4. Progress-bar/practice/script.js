;(function () {
  'use strict'

  let timerId;

  const get = (target) => {
    return document.querySelector(target);
  }

  const throttle = (callback, wait) => { // throttle 실행.

    if (timerId) return; // 설정한 시간 동안 함수 실행을 방지 

    timerId = setTimeout(() => {  // setTimeout() 함수는 '타임 아웃 아이디'라고 불리는 숫자를 반환 한다. 
      callback();
      timerId = undefined; // timerId에 할당된 '타임아웃아이디'를 초기화 해준다. 
    }, wait);

  }

  const $progressBar = get('.progress-bar'); // progress바 가져옴

  const onScroll = () => {
    const height = 
      document.documentElement.scrollHeight - // documentElement.scrollHeight : 컨텐츠의 총 높이를 나타냄. ( 바깥으로 넘쳐서 보이지 않는 컨텐츠도 포함)
      document.documentElement.clientHeight;  // documentElement.clientHeingt : 보여지는 부분의 높이 
                                              // 총 높이에서 보여지는 부분의 높이를 빼서 가려진 부분(스크롤 되야 하는곳)의 높이를 구함. 
    
    const scrollTop = document.documentElement.scrollTop;  // 스크롤된 높이 구하기.

    const width = (scrollTop / height) * 100;   // 스크롤이 위에 있을땐 0 값을 가지고 가장 아래에 있을땐 height와 같은 값이 됨. 그러므로 width 값은 0~100 이됨.
    
    $progressBar.style.width = width + '%';  // progress바의 길이를 스크롤바와 같게 움직이도록 %로 표시 함. 
  }

  window.addEventListener('scroll', () => throttle(onScroll, 70));
})()
