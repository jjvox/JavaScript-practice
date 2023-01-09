import { fetchSectionListData } from "./module/fetch.js";
import { getProdcuctSection } from "./module/productSection.js";

const body = document.getElementsByTagName('body')[0];

try {
  const sectionInfoList = await fetchSectionListData(); // fetchSectionListData가 promise를 반환 하기 때문에 await로 받는다. 최상위 모듈에선 async없이 await사용이 가능하다.

  sectionInfoList.forEach(element => {
    const { sectionTitle, productList } = element
    const productSectionDOM = getProdcuctSection(sectionTitle,productList);
    body.appendChild(productSectionDOM);
  });
} catch (error) {  // fetch 실패시 오류를 띄워주기 위해 try ~ catch 사용함. 
  console.log(error);
}
