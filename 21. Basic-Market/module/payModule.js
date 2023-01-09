import { getCartInfo } from "../constants/constCart.js";

const DELIVERY_FREE_PRICE = 20000;
const DELIVERY_PRICE = 3000;

const originalPriceDom = document.getElementById('original-price');
const discountPriceDom = document.getElementById('discount-price');
const deliveryPriceDom = document.getElementById('delivery-price');
const totalPriceDom = document.getElementById('total-price');

export const setPayInfo = () => {
  const cartInfoList = getCartInfo();


  const { originalPrice,discountPrice } = cartInfoList.reduce((prev, curr) => ({ //reduce를 활용해 배열을 순회하여 값을 더해 구해준다. 
      originalPrice: prev.originalPrice + curr.originalPrice,
      discountPrice: prev.discountPrice + (curr.originalPrice - curr.price),
  }), {
    originalPrice: 0,
    discountPrice: 0
  })

  originalPriceDom.innerHTML = `${originalPrice.toLocaleString()}원`;
  discountPriceDom.innerHTML = `-${discountPrice.toLocaleString()}원`; // 할인금액
  discountPriceDom.style.color = 'red';

  let totalPrice = originalPrice - discountPrice;

  if (totalPrice >= DELIVERY_FREE_PRICE) {
    deliveryPriceDom.innerHTML = '0 원'
    totalPriceDom.innerHTML = `${totalPrice.toLocaleString()}원`;
  } else {
    totalPriceDom.innerHTML = `${(totalPrice + DELIVERY_PRICE).toLocaleString()}원`;
  }
}