export const fetchSectionListData = async () => {  // -> async 함수 이기 떄문에 promise를 반환 한다. 
  try { 
    const response = await fetch("./public/mock/sectionListData.json");  
    const data = await response.json();  // fetch가 promise를 반환 하기 때문에 json을 활용해서 변환 해준다. 
    return data?.sectionInfoList || [];
    
  } catch (error) {
    console.log(error);
    return [];
  }
}