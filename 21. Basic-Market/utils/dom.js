export const makeDOMwithProperties = (domType, propertyMap) => {  // tag이름과 {프로퍼티 : 벨류} 구조의 객체를 받는다. 
  const dom = document.createElement(domType);
  Object.keys(propertyMap).forEach((key) => dom[key] = propertyMap[key]); // Object.keys 를 이용해서 객체의 key값을 배열로 만든 후 forEach로 dom에 넣어준다.
  // Object.keys 는 key값을 string형태의 배열로 반환 하기 때문에 dom.key가 아닌 dom.[] 로 객체에 접근 해야 한다. 
  return dom;
}

export const appendChildrenList = (target, childrendList) => {  //여러 노드를 appendChild할때 쉽게 사용 가능하기 위한 함수
  if (!Array.isArray(childrendList)) return;

  childrendList.forEach((children) => {
    target.appendChild(children)
  });
}