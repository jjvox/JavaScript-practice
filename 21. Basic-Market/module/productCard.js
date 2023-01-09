import { makeDOMwithProperties, appendChildrenList } from "../utils/dom.js";
import { getCartToggleButton } from "./cartToggleButton.js";

export const getProductCard = (productInfo,reloadPage) => {  // dom을 생성해서 내보내 주는 함수, 값을 일일이 입력해서 dom을 만드는게 아닌 자동으로 만들어 주기위한 함수.
  const {
    imgSrc,
    name,
    discountPercent,
    price,
    originalPrice
  } = productInfo;
  
  const productCard = makeDOMwithProperties('div', {
    className: 'product-card',
  });


  const productImageCon = makeDOMwithProperties('div', {
    className : 'product-image-con'
  });
  const productImage = makeDOMwithProperties('img', {
    src: imgSrc,
    alt: name
  });

  const cartToggleBtn = getCartToggleButton(productInfo,reloadPage);  

  appendChildrenList(productImageCon, [productImage, cartToggleBtn]);



  const productDescription = makeDOMwithProperties('div', {
    className: 'product-description'
  })
  const productName = makeDOMwithProperties('div', {
    className: 'product-name',
    innerHTML: name
  })
  const productPriceContainer = makeDOMwithProperties('div', {
    className: 'product-price-con',
  })
  const productDiscount = makeDOMwithProperties('div', {
    className: 'product-discount-percent',
    innerHTML: `${discountPercent}%`
  })
  const productPrice = makeDOMwithProperties('div', {
    className: 'product-price',
    innerHTML: `${price.toLocaleString()}원`
  })
  const productOriginalPrice = makeDOMwithProperties('div', {
    className: 'product-original-price',
    innerHTML: `${originalPrice.toLocaleString()}원`
  })

  appendChildrenList(productPriceContainer, [productDiscount, productPrice]);
  appendChildrenList(productDescription, [productName, productPriceContainer, productOriginalPrice]);


  appendChildrenList(productCard, [productImageCon, productDescription]);

  return productCard;
}