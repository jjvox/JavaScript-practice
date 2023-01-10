;(function () {
  'use strict'
  const get = (target) => {
    return document.querySelector(target)
  }


  const $button = get('.modal_open_button');
  const $modal = get('.modal');
  const $body = get('body');
  const $modalCancelButton = get('.modal_button.cancel');
  const $modalConfirmButton = get('.modal_button.confirm');


  const toggleModal = () => {
    $modal.classList.toggle('show'); // toggle() 로 인해 show가 있으면 show를 없애주고 show가 없으면 show를 추가 해준다. 
    $body.classList.toggle('scroll_lock'); // modal창이 떠 있을때는 배경 스크롤이 안되게 한다. css overflow: hidden을 사용해서 스크롤이 필요없게 만듬.
  }

  $button.addEventListener('click', () => {
    toggleModal();
  })

  $modalConfirmButton.addEventListener('click', () => { // 확인 버튼 눌렀을때
    toggleModal();
  })

  $modalCancelButton.addEventListener('click', () => { // 취소 버튼 눌렀을때
    toggleModal();
  })

  window.addEventListener('click', (e) => { // 배경 버튼 눌렀을때 꺼지게 하기
    console.log(e.target)
    if(e.target === $modal) {
      toggleModal();
    }
  })

})()
