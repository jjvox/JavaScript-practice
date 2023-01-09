;(function () {
  'use strict'

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const $search = get('#search'); // HTML에서 node를 가져올땐 변수 앞에 $표시를 써줘서 node라는 것을 나타낸다.
  const $list = getAll('.contents.list figure');
  const $searchButton = get('.btn_search');

  const $player = get('.view video');
  const $btnPlay = get('.js-play');
  const $btnReplay = get('.js-replay');
  const $btnStop = get('.js-stop');
  const $btnMute = get('.js-mute');
  const $progress = get('.js-progress');
  const $volume = get('.js-volume');
  const $fullscreen = get('.js-fullScreen');

  let Orivolume;


  const init = () => {
    $search.addEventListener('keyup', search);  // 키보드로 검색
    $searchButton.addEventListener('click', search);  // 마우스로 검색 버튼 클릭
    
    for(let i = 0; i < $list.length; i++) {
      const $target = $list[i].querySelector('picture');
      $target.addEventListener('mouseover', onMouseOver);  // 이미지에 마우스를 올리면 재생 (이미지파일을 영상 파일로 바꿔줌.)
      $target.addEventListener('mouseout', onMouseOut);  // 이미지에서 마수를 떼면 재생 정지 (영상파일을 이미지 파일로 바꿔줌)
    };

    for(let i = 0; i < $list.length; i++) { 
      $list[i].addEventListener('click', hashChange);  // 컨텐츠를 클릭하면 hash값을 바꿈.
    }
    
    window.addEventListener('DOMContentLoaded', () => {
      window.location.hash = '#none';  // 처음 화면이 load될 때 hash값을 리셋 해준다. 
    })

    window.addEventListener('hashchange', () => { // 해쉬값이 바뀌었을때 함수 실행. 
      const isView = -1 < window.location.hash.indexOf('view'); // index는 0부터 시작함. hash에 'view'가 포함 될 경우 무조건 0 보다 큰 값을 가짐. 
      if (isView) {  // hash에 'view'가 포함 되어 있을 경우
        getViewPage();  // viewpage를 불러 온다. 
      } else {
        getListPage(); // 그렇지 않을 경우 List를 불러 온다. 
      };
    });

    viewPageEvent(); // viewpage다루기. 
  };



  const search = (e) => {
    if (e.key !== "Enter" && e.target.value !== "") return;  // 눌려진 key가 enter이거나 input의 value가 비어 있는 경우를 제외하고 리턴

    let searchText = $search.value.toLowerCase(); // 원활한 비교를 위해 input value를 모두 소문자로 바꿔준다. 
    for (let i = 0; i< $list.length; i++) {
      const $target = $list[i].querySelector('strong');  // title 을 가져온다. 
      const text = $target.textContent.toLowerCase()  // title의 내용을 비교를 위호 모두 소문자로 바꾼다. 
      if( -1 < text.indexOf(searchText)) {  // title중에 input value와 일치하는 값이 잇을 경우.
        $list[i].style.display = 'flex';  // 해당하는 list들을 보여줌. 
      } else {
        $list[i].style.display = 'none';  // 해당하지 않는 list들은 가려줌. 
      };
    };
  };

  const onMouseOver = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source');
    webpPlay.setAttribute('srcset','./assets/sample.webp'); // 속성의 변경을 통해 이미지를 움직이는 webp로 바꿔준다. 
  };

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source');
    webpPlay.setAttribute('srcset','./assets/sample.jpg');  // 속성의 변경을 통해 움직이는 webp를 이미지로 바꿔준다. 
  };

  const hashChange = (e) => {
    e.preventDefault();
    const parentNode = e.target.closest('figure');
    const viewTitle = parentNode.querySelector('strong').textContent;
    window.location.hash = `view&${viewTitle}`;  // hash값을 contents의 title로 변경
    $player.play(); // 자동 재생
    buttonChange($btnPlay, 'Pause');
  }

  const getViewPage = () => {
    const viewTitle = get('.view strong');
    const urlTitle = decodeURI(window.location.hash.split('&')[1]); // hash값에서 title값을 가져온다. 
    viewTitle.innerText = urlTitle; // title 값 업데이트. 
    
    get('.list').style.display = 'none'; // list를 가리고
    get('.view').style.display = 'flex'; // view를 보여준다. 
  }

  const getListPage = () => {
    
      get('.list').style.display = 'flex';
      get('.view').style.display = 'none';
  }

  const buttonChange = (btn, value) => {
    btn.innerHTML = value;
  }

  const viewPageEvent = () => {
    $volume.addEventListener('change', (e) => {
      $player.volume = e.target.value; 
      if ($player.volume === 0) {
        $player.muted = true;
        buttonChange($btnMute, 'Unmute')
      } else {
        $player.muted = false;
        buttonChange($btnMute, 'Mute')
        Orivolume = $volume.value;
      }
    })

    $player.addEventListener('play', buttonChange($btnPlay, 'pause'));
    $player.addEventListener('pause', buttonChange($btnPlay, 'play'));
    $player.addEventListener('timeupdate', setProgress); // player의 time이 변할때 마다 setProgress 함수 실행 
    $player.addEventListener('ended', $player.pause());
    $progress.addEventListener('click', getCurrent);
    $btnPlay.addEventListener('click', playVideo);
    $btnStop.addEventListener('click', stopVideo);
    $btnReplay.addEventListener('click', replayVideo);
    $btnMute.addEventListener('click', mute);
    $fullscreen.addEventListener('click', fullScreen);
  }

  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth;  // 전체 넓이에서 click한 부분의 위치 (0~1 사이의 값)
    $player.currentTime = percent * $player.duration;  // 전체 영상 길이를 곱해서 click한 부분의 play시간을 구한다. 
    // e.target.value = Math.floor(percent * 100); // progress bar value 값을 클릭한 부분으로 바꿔준다. 
  }

  const setProgress = () => {
    let percentage = ((100 / $player.duration) * $player.currentTime).toFixed(2); // progressbar의 위치 설정. 
    $progress.value = percentage;
  }

  const playVideo = () => {
    if($player.paused || $player.ended) {
      buttonChange($btnPlay, 'Pause');
      $player.play();
    } else {
      buttonChange($btnPlay, 'Play');
      $player.pause();
    }
  }

  const stopVideo = () => {
    $player.pause();
    $player.currentTime = 0;
    buttonChange($btnPlay, 'Play');
  }

  const replayVideo = () => {
    $player.currentTime = 0;
    $player.play();
    buttonChange($btnPlay, 'Pause');
  }

  const mute = () => {
    if($player.muted) {
      buttonChange($btnMute, 'Mute');
      $player.muted = false;
      $volume.value = Orivolume;  
    } else {
      buttonChange($btnMute, 'Unmute');
      Orivolume = $volume.value; // mute전 음량 설정값 저장. 
      $player.muted = true;
      $volume.value = 0;
    }
  }

  const fullScreen = () => {

    // $player.requestFullscreen(); // 이거 하나만써도 다 잘 작동되던데.. 아래 첫번째 if 처럼 길게 쓰는 이유를 아직 모르겠다. 

    if($player.requestFullscreen) {
      if(document.fullscreenElement) {
        document.cancelFullscreen();
      } else {
        $player.requestFullscreen();
      }
    } else if ($player.msRequestFullscreen) {
      if(document.msRequestFullscreen) {
        document.msExitFullscreen();
      } else {
        $player.msRequestFullscreen();
      }
    } else {
      alert('Not Supported');
    }
  }

  init();
})();
