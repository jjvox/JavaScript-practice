;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target);
  }

  let page = 1;
  const limit = 10;
  const $posts = get('.posts');
  const end = 100;
  let total = 10;

  const $loader = get('.loader');

  const getPost = async () => { // async는 promise를 반환 한다. 
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`; // limit 을 이용해서 10개만 불러 오도록 한다. 
    const response = await fetch(API_URL) // fetch() 는 프로미스 객체를 반환 한다. 
    // await 는 async함수 안에서만 동작 한다. , 프로미스가 전부 처리될 때까지 기다렸다가 다음으로 넘어 갑니다.
    if (!response.ok) {
      throw new Error('에러가 발생 했습니다.')
    }
    return await response.json(); // fetch가 반환한 데이터를 .json() 메서드를 이용하여 자바스크립트 객체로 변환 한다. 
  }

  const showPost = (posts) => {
    posts.forEach((post) => {
      const $post = document.createElement('div');
      $post.classList.add('post');
      $post.innerHTML = `
      <div class="header">
        <div class="id">${post.id}</div>
        <div class="title">${post.title}</div>
      </div>
      <div class="body">
        ${post.body}
      </div>
      `
      $posts.appendChild($post);
    })
  }

  const showLoader = () => {
    $loader.classList.add('show');
  }

  const hideLoader = () => {
    $loader.classList.remove('show');
  }


  const loadPost = async () => {
    showLoader(); // 데이터가 로딩 될때 .... 보여줌. 
    try {
      const response = await getPost();
      showPost(response); // 서버에서 가져온 post데이터를 showPost 함수에 인자로 넣는다. 
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();  // 데이터를 다 가져온 후 .... 없앰. 
    }
  }

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement; // 디스트럭쳐링을 이용해서 가져옴. 

    if(total === end) { // 토탈값과 끝이 같으면 이벤트 제거 . 
      window.removeEventListener('scroll',onScroll);
      return;
    }
    if(scrollTop + clientHeight == scrollHeight ) { // scrollTop과 clientHeight의 합이 전체 스크롤 길이인 scrollHeight와 같을때. 이말은 즉 내가 보고있는 페이지를 가장 아래로 내렸을때를 의미
      page++; // 페이지 넘버를 하나 올려주고
      total += 10; // 총 로딩하는 데이터 수를 증가 . 
      loadPost(); // 새로 포스팅
      
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPost();
    window.addEventListener('scroll',onScroll);
  })
})()
