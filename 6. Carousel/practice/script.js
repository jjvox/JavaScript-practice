;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target);
  }

  class Carousel { // 캐러셀 같은 경우 class로 많이 만든다. 
    constructor(carouselElement) {
      this.carouselElement = carouselElement,
      this.itemClassName = 'carousel_item',
      this.items = this.carouselElement.querySelectorAll('.carousel_item'), // querySelectorAll로 가져오면 유사배열 객체로 가져 오게 된다. 

      this.totalItems = this.items.length, // 아이템의 총 갯수. 
      this.current = 0 // 처음 로딩 했을때 첫번째 carousel을 가리키게 된다. 
      this.isMoving = false;
    }

    initCarousel() {  // 초기 실행값을 세팅 한다. 
      this.isMoving = false;  // isMoving이 false일 때만 작동 하게 함. 
      this.items[0].classList.add('active');  // 첫 화면에 보이는 값
      this.items[1].classList.add('next');
      this.items[this.totalItems-1].classList.add('prev'); 
    }

    disableInteraction() {  // 연속으로 실행 되는것을 막고 일정 시간 지연 시켜 자연스럽게 움직이게 한다.
      this.isMoving = true;
      setTimeout(() => {
        this.isMoving = false;
      }, 800)
    }

    setEventListener() {
      this.prevButton = this.carouselElement.querySelector('.carousel_button--prev');
      this.nextButton = this.carouselElement.querySelector('.carousel_button--next');

      this.prevButton.addEventListener('click', () => {
        this.movePrev();
      });
      this.nextButton.addEventListener('click', () => {
        this.moveNext();
      });
    }

    moveCarouselTo() {
      if (this.isMoving) return; // isMoving이 true일 경우 함수를 실행 시키지 않고 반환한다. 
      this.disableInteraction();
      let prev = this.current - 1; // 현재값에서 1을 뺀 값이 prev
      let next = this.current + 1; // 현재값에서 1을 더한 값이 next

      if (this.current === 0) {
        prev = this.totalItems -1;
      } else if (this.current === this.totalItems -1) {
        next = 0;
      }
      
      for (let i = 0; i < this.totalItems; i++) {  // 캐러셀 이미지를 쭈욱 탐색 하면서 적정 className을 할당 한다. 
        if (i === this.current) {
          this.items[i].className = this.itemClassName + ' active';
        } else if (i === prev) {
          this.items[i].className = this.itemClassName + ' prev';
        } else if (i === next) {
          this.items[i].className = this.itemClassName + ' next';
        } else {
          this.items[i].className = this.itemClassName;
        }
      }
    };

    moveNext() { // 다음버튼
      if (this.isMoving) return;
      if (this.current === this.totalItems - 1) { // 현재 current 가 마지막 carousel 에 있을 경우  
        this.current = 0; // current 를 맨 앞 carousel으로 보낸다. 
      } else {
        this.current++; // 그게 아닐 경우 current값을 1 올려준다. 
      }
      this.moveCarouselTo(); 
    }

    movePrev() {
      if (this.isMoving) return;
      if (this.current === 0) { // 현재 current가 맨 앞 carousel에 있을 경우 
        this.current = this.totalItems - 1;  // current를 맨 뒤(마지막) carousel로 보낸다. 
      } else {
        this.current--;
      }
      this.moveCarouselTo(); 
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel');
    const carousel = new Carousel(carouselElement); // carousel 인스턴스 생성

    carousel.initCarousel(); // 초기 carousel 설정.
    carousel.setEventListener(); // eventListner를 설정.
  });

})()
