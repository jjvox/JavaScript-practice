import { CART_COOKIE_KEY, getCartInfo } from "../constants/constCart.js";
import { makeDOMwithProperties } from "../utils/dom.js";

const isInCart = ({id}) => {  // 현재 해당 상품이 장바구니 안에 있는지 확인 해주는 함수
  const originalCartInfo = getCartInfo();
  return !!originalCartInfo.find((element) => element.id === id); // !!에 의해 형 변환이 일어나고 요소가 있으면 true, 없으면 false(undefined)를 반환 한다. 
}

const addCartInfo = (productInfo) => {
  const originalCartInfo = getCartInfo();  // setItem을 하면 기존에 있던 장바구니 정보가 날아 가기 때문에 getItem으로 기존 정보를 받아 둔다.

  if (originalCartInfo.findIndex((element) => element.id === productInfo.id) !== -1) return;  // originalCartInfo는 배열이다.
  
  localStorage.setItem(CART_COOKIE_KEY, JSON.stringify([  // localStorage에 '배열'로 값을 넘겨 준다. (나중에 찾아서 비교하기 쉽게)
    ...originalCartInfo,
    productInfo
  ])) // setItem 에는 string이 인자로 와야 하기 때문에 JSON.stringify를 통해 productInfo객체를 string으로 바꾼다.
}

const removeCartInfo = ({id}) => {
  const originalCartInfo = getCartInfo();

  const newCartInfo = originalCartInfo.filter((element) => element.id !== id);
  localStorage.setItem(CART_COOKIE_KEY, JSON.stringify([  
  ...newCartInfo
  ]))
  
}

export const getCartToggleButton = (productInfo,reloadPage) => {
  let inCart = isInCart(productInfo);

  const cartToggleBtn = makeDOMwithProperties('button', {   // 장바구니 버튼
    className: 'cart-toggle-btn',
    type: 'button',
    onclick: () => {  // cart 버튼에 이벤트 넣기
      if (inCart) {
        if (!confirm(`${productInfo.name}을 장바구니에서 삭제 할까요?`)) return; // 삭제 여부 물어보기
        
        removeCartInfo(productInfo);
        cartImage.src = "public/assets/cart.png"  // 카드 이미지 변경
        reloadPage?.(); // 옵셔널체이닝. ? 를 사용 함으로써 함수가 undefined일 경우 그냥 undefined를 반환하고 아닐경우 () 실행을 한다. 
        
      } else {
        addCartInfo(productInfo);
        cartImage.src = "public/assets/cartDisabled.png"

        if (confirm("상품이 장바구니에 담겼습니다. 장바구니 페이지로 이동 할까요 ?")) {  // 확인(true) 취소(false) 값을 반환하는 알림창을 띄워 준다. 
          location.href = "cart.html"
        }
      }
      inCart = !inCart
    }
  })
  const cartImage = makeDOMwithProperties('img', {
    className: 'cart-image',
    src : inCart ? "public/assets/cartDisabled.png" : "public/assets/cart.png" // 카트안에 해당 물품이 있는지 여부에 따라 카트 모양이 다르게 보인다. 
  })
  cartToggleBtn.appendChild(cartImage);

  return cartToggleBtn;
}

