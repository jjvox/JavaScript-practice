const shareURLButton = document.querySelector('#url-share-button');

export const setShareURLButton = () => {
  shareURLButton.onclick = () => {
    navigator.clipboard.writeText(location.href);  // 브라우저의 clipboard에 whriteText를 이용해 URL을 넘긴다. => writeText는 promise를 반환 한다. 
  }
}