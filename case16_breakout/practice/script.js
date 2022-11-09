;(() => {
  'use strict'

  const get = (e) => document.querySelector(e);

  const keyEventControl = (control, func) => {
    document.addEventListener(control, func, false);
  }

  class BrickBreak {
    constructor(parent = 'body', data = {}) {
      this.parent = get(parent);
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('width', 480);
      this.canvas.setAttribute('height', 340);
      this.ctx = this.canvas.getContext('2d');
      this.fontFamily = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
      this.socre = 0;
      this.lives = data.lives;
      this.speed = data.speed;
      this.image = document.createElement('img');
      this.bg = data.bg;
      this.radius = 10;
      this.ballX = this.canvas.width / 2;
      this.ballY = this.canvas.height - 30;
      this.directX = data.speed;
      this.directY = -data.speed;
      this.paddleWidth = data.paddleWidth;
      this.paddleHeight = data.paddleHeight;
      this.rightPressed = false;
      this.leftPressed = false;
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2
      this.brickRow = data.brickRow;
      this.brickCol = data.brickCol;
      this.brickWidth = data.brickWidth;
      this.brickHeight = data.brickHeight;
      this.brickPad = data.brickPad;
      this.brickPosX = data.brickPosX;
      this.brickPosY = data.brickPosY;
      this.ballColor = data.ballColor;
      this.paddleColor = data.paddleColor;
      this.fontColor = data.fontColor;
      this.brickStartColor = data.brickStartColor;
      this.brickEndColor = data.brickEndColor;
      this.image.setAttribute('src', this.bg);
      this.parent.appendChild(this.canvas);
      this.bricks = [];
    }

    init = () => {
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        this.bricks[colIndex] = []
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 };
        }
      }

      this.keyEvent()
      this.draw()
    }

    keyupEvent = (e) => {
      if ('Right' === e.key || 'ArrowRight' === e.key) {
        this.rightPressed = false;
      } else if ('Left' === e.key || 'ArrowLeft' === e.key) {
        this.leftPressed = false;
      }
    }

    keyEvent = () => {
      keyEventControl('keyup', this.keyupEvent);
      keyEventControl('keydown', this.keydownEvent);
      keyEventControl('mousemove', this.mousemoveEvent);
    }


    keydownEvent = (e) => {
      if ('Right' === e.key || 'ArrowRight' === e.key) {
        this.rightPressed = true;
      } else if ('Left' === e.key || 'ArrowLeft' === e.key) {
        this.leftPressed = true;
      }
    }

    mousemoveEvent = (e) => {
      const positionX = e.clientX - this.canvas.offsetLeft

      if (0 < positionX && positionX < this.canvas.width) {
        this.paddleX = positionX - this.paddleWidth / 2 
      }
    }

    drawBall = () => {
      this.ctx.beginPath();
      this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2);  // 원을 만든다. 
      this.ctx.fillStyle = this.ballColor;
      this.ctx.fill()  // 실제로 공을 그려준다. 
      this.ctx.closePath();
    }

    drawPaddle = () => {
      this.ctx.beginPath;
      this.ctx.rect(
        this.paddleX,
        this.canvas.height - this.paddleHeight,
        this.paddleWidth,
        this.paddleHeight
      )
      this.ctx.fillStyle = this.paddleColor;
      this.ctx.fill();
      this.ctx.closePath;
    }

    drawBricks = () => {
      let brickX = 0;
      let brickY = 0;
      let gradient = this.ctx.createLinearGradient(0, 0, 200, 0);
      gradient.addColorStop(0, this.brickStartColor);
      gradient.addColorStop(1, this.brickEndColor);

      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          if (1 !== this.bricks[colIndex][rowIndex].status) {  // status가 1이 아니면 깨진 블럭
            continue;
          }
          brickX = colIndex * (this.brickWidth + this.brickPad) + this.brickPosX; // brick이 그려질 위치를 구한다. 
          brickY = rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY;

          this.bricks[colIndex][rowIndex].x = brickX;   // 이중 for문이 돌면서 x,y 좌표를 bricks 객체에 입력 해준다. 
          this.bricks[colIndex][rowIndex].y = brickY;

          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);  // 구해진 위치에 맞춰 brick을 그려준다. 
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }

    drawScore = () => {
      this.ctx.font = this.fontFamily;
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillText(`점수 : ${this.socre}`, 10, 22)  // x축을 10 y축으로 22 떨어져 있음
    }

    drawLives = () => {
      this.ctx.font = this.fontFamily;
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillText(`목숨 : ${this.lives}`, this.canvas.width - 70, 22)
    }

    detectCollision = () => {
      let currentBrick = {}
      
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex ++) {
          currentBrick = this.bricks[colIndex][rowIndex];
          if (1 !== currentBrick.status) {
            continue;
          }
          if (
            this.ballX > currentBrick.x &&
            this.ballX < currentBrick.x + this.brickWidth &&
            this.ballY > currentBrick.y &&
            this.ballY < currentBrick.y + this.brickHeight
          ) {
            this.directY = -this.directY;
            currentBrick.status = 0;
            this.score++

            if (this.score !== this.brickCol * this.brickRow) {
              continue;
            } 
            alert('승리')
            this.reset()
          }
        }
      }
    }

    draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // 전체 캔버스에 있는 영역을 한번 지워 준다. 

      this.ctx.drawImage(
        this.image,
        this.canvas.width / 2 - this.image.width / 2,
        this.canvas.height / 2 - this.image.height / 2
      )

      this.drawBall();
      this.drawPaddle();
      this.drawBricks();
      this.drawScore();
      this.drawLives();
      this.detectCollision();

      if (this.ballX + this.directX > this.canvas.width - this.radius || this.ballX + this.directX < this.radius) {
        this.directX = -this.directX;
      }

      if (this.ballY + this.directY < this.radius) {
        this.directY = -this.directY;
      } else if (this.ballY + this.directY > this.canvas.height - this.radius) {
        if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
          this.directY = -this.directY;
        } else {
          this.lives--;
          if (this.lives === 0) {
            alert('Game Over')
            this.reset();
          } else {
            this.ballX = this.canvas.width / 2;
            this.ballY = this.canvas.height - this.paddleHeight;
            this.directX = this.speed;
            this.directY = this.speed;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
          }

        }
      }

      if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
        this.paddleX += 7;
      } else if (this.leftPressed && 0 < this.paddleX) {
        this.paddleX -= 7;
      } 

      this.ballX += this.directX;
      this.ballY += this.directY;
      requestAnimationFrame(this.draw)
    }

    reset = () => {
      document.location.reload();
    }

  }

  const data = {
    lives: 5,
    speed: 2,
    paddleHeight: 10,
    paddleWidth: 75,
    bg: './assets/bg.jpeg',
    ballColor: '#04bf55',
    paddleColor: '#05aff2',
    fontColor: '#f2bb16',
    brickStartColor: '#f29f05',
    brickEndColor: '#f21905',
    brickRow: 3,
    brickCol: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPad: 10,  // brick들 사이의 패딩값
    brickPosX: 30,
    brickPosY: 30,
  }

  const brickBreak = new BrickBreak('.canvas', data);
  brickBreak.init()

})()


// 게임을 만들때는 게임의 배경, 게임에 사용 되는 것들을 먼저 모두 만든 다음 움직임을 넣어 준다. 
// canvas 를 별로 사용 안 할줄 알았는데 생각보다 여기저기 많이 사용 되는거 같다. 
// ctx 관련 메소드나 용법을 공부 해야겠다.
// 객체를 이렇게 제대로? 사용 해본게 처음이다. 생각 한것 보다 객체의 용도는 엄청난듯. 
// 이번에는 화면을 구성 하는거나 동작 하는거나 전부 좌표를 구해서 이뤄졌다. canvas를 편하게 다루기 위해선 위치값을 구하고 이를 자유자재로 활용 할 수 있도록 해야 겠다. 