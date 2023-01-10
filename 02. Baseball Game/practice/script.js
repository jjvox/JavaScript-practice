;(function () {
  'use strict' // 엄격하게 실행. 

  const get = (target) => document.querySelector(target);

  const init = () => {  //실행함수
    get('form').addEventListener('submit', (event) => {
      playGame(event);
    })
    setPassword()
  }

  const baseball = {
    limit: 10, // 게임 횟수 제한
    digit: 4, // 입력 숫자 자릿수 
    trial: 0, // 시도 횟수
    end: false,
    $question:get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input'),
  }

  const { limit, digit, $question, $answer, $input} = baseball; //destructuring - 객체 내의 key값을 바로바로 사용 가능하게 함.  
  let { trial, end } = baseball;

  const setPassword = () => {  //정답(password) 지정
    const gameLimit = Array(limit).fill(false); // index 0 ~ 9 의 배열에 전부 false로 채워 넣는다. 
    let password = '';
    while (password.length < digit) {  // while문을 사용해 password가 4자리가 될 때 까지 숫자를 추가한다.
      const random = parseInt(Math.random() * 10, 10); // 랜덤값 생성

      if(gameLimit[random]) { // 이미 이전에 나왓던 숫자면 다시 숫자를 뽑는다. 
        continue;
      }

      password += random;  // 얻은 random 값을 password에 4자리가 될때까지 더한다. 
      gameLimit[random] = true; // Array에 random값과 같은 index에 false를 true로 바꾼다. 

    }

    baseball.password = password; // baseball 객체에 정답을 추가한다. 
  }

  const onPlayed = (number, hint) => {
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`;  // 게임 플레이, 시도 횟수와 내가 입력한 수, 그리고 strike, ball 여부를 반환
  }

  const isCorrect = (number, answer) => {  // 내가 입력한 수 (number) 와 정담 (answer) 가 일치 하는지 확인.
    return number === answer
  }

  const isDuplicate = (number) => {  // 중복이 있는가 ?
    return [...new Set(number.split(''))].length !== digit // new Set 으로 중복된 것들을 날려준다. 그러므로 중복이 있으면 set의 length가 digit과 달르게 되고 true가 반환 된다.
  }

  const getStrike = (number, answer) => {  // strike여부 판별
    let strike = 0;
    const nums = number.split('');  // 입력한 number를 배열로 만든다. 

    nums.forEach((item, index) => {  
      if (item === answer[index]) {  // 배열의 각 요소가 정답과 숫자와 index(자리) 모두 일치 할 경우 strike
        strike++
      }
    })

    return strike;
  }

  const getBalls = (number, answer) => { // ball여부 판별
    let ball = 0;
    const nums = number.split('');  
    const gameLimit = Array(limit).fill(false);  // 0~9 index를 가진 배열 을 만들고 false로 채워 넣는다. 

    answer.split('').forEach((num) => {
      gameLimit[num] = true;  // 정답 각 자리의 숫자에 해당하는 index값을 false에서 true로 바꾼다. 
    })

    nums.forEach((num, index) => {   
      if (answer[index] !== num && gameLimit[num]) { // 숫자는 맞지만 위치가 다를때를 판별 
        ball++
      }
    })
    return ball;
  }

  const getResult = (number, answer) => {  // 결과출력
    if(isCorrect(number, answer)) {  // isCorrect 가 true이면
      end = true;
      $answer.innerHTML = baseball.password  // 결과창에 정답을 띄움
      return '홈런 !!';  
    }

    const strike = getStrike(number, answer); // strike 수 
    const balls = getBalls(number, answer); // ball 수

    return 'STRIKE: ' + strike + ', BALL: ' + balls; 
  }

  const playGame = (event) => {
    event.preventDefault()  // submit에 의한 새로고침 방지

    if (end) {  // end 가 true일 경우 횟수가 10회 끝났거나 정답이 나온 상태 이므로 바로 return 
      return
    }

    const inputNumber = $input.value; // 입력값 
    const { password } = baseball  // 정답
    
    if (inputNumber.length !== digit) {  // digit에 맞는 자릿수를 입력하지 않았을때
      alert(`${digit}자리 숫자를 입력해 주세요`)
    } else if (isDuplicate(inputNumber)) {  // 중복된 숫자를 입력 했을때
      alert('중복 숫자가 있습니다.')
    } else {
      trial++ // 시도 횟수 증가 
      const result = onPlayed(inputNumber, getResult(inputNumber, password))  
      $question.innerHTML += `<span>${result}</span>`

      if(limit <= trial && !isCorrect(inputNumber, password)) {
        alert('쓰리아웃!');
        end = true;
        $answer.innerHTML = password;
      }

      $input.value = ''
      $input.focus();
    }
  }

  init()

})()

