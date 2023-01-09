const API_KEY = '9c8ae4b3950773cd5511848cfc2a827d';

function onGeoOk(position){
  const lat = position.coords.latitude; //위도
  const lng = position.coords.longitude; //경도
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`; // 위도 경도를 이용한 날씨정보 API
  fetch(url)  // JS가 fetch를 이용해서 url로 부터 데이터 얻는다.
  .then((response) => response.json())
  .then((data) => {
    const weather = document.querySelector("#weather span:nth-of-type(2)");
    const city = document.querySelector("#weather span:nth-of-type(1)");
    const temp = document.querySelector("#weather span:nth-of-type(3)");
    city.innerText = data.name;
    weather.innerText = data.weather[0].main;
    temp.innerText = `${data.main.temp}℃`;
  });  
}
function onGeoError(){
  alert("위치를 찾을 수 없습니다.")
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)  // 현재 내 위치 값을 준다. 매개변수로 성공시, 실패시 함수 두개를 받는다. 