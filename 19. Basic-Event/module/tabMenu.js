const selectAnchorMenuDOM = document.getElementById('anchor-to-select');
const resultAnchorMenuDOM = document.getElementById('anchor-to-result');
const mbtiAnchorMenuDOM = document.getElementById('anchor-to-mbti');

const selectSectionDOM = document.getElementById('participate-section');
const resultSectionDOM = document.getElementById('result-section');
const mbtiSectionDOM = document.getElementById('mbti-section');

const handleScroll = (anchorDOM, targetDOM) => { // tab의 버튼을 누르면 해당 DOM 으로 스크롤 이동 하는 함수
    
  anchorDOM.addEventListener('click', () => {

    const scrollTargetY = targetDOM.offsetTop;
    window.scroll({                                    // window.scroll({객체옵션}) 을 통해 스크롤 이동 구현.  
      top: scrollTargetY,
      left: 0,
      behavior: 'smooth'
    });
      
    // selectSectionDOM.scrollIntoView({  //  DOM의 scrollIntoView 메서드를 통해 한번에 스크롤 이동 구현.
    //   behavior: 'smooth'               // 하지만 헤더 높이를 제대로 인식 못하고 짤려서 이동 되기 때문에 사용안함
    // });                                // 상황에 따라서 선택 하면 될듯. 
  })
}


export const setTabMenu = () => { 
  handleScroll(selectAnchorMenuDOM, selectSectionDOM);
  handleScroll(resultAnchorMenuDOM, resultSectionDOM);
  handleScroll(mbtiAnchorMenuDOM, mbtiSectionDOM);
};