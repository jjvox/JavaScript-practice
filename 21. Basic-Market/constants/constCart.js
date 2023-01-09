export const CART_COOKIE_KEY = 'cartInfo';  // 변하지 않는 상수값

export const getCartInfo = () => JSON.parse(localStorage.getItem(CART_COOKIE_KEY)) || [];
// localStorage에서 데이터 가져오기, import된 곳에서 데이터를 가져 와야 하므로 함수로 만들어서 import된 곳에서 실행되게 한다. 