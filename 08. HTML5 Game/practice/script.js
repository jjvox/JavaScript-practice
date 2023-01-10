;(function () {
  'use strict'

  const get = (target) => document.querySelector(target);

  const $canvas = get('canvas');
  const ctx = $canvas.getContext('2d');

  const $score = get('.score');
  const $highscore = get('.highscore');
  const $play = get('.js-play'); // js 이벤트가 일어날 곳엔 class 이름에 js- 를 이용해서 js이벤트가 일어나는 곳이라는걸 알려 주는게 좋다. 

  const colorSet = {  // 이런 식으로 옵션화 하는게 데이터 가져다 쓰기 좋다. 
    board: 'rgb(20, 105, 38)',  
    snakeHead: 'rgba(229, 65, 120, 0.929)',
    snakeBody: 'rgba(153, 206, 244, 0.498)',
    food: 'rgba(66, 187, 103)',
  }

  let start = 0;
  let option = {
    highscore: localStorage.getItem('score'),  // 로컬 스토리지는 직접 지우기 전까지는 브라우저에 계속 저장 되어 있다. 
    gameEnd: true,
    direction: 2,
    snake: [
      { x: 10, y: 10, direction: 2 },
      { x: 10, y: 20, direction: 2 },
      { x: 10, y: 30, direction: 2 },
    ],
    food: { x: 0, y: 0 },
    score: 0,
  }

  const init = () => {
    document.addEventListener('keydown', (e) => {
      if (!/Arrow/gi.test(e.key)) { // /Arrow/ 는 정규 표현식을 의미. gi 는 g: 전체 모든 문자열 변경, i:영문 대소문자 무시 모두 일치하는 패턴 검색, test() 메서드는 정규표현식과 일치하는 부분이 있으면 true없으면 false반환
                                    // 즉 Arrow가 반환 되었는지를 찾는것임.          
        return
      }
      e.preventDefault();

      const direction = getDirection(e.key);
      if(!isDirectionCorrect(direction)) {
        return;
      }
      option.direction = direction
    })

    $play.onclick = () => {
      if(option.gameEnd) {  
        option = {                                            // play를 누르면 옵션을 먼저 리셋 한다. 
          highscore: localStorage.getItem('score'),
          gameEnd: false,
          direction: 2,
          snake :[
            { x: 10, y: 10, direction: 2 },
            { x: 10, y: 20, direction: 2 },
            { x: 10, y: 30, direction: 2 },
          ],
          food: { x: 0, y: 0 },
          score: 0,
        }
        $score.innerHTML = `점수 : 0점`;
        $highscore.innerHTML = `최고점수 : ${option.highscore ? option.highscore : 0 }점`;
        randomFood();
        window.requestAnimationFrame(play); // 애니메이션이 반복적으로 일어 날때마다 함수를 호출. 
      }
    }
  };

  const buildBoard = () => {
    ctx.fillStyle = colorSet.board
    ctx.fillRect(0, 0, 500, 500);
  }

  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody;
    ctx.fillRect(x, y, 10, 10);
  }

  const buildFood = (ctx, x, y) => {
    ctx.beginPath();
    ctx.fillStyle = colorSet.food;
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI); // 원을 그려 준다. // 원의 중심축을 가운데로 가져오기 위해 x와 y에 원의 반지름 값인 5를 더해준다. 
    ctx.fill();
  }

  const setSnake = () => {
    for (let i = option.snake.length - 1; i >= 0; --i) {
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i === 0);
    }
  }

  const setHighscore = () => {
    const localScore = option.highscore * 1 || 0 ; // 곱하기 1 (*1) 을 해 준 이유는 숫자형으로 형 변환을 하기 위해서. 
    const finalScore = $score.testContent.match(/(\d+)/)[0]*1 // /(\d+)/  => 정규 표현식이다. \d는 숫자를 의미하고 + 는 최소 1개 이상을 의미 
                                                              // match(정규표현식) 을 할경우 정규표현식에 해당하는 것을 match가 찾아서 배열로 반환.
    if(localScore < finalScore) {
      alert(`최고기록 : ${finalScore}점`);
      localStorage.setItem('score',finalScore);
    }
  }

  const setDirection = (number, value) => {
    while (value < 0) { // x나 y 가 캔버스를 벗어 났다는 것을 의미 
      value += number;
    }
    return value % number;
  }
  
  const setBody = () => {
    const tail = option.snake[option.snake.length-1];
    const direction = tail.direction;
    let x = tail.x;
    let y = tail.y;

    switch (direction) { // 지렁이의 꼬리에 한칸 추가. 
      case 1:
        y = setDirection(500, y - 10);
        break;
      case -1:
        y = setDirection(500, y + 10);
        break;
      case -2:
        x = setDirection(500, x + 10);
        break;
      case 2:
        x = setDirection(500, x - 10);
        break;
    }
    option.snake.push({x, y, direction})
  }


  const getFood = () => {
    const snakeX = option.snake[0].x;
    const snakeY = option.snake[0].y;
    const foodX = option.food.x;
    const foodY = option.food.y;

    if (snakeX == foodX && snakeY == foodY) {  // 지렁이가 음식을 먹었을때
      option.score++;
      $score.innerHTML = `점수 : ${option.score}점`
      setBody();
      randomFood();
    }
  }


  const randomFood = () => {
    let x = Math.floor(Math.random() * 48 ) * 10 ;
    let y = Math.floor(Math.random() * 48 ) * 10 ;
    while (option.snake.some((part) => part.x === x && part.y === y)) {  // some은 배열 중에 일치하는 요소와 만나게 되면 리턴을 해준다. 
      x = Math.floor(Math.random() * 48 ) * 10 ;  // food가 생성 될때 생성 위치가 지렁이의 좌표값위라면 food를 다시 생성 한다. 
      y = Math.floor(Math.random() * 48 ) * 10 ;
    }
  
    option.food = {x, y};
  }

  const playSnake = () => {
    let x = option.snake[0].x;
    let y = option.snake[0].y;

    switch (option.direction) {
      case 1:
        y = setDirection(500, y + 10);
        break;
      case -1:
        y = setDirection(500, y - 10);
        break;
      case -2:
        x = setDirection(500, x - 10);
        break;
      case 2:
        x = setDirection(500, x + 10);
        break;
    }
    const snake = [{ x, y, direction: option.direction }];
    const snakeLength = option.snake.length;
    for (let i = 1; i < snakeLength; ++i) {
      snake.push({...option.snake[i - 1]});
    }
    option.snake = snake;
  }

  const getDirection = (key) => {
    let direction = 0;

    switch (key) {
      case 'ArrowDown': direction = 1;
        break;
      case 'ArrowUp': direction = -1;
        break;
      case 'ArrowLeft': direction = -2;
        break;
      case 'ArrowRight': direction = 2;
        break;
    }

    return direction;
  }

  const isDirectionCorrect = (direction) => {  // 진행방향의 반대방향으로 바로 가는걸 막아주는 예외 처리 함수. 
    return (
      option.direction === option.snake[0].direction && option.direction !== - direction  // 같은방향 또는 반대방향일 경우 . 
    )
  }

  const isGameOver = () => {
    const head = option.snake[0];
    return option.snake.some(
      (body, index) => index !== 0 && head.x === body.x && head.y === body.y
    )
  }

  const play = (t) => { // requestAnimationFrame() 메서드는 콜백 함수를 실행할 때 시점을 나타내는 DOMHighResTimeStamp를 콜백 함수에 전달 한다. (해당 함수에서 t로 표시해서 받음)
    // start++  // -> 이건 왜  ?? 

    if(option.gameEnd) {
      return;
    }
  
    if (t - start > 1000 / 12) { // 이전시간(start) 지금시간(t) 의 차이가 프레임간격 (1000/10) 보다 클때만 실행. 
                                // ( 1000 / 10 ) 은 1000ms(1초) 를 프레임으로 나눈 값으로 1프레임을 실행 시키는데 몇초를 쓰는지 의미 한다. ( 1000 / 100 ) -> 10ms마다 1프레임, 훨씬 빠름.   
      if(isGameOver()) {
        option.gameEnd = true;
        setHighscore();
        alert('게임오버');
        return;
      }

      playSnake();
      buildBoard();
      buildFood(ctx, option.food.x, option.food.y);
      setSnake();
      getFood();
      start = t;
    }

    window.requestAnimationFrame(play);
  }

  init();
})()
