const images = ["0.jpg", "1.jpg", "2.jpg", "3.jpg"];

const choseImage = images[Math.floor(Math.random() * images.length)]; // 무작위로 index 값 생성

const bgImage = document.createElement("img")

bgImage.src = `img/${choseImage}` // src 속성값 입력

document.body.appendChild(bgImage);



