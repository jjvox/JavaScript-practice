const saveBtn = document.getElementById('save');
const textInput = document.getElementById('text');
const size = document.getElementById('font-size');
const fileInput = document.getElementById('file');
const erase = document.getElementById('eraser');
const lineErase = document.getElementById('line-eraser');
const modeBtn = document.getElementById('mode-btn');
const color = Array.from(document.querySelectorAll('.color-option')); // HTMLCollection 으로 들어온 값을 Array로 바꿔서 할당.
const lineColor = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");  // 브러쉬 설정. 

canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = 'round'; // 붓의 끝부분을 둥글게 처리 한다. 
ctx.font = `${size.value}px serif`


let isPainting = false;
let isFilling = false;


function onMove(event) {
  if(isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }

  ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseDown() {
  isPainting = true;  
  ctx.beginPath(); // 새로운 path를 시작 한다. (이전 path와 연관을 끊고 다시 시작)
  if(isFilling) {
    ctx.fillRect(0,0, 800, 800);
  }
}

function onMouseUP() {
  isPainting = false;
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onLineColorChange(event) {
  
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const dataColor = event.target.dataset.color;
  ctx.strokeStyle = dataColor;  // HTMl 요소에 data-color="" 를 이용해서 컬러값을 넣어둠. 
  ctx.fillStyle = dataColor;  // data- 를 사용하면 원하는것 무엇이든 string타입으로 넣을 수 있다. (필요할때 JS로 찾아 쓰면 됨)
  lineColor.value = dataColor; // color input의 값도 클릭한 값으로 바꿔서 알려준다. 
}

function onModeClick() {
  if(isFilling) {
    isFilling = false;
    modeBtn.innerText = 'Fill'
  } else {
    isFilling = true;
    modeBtn.innerText = 'Draw'
  }
}

function onEraseClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0, 800, 800);
}

function onLineEraseClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = 'Fill'
}

function onFileChange(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);  // input 으로 해당 브라우저 메모리에 저장한 image파일을 URL 로 불러온다. 
    const image = new Image() // new Image는 html에서 <img src=""></img> 와 같다.
    image.src = url;
    image.onload = function () {  // event를 줌. addEventListener 말고 이렇게도 사용 가능. // load -> 컨텐츠가 로드 된 직후 실행
      ctx.drawImage(image, 0, 0, 800, 800);
      fileInput.value = null;
    };
}

function onFontSize(event) {
  
  ctx.font = `${event.target.value}px serif`;
  
}

function onDoubleClick(event) {
  const text = textInput.value;
  if(text !== ""){
    ctx.save(); // save() 함수는 ctx의 현재상태, 색상, 스타일 등 모든것을 저장 한다. 
    ctx.lineWidth = 1;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore() // 미리 저장 해둔 값으로 되돌린다. 
  }
}

function onSaveClick() {
  const url = canvas.toDataURL(); // 현재 캔버스에 있는 그림을 url로 만들어 준다. 
  const a = document.createElement('a'); // a태그 생성
  a.href = url;  // 하이퍼링크로 url 연결
  a.download = "myDrawing.png"  // a태그로 생성된 링크를 누르면 download진행
  a.click(); // a태그(a링크)를 click() 을 이용해서 클릭(동작 시키기).

  // createElement로 태그를 JS에 생성 한 뒤 굳이 appendChild로 hTML에 연결 시키지 않고 그냥 JS내에서 속성 지정하고 실행 시켜서 사용. 
}


canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUP);

lineWidth.addEventListener('change', onLineWidthChange)
lineColor.addEventListener('change', onLineColorChange)

color.forEach(color => color.addEventListener('click', onColorClick)) 

modeBtn.addEventListener('click', onModeClick);
erase.addEventListener('click', onEraseClick);
lineErase.addEventListener('click', onLineEraseClick);
fileInput.addEventListener('change', onFileChange);
saveBtn.addEventListener('click', onSaveClick);
size.addEventListener('change', onFontSize);