;(function () {
  'use strict'

  const get = function (target) {
    return document.querySelector(target)
  }

  const getAll = function (target) {
    return document.querySelectorAll(target)   //  `querySelectorAll`로 dom을 선택하는 경우 Nodelist가 반환되는데, 이게 유사배열객체이다.
  }

  const keys = Array.from(getAll('.key'))   //- 유사배열객체는 `Array.from` 을 사용해 배열로 만들 수 있다.



  const soundsRoot = 'assets/sounds/'
  const drumSounds = [  // key의 고유한 번호 (key code) 로 입력된 key가 뭔지 구분 한다.  
    { key: 81, sound: 'clap.wav' },
    { key: 87, sound: 'crash.wav' },
    { key: 69, sound: 'hihat.wav' },
    { key: 65, sound: 'kick.wav' },
    { key: 83, sound: 'openhat.wav' },
    { key: 68, sound: 'ride.wav' },
    { key: 90, sound: 'shaker.wav' },
    { key: 88, sound: 'snare.wav' },
    { key: 67, sound: 'tom.wav' },
  ]

  const getAudioElement = (index) => {
    const audio = document.createElement('audio');
    audio.dataset.key = drumSounds[index].key;  // key code를 dataset 으로 설정 해준다. 
    audio.src = soundsRoot + drumSounds[index].sound // 음악파일 경로

    return audio;
  }


  const playSound = (keycode) => {
    const $audio = get(`audio[data-key="${keycode}"]`);
    const $key = get(`div[data-key="${keycode}"]`)
    if ($audio && $key) {
      $key.classList.add('playing')
      $audio.currentTime = 0;  // 음악 재생 시점 - currentTIme 0 일경우 처음부터 음악 재생
      $audio.play(); // 음악 재생
    }
  };

  const onKeyDown = (e) => {
    playSound(e.keyCode);
  };
  

  const onClick = (e) => {
    playSound(e.target.dataset.key);
  };

  const onTransitionEnd = (e) => {
    if (e.propertyName === 'transform') {  // propertyName 에 transform이 있으면 
      e.target.classList.remove('playing'); // playing class를 remove한다. 
    }
  };

  const init = () => {
    window.addEventListener('keydown', onKeyDown);  // 키보드로 작동
    window.addEventListener('click', onClick);  // 마우스로 작동
    keys.forEach((key, index) => {
      const audio = getAudioElement(index);
      key.append(audio);
      key.dataset.key = drumSounds[index].key;
      key.addEventListener('transitionend', onTransitionEnd);
    });

  };

  init();

})();
