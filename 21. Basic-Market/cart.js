import { CART_COOKIE_KEY,getCartInfo } from "./constants/constCart.js";
import { setPayInfo } from "./module/payModule.js";
import { getProductList } from "./module/productList.js";
import { makeDOMwithProperties } from "./utils/dom.js";

const sectionDOM = document.getElementsByTagName('section')[0];
const cartPayContainerDOM = document.getElementById('cart-pay-container');

const cartInfo = getCartInfo();  // cart(장바구니) 정보를 가져온다.

const reloadPage = () => location.reload();  // 페이지를 새로고침 한다. 

if (cartInfo.length < 1) {
  const noticeDOM = makeDOMwithProperties('div', {
    innerHTML: '장바구니에 상품이 없습니다',
    className: 'product-list-con'
  })
  sectionDOM.insertBefore(noticeDOM, cartPayContainerDOM); 
} else {
  const productListDOM = getProductList(cartInfo,reloadPage); // 장바구니 페이지를 reload해주는 콜백 함수를 인자로 넣는다 
  sectionDOM.insertBefore(productListDOM, cartPayContainerDOM);  // A.insertBefore(B,C)  B가 A뒤에 C 앞에 삽입되게 하는 함수.
}

const cartAllDeleteButtonDOM = document.getElementById('remove-all-button');
cartAllDeleteButtonDOM.addEventListener('click', () => {
  if (cartInfo.length === 0) return;
  if (!confirm(`장바구니를 비울까요?`)) return;
  localStorage.removeItem(CART_COOKIE_KEY)  // localStorage에서 해당 key에 해당하는 값 삭제 
  reloadPage()  // 새로고침
})

setPayInfo();

