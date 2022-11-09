;(() => {
  'use strict'

  const get = (e) => document.querySelector(e);
  const allowUser = {
    audio: true,
    video: true
  }

  class WebRtc {
    constructor() {
      this.media = new MediaSource();
      this.recorder
      this.blobs  // 파일 다운로드를 위한 blob
      this.playVideo = get('video.played');
      this.recordVideo = get('video.record');
      this.btnDownload = get('.btn_download');
      this.btnRecord = get('.btn_record');
      this.btnPlay = get('.btn_play');
      this.container = get('.webrtc');
      this.events()
      navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {  // user에게 audio 와 video 사용을 허락 받는다. // promise를 리턴 받음
        this.success(videoAudio);  
      })
    }

    events() {
      this.btnRecord.addEventListener('click', this.toggleRecord.bind(this)); // addEventListener 에서 this는 event발생 요소를 가리키게 된다. 
      this.btnPlay.addEventListener('click', this.play.bind(this));      // 그래서 함수내부의 this가 event 발생요소가 아닌 class를 가리킬 수 있게 bind() 를 사용해야 한다.      
      this.btnDownload.addEventListener('click', this.download.bind(this));  // bind(this) 의 this는 WebRtc를 가리킨다. 즉 this.download함수 내부의 this가 event 발생 요소가 아닌
    }                                                                         // class를 가리킬 수 있도록 bind(this) 를 해준다. 

    success(videoAudio) {  // getUserMedia의 결과 로받은 promise 객체가 videoAudio 이다. 
      this.btnRecord.removeAttribute('disabled');

      window.stream = videoAudio;  // window.stream에 사용자에게 허락을 받고(getUserMedia) 결과로 받은 videoAudio로 설정.
      // if (window.URL) {  // 
      //   this.playVideo.setAttribute(
      //     'src',
      //     window.URL.createObjectURL(videoAudio)  //  주어진 객체(promise로 반환 된 videoAudio)를 가리키는 URL을 DOMString으로 반환. 
      //   )                                         // => 자꾸 오류 반환함
      // } else {
        this.playVideo.setAttribute('src', videoAudio);  
      // }
    }

    toggleRecord() {
      if ('녹화' === this.btnRecord.textContent) {
        this.startRecord()
      } else {
        this.btnPlay.removeAttribute('disabled');
        this.btnDownload.removeAttribute('disabled');
        this.btnRecord.textContent = '녹화';
        this.stopRecord();
      }
    }

    pushBlobData(e) {
      if (!e.data || e.data.size < 1) {
        return;
      }
      this.blobs.push(e.data);
    }

    startRecord() {
      let type = { mimeType: 'video/webm;codecs=vp9' };
      this.blobs = [];
      if (!MediaRecorder.isTypeSupported(type.mimeType)) { // 타입 지원 여부 확인. 
        type = { mimeType: 'video/webm'}
      }
      this.recorder = new MediaRecorder(window.stream, type);  // MediaRecorder 생성자 함수 사용
      this.btnRecord.textContent = '중지';
      this.btnPlay.setAttribute('disabled', true);
      this.btnDownload.setAttribute('disabled', true);
      this.recorder.addEventListener('dataavailable', this.pushBlobData.bind(this))  // 다운 받을 수 있게 함.
      this.recorder.start(20);
    }

    stopRecord() {
      this.recorder.stop();
      this.recordVideo.setAttribute('controls', true);
    }

    play() {
      this.recordVideo.src = window.URL.createObjectURL(new Blob(this.blobs, { type: 'video/webm' }));
    }

    download() {
      const url = window.URL.createObjectURL(new Blob(this.blobs, { type: 'video/webm' }));
      const downloader = document.createElement('a');
      downloader.style.display = 'none';
      downloader.setAttribute('href', url);
      downloader.setAttribute('download', 'test_video.webm');
      this.container.appendChild(downloader);
      downloader.click();
      // setTimeout(() => {
      //   this.container.removeChild(downloader);
      //   window.URL.revokeObjectURL(url);
      // }, 100);
    }
 
  }

  new WebRtc();

})()
