(function () {
  "use strict";

  const shops = [
    {
      id: 1292273001,
      name: "매콤돈가스&칡불냉면 판교점",
      lat: 37.40189834738935,
      lng: 127.10624455094185,
    },
    {
      id: 1151112822,
      name: "탄탄면공방 판교테크노밸리점",
      lat: 37.40193038525563,
      lng: 127.11060980539878,
    },
    {
      id: 15775065,
      name: "파리바게뜨 판교테크노점",
      lat: 37.40133360873933,
      lng: 127.10801128231743,
    },
  ];

  const defaultPos = {
    lat: 37.4020589,
    lng: 127.1064401,
  };

  const get = (target) => {
    return document.querySelector(target);
  };

  const $map = get("#map");
  const $geoLocationButton = get(".geolocation_button");

  const mapContainer = new kakao.maps.Map($map, {
    // 카카오 map가져오기 .
    center: new kakao.maps.LatLng(defaultPos.lat, defaultPos.lng),
    level: 3,
  });

  const createMarkerImage = () => {
    // 마크 이미지와 사이즈를 세팅함
    const markerImageSrc = "assets/marker.png";
    const imageSize = new kakao.maps.Size(20, 35);
    return new kakao.maps.MarkerImage(markerImageSrc, imageSize);
  };

  const createMarker = (lat, lng) => {
    // 마크 이미지를 생성해 준다.
    const marker = new kakao.maps.Marker({
      map: mapContainer,
      position: new kakao.maps.LatLng(lat, lng),
      image: createMarkerImage(),
    });
    return marker;
  };

  const createShopElement = () => {
    shops.map((shop) => {
      const { lat, lng } = shop;
      const marker = createMarker(lat, lng);
      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 2px;">
                  <a href="https://place.map.kakao.com/${shop.id}" target="_blank" style="text-decoration:none; color:black;" >${shop.name}</a>
                </div>`,
      });
      infoWindow.open(mapContainer, marker);
    });
  };

  const successGeolocation = (position) => {
    // 현재 내 위치를 보여줌.
    const { latitude, longitude } = position.coords; // 내 위치의 위도 경도 값
    mapContainer.setCenter(new kakao.maps.LatLng(latitude, longitude)); // 내 위치의 위도 경도를 가운데로 map을 세팅
    const marker = createMarker(latitude, longitude); // 마커 만들기
    marker.setMap(mapContainer); // 내 위치에 마커 그리기
  };

  const errorGeolocation = (error) => {
    // 현재 내 위치 정보를 찾을 수 없음.
    if (error.code === 1) {
      alert("위치 정보를 허용해주세요");
    } else if (error.code === 2) {
      alert("사용 할 수 없는 위치 입니다.");
    } else if (error.code === 3) {
      alert("타임아웃이 발생 했습니다.");
    } else {
      alert("알수 없는 오류가 발생 했습니다.");
    }
  };

  const getLocation = () => {
    // 현재 내 위치 찾기
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        // 현재 위치 가져오기
        successGeolocation, // 성공 했을때
        errorGeolocation // 실패 했을때.
      );
    } else {
      alert("지도 api 사용 불가"); // 'geolocation' 정보가 없을때.
    }
  };

  const init = () => {
    $geoLocationButton.addEventListener("click", () => {
      getLocation();
    });
    createShopElement();
  };

  init();
})();

// kakao mpa api 사용 설명 을 보고 따라함.
// 지도, 위치 관련 공부할게 많음.
