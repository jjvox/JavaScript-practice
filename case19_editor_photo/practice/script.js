;(() => {
  'use strict'

  const get = (e) => document.querySelector(e);

  class PhotoEditor {
    constructor() {
      this.container = get('main');
      this.canvas = get('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.width = 700;
      this.height = 411;
      this.minSize = 20;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx.lineWidth = 2;   // 크롭 할때 라인의 넓이
      this.ctx.strokeStyle = '#ff0000';
      this.targetImage = get('.image_wrap');
      this.targetCanvas = document.createElement('canvas');
      this.targetCtx = this.targetCanvas.getContext('2d');
      this.targetWidth;
      this.targetHeight;
      this.sourceX;
      this.sourceY;
      this.sourceWidth;
      this.img = new Image();
      this.btnFlip = get('.btn_flip');
      this.btnSepia = get('.btn_sepia');
      this.btnGray = get('.btn_gray');
      this.btnSave = get('.btn_save');
      this.fileDrag = get('.drag_area');
      this.fileInput = get('.drag_area input');
      this.fileImage = get('.fileImage');
      this.clickEvent();
      this.fileEvent();
      this.drawEvent();
    }

    clickEvent() {
      this.btnFlip.addEventListener('click', this.flipEvent.bind(this));
      this.btnSepia.addEventListener('click', this.sepiaEvent.bind(this));
      this.btnGray.addEventListener('click', this.grayEvent.bind(this));
      this.btnSave.addEventListener('click', this.download.bind(this));
    }

    fileEvent() {
      this.fileInput.addEventListener('change', (e) => { // input으로 이미지 파일 가져옴
        const fileName = URL.createObjectURL(e.target.files[0]);  // 브라우저로 가져온 이미지파일을 url 로만듬 
        const img = new Image();  // img 생성자 함수로 생성 

        this.fileImage.setAttribute('src', fileName);
        img.setAttribute('src', fileName)

        img.addEventListener('load', (e) => {  // load event 설정. img가 다 로딩 되었을때 실행됨. 
          this.width = e.path[0].naturalWidth;
          this.height = e.path[0].naturalHeight;
        })
      })
    }

    flipEvent() {
      this.targetCtx.translate(this.targetWidth, 0);  // 공부필요
      this.targetCtx.scale(-1, 1);  // 공부필요
      this.targetCtx.drawImage( 
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }

    sepiaEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.targetCtx.filter = 'sepia(1)';
      this.targetCtx.drawImage( 
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }

    grayEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.targetCtx.filter = 'grayscale(1)';
      this.targetCtx.drawImage( 
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }

    download() {
      const url = this.targetCanvas.toDataURL();  // base64 문자열로 받는다.
      const downloader = document.createElement('a');
      downloader.style.display = 'none';
      downloader.setAttribute('href', url);
      downloader.setAttribute('download', 'canvas.png');
      this.container.appendChild(downloader);
      downloader.click();
      setTimeout(() => {
        this.container.removeChild(downloader)
      }, 100);
    }

    drawEvent() {
      const canvasX = this.canvas.getBoundingClientRect().left;  // 캔버스의 높이와 넓이와 위치를 가져올수 있는 메서드
      const canvasY = this.canvas.getBoundingClientRect().top;
      let sX, sY, eX, eY;
      let drawStart = false;

      this.canvas.addEventListener('mousedown', (e) => {  // 클릭지점의 좌표를 가저온다. 

        sX = parseInt(e.clientX - canvasX, 10); 
        sY = parseInt(e.clientY - canvasY, 10);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        drawStart = true;
      })

      this.canvas.addEventListener('mousemove', (e) => {
        if (!drawStart) return;

        eX = parseInt(e.clientX - canvasX, 10);
        eY = parseInt(e.clientY - canvasY, 10);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(sX, sY, eX - sX, eY - sY);
      })
      
      this.canvas.addEventListener('mouseup', () => {
        drawStart = false;

        if (Math.abs(eX - sX) < this.minSize || Math.abs(eY - sY) < this.minSize) return;
        
        this.drawOutput(sX, sY, eX - sX, eY - sY);
      })
    }

    drawOutput(x, y, width, height) {
      
      this.targetImage.innerHTML = '';  // image wrap 부분을 지워준다. (매번 새로 그리기 때문에.)
      
      if (Math.abs(width) <= Math.abs(height)) {  // crop 한 부분의 넓이보다 높이가 클때
        this.targetHeight = this.height;  // crop 이미지를 그려주는 곳의 높이에 crop이미지의 높이를 맞춘다.
        this.targetWidth = (this.targetHeight * width) / height;  // crop이미지의 넓이를 구해줌  => 이해 안감.
      } else {
        this.targetWidth = this.width;
        this.targetHeight = (this.targetWidth * height) / width;
      }
      this.targetCanvas.width = this.targetWidth;
      this.targetCanvas.height = this.targetHeight;

      this.img.addEventListener('load', () => {
        const buffer = this.img.width / this.width;
        this.sourceX = x * buffer;
        this.sourceY = y * buffer;
        this.sourceWidth = width * buffer;
        this.sourceHeight = height * buffer;
        this.targetCtx.drawImage(  //img를 그려주는 CanvasRenderingContext2D.drawImage() 메서드.
          this.img,  
          this.sourceX,
          this.sourceY,
          this.sourceWidth,
          this.sourceHeight,
          0,
          0,
          this.targetWidth,
          this.targetHeight
        )
      })
      this.img.src = this.fileImage.getAttribute('src');
      this.targetImage.appendChild(this.targetCanvas)
    }

  }

  new PhotoEditor()

})()


//CanvasRenderingContext2D 의 사용도가 정말 많다. 사용 할때마다 찾아보고 공부 필요함. 