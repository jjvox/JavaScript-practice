import { makeDOMwithProperties } from "../utils/dom.js";
import { getProductList } from "./productList.js";

const MAX_PRICE = Number.MAX_VALUE;

const minPriceFilter = document.getElementById('price-min-filter');
const maxPriceFilter = document.getElementById('price-max-filter');
const discountFilter = document.getElementById('discount-filter');
const filterButton = document.getElementsByClassName('product-filter-con')[0].lastElementChild; // product-filter-con이란 class이름을 가진 Dom의 마지막 자식 태그 가져옴


const convertNumber = (originalNumber) => {
  const formattedString = String(originalNumber).replace('원', '').replace(',', '');
  const formattedNumber = Number(formattedString);
  return isNaN(formattedNumber) ? 0 : formattedNumber;
}

const convertPercent = (originalPercent) => {
  const formattedString = String(originalPercent).replace('%', '');
  const formattedNumber = Number(formattedString);
  return isNaN(formattedNumber) ? 0 : formattedNumber;
}


export const setButtonEvent = (productList) => {
  filterButton.addEventListener('click', () => {
    
    const minPrice = convertNumber(minPriceFilter.value) || 0;
    const maxPrice = convertNumber(maxPriceFilter.value) || MAX_PRICE;
    const discountRate = convertPercent(discountFilter.value) || 0;
    
    
    const newProductList = productList.filter((productInfo) => {
      const { price, discountPercent } = productInfo;
      return (price >= minPrice && price <= maxPrice && discountRate <= discountPercent)  // 조건을 만족하는 product만 찾는다. 
    });
    
    const sectionDOM = document.getElementsByTagName('section')[0];
    const originalProductListDOM = document.getElementsByClassName('product-list-con')[0];
    sectionDOM.removeChild(originalProductListDOM);  // 기존에 있던 productList 삭제 하기

    if (newProductList.length === 0) {
      const emptyProdcutListDOM = makeDOMwithProperties('div', {
        className: 'product-list-con',
        innerHTML: '조건에 맞는 제품이 없습니다.'
      });
      sectionDOM.appendChild(emptyProdcutListDOM);
    } else { 
      const productListDOM = getProductList(newProductList);
      sectionDOM.appendChild(productListDOM);
    }
  });
};




 

const convertPriceToNumber = (e) => {
  const formattedString = String(e.target.value).replace('원', '').replace(',', '');  // 입력된 값에서 ',' 와 '원' 을 제거 해준다. 
  const formattedNumber = Number(formattedString);

  if (formattedNumber == 0) {
    e.target.value = "";
  } else { 
    e.target.value = isNaN(formattedNumber) ? "" : formattedNumber;
  }
};

const formatToPrice = (e) => {
  const result = Number(e.target.value);
  if (isNaN(result)) {
    alert('숫자를 입력해 주세요');
    e.target.focus()
  } else {
    if (result == 0) {
      e.target.value = "";
    } else { 
      e.target.value = `${result.toLocaleString()}원`;
    }
  }
}

export const setFilterEvent = () => {  // 
  minPriceFilter.addEventListener('focus', convertPriceToNumber)  // 입력창에 포커스 되었을때
  minPriceFilter.addEventListener('blur', formatToPrice) // 입력창에서 벗어 났을때
  maxPriceFilter.addEventListener('focus', convertPriceToNumber)  
  maxPriceFilter.addEventListener('blur', formatToPrice) 
  discountFilter.addEventListener('focus', (e) => {
    const formattedString = String(e.target.value).replace('%', ''); 
    const formattedNumber = Number(formattedString);
    if (formattedNumber == 0) {
      e.target.value = "";
    } else { 
      e.target.value = isNaN(formattedNumber) ? "" : formattedNumber;
    }
  })
  discountFilter.addEventListener('blur', (e) => {
      const result = Number(e.target.value);
    if (isNaN(result)) {
      alert('숫자를 입력해 주세요');
      e.target.focus()
    } else if (result > 100 || result < 0) { 
      alert('0이상 100 이하 숫자를 입력해 주세요')
      e.target.value = "";
      e.target.focus();
    } else {
      if (result == 0) {
        e.target.value = "";
      } else { 
        e.target.value = `${result}%`;
      }
    }
  })
}