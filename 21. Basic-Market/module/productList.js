import { makeDOMwithProperties } from "../utils/dom.js"
import { getProductCard } from "./productCard.js"

export const getProductList = (productInfoList, reloadPage) => {
  if (productInfoList == null || !Array.isArray(productInfoList)) return;
  const productListContainer = makeDOMwithProperties('div', {
    className: 'product-list-con',
  });

  productInfoList.forEach((productInfo) => { // 인자로 받을 productInfo는 객체형식으로 id, imgSrc, name, discountPercent, price, originalPrice 의 정보를 담고 있다. 
    productListContainer.appendChild(
      getProductCard(productInfo,reloadPage)
    );
  })

  return productListContainer;
}