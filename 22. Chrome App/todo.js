const toDoForm = document.getElementById("todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");

let toDos = []; // 입력 값을 저장해둘 배열

function saveToDos() {
  localStorage.setItem("todos", JSON.stringify(toDos)) // JSON.stringify() 는 JS의 배열이든 오브젝트든 전부 String으로 바꿔 버린다. / 값을 string으로 저장하고 싶을때 자주 사용
 }

function deleteToDo(event) {
  const li = event.target.parentElement; // event target의 부모 요소를 불러온다. (li)
  toDos = toDos.filter((e) => e.id !== Number(li.id));
  saveToDos();
  li.remove();  // li 를 삭제 
}

function paintToDo(newTodoObj) {
  const li = document.createElement("li");
  li.id = newTodoObj.id;
  const span = document.createElement("span");
  span.innerText = newTodoObj.text;
  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click",deleteToDo);
  li.appendChild(span);
  li.appendChild(button);
  toDoList.appendChild(li);

}

function handleToDoSubmit(event) {
  event.preventDefault();
  const newTodo = toDoInput.value;
  toDoInput.value = "";
  const newTodoObj = {
    text: newTodo,  
    id: Date.now(), // newTodo에 Date.now() 를 이용해서 식별 할 수 있는 id를 달아준다. 
  }
  toDos.push(newTodoObj); // newTodo와 id가 있는 object를 toDos 배열에 넣는다. 
  paintToDo(newTodoObj);
  saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem("todos")

if(savedToDos) {
  const parsedToDos = JSON.parse(savedToDos); // JSON.parse() 를 이용해서 stirng을 풀고 JSON.stringify 전으로 되돌린다. 
  toDos = parsedToDos; // 이전 저장값 보관
  parsedToDos.forEach((e) => paintToDo(e));  // 새로고침 할때마다 존재하는 todo list 만들어 준다. 
}