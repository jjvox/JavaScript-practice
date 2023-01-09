

const clock = document.querySelector('#clock');

function getClock() {
  const date = new Date();  // 날짜 불러오는 객체
  const hours = String(date.getHours()).padStart(2, '0');  // string이 2자리가 안되면 앞에 0을 붙혀준다. 1 -> 01 로 표기
  const minutes = String(date.getMinutes()).padStart(2, '0');  // date는 number이기 때문에 String() 으로 문자열로 바꾼 다음 padStart 사용함
  const seconds = String(date.getSeconds()).padStart(2, '0');

  clock.innerText = `${hours}:${minutes}:${seconds}`;
}

getClock();  // setInterval 때문에 처음 로딩 후 1초 후에 getClock함수가 실행되게 된다. 그래서 미리 직접 바로 실행을 한번 시켜 준다. 
setInterval(getClock, 1000);  // 매 1000ms 마다 getClock 함수를 실행 한다.
