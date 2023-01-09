import { fetchSectionListData } from "./module/fetch.js";
import { setButtonEvent, setFilterEvent } from "./module/productFilter.js";
import { getProductList } from "./module/productList.js";


const sectionInfoList = await fetchSectionListData();

const productList = sectionInfoList.reduce((prev, cur) => [...prev, ...cur.productList], []);  // SectionListData로 부터 productList만 추출 한다.

const section = document.getElementsByTagName('section')[0];
const productListDOM = getProductList(productList);
section.appendChild(productListDOM);

setButtonEvent(productList);
setFilterEvent()