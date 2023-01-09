export const countUp = (dom, target = 100, number = 1) => { //target : 목표 숫자.
  //Dom의 innerHTML 을 갱신 해줌. 
  if (!dom || isNaN(Number(target)) || isNaN(Number(number))) return; // dom이 없거나 target과 number가 숫자가 아니면 반환
  
  let nowNumber = 0; // 현재 값

  const timerId = setInterval(() => {
    if (nowNumber < target) {
      nowNumber += number;
      
      if (nowNumber >= target) {
        nowNumber = target;
      }
      dom.innerHTML = `${nowNumber.toLocaleString()}`;

    } else {

      clearInterval(timerId)  // timerId(Interval 함수)를 제거 해준다.  
    }
  }, 10) // 1초마다 해당 함수 실행
};