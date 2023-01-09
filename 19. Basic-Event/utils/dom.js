export const makeDOMwithProperties = (domType, propertyMap) => { // TS의 필요성
  const dom = document.createElement(domType);
  Object.keys(propertyMap).map((key) => {
    dom[key] = propertyMap[key]; // Dom에 property 입력 해줌 (대괄호로 접근이 가능한가보다.)
  });
  return dom;
}

export const appendChildrenList = (target, childrenList) => {
  // childrenList가 배열일 지 아닐 지 모름 -> 타입스크립트 필요
  if (!Array.isArray(childrenList)) return;

  childrenList.forEach((children) => {
    target.appendChild(children);
  })
};
