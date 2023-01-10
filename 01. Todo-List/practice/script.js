;(function () {
  ;('use strict') // 엄격한 실행을 한다.

  const get = (target) => {
    return document.querySelector(target) // html 선택자 가져오기
  }
  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  const $todos = get('.todos') // class='todos' 선택자 가져오기 변수 지정
  const $form = get('.todo_form') // class='todo_form' 선택자 가져오기 변수 지정
  const $todoInput = get('.todo_input') // class='todo_input' 선택자 가져오기 변수 지정
  const $pagination = get('.pagination')
  const API_URL = `http://localhost:5000/todos` // jason server url 변수로 지정

  let currentPage = 1
  const totalCount = 53 // 총 todolist 수
  const pageCount = 5 // 한번에 보이는 페이지 수
  const limit = 5 // 페이지당 todoList 수

  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit) // 전체 todolist를 페이지당 todolist수로 나누면 전체 페이지가 나온다. 나머지는 올림처리
    let pageGroup = Math.ceil(currentPage / pageCount) // 한번에 보여지는 페이지 구하기
    let lastNumber = pageGroup * pageCount // 해당 페이지 그룹에 페이지 카운트를 곱해 해당 그룹에서 마지막 페이지 넘버를 구한다.

    if (lastNumber > totalPage) {
      // 마지막 페이지 넘버거 토탈 페이지 보다 클 경우 토탈페이지를 마지막 페이지 넘버로 한다.
      lastNumber = totalPage
    }
    let firstNumber = lastNumber - (pageCount - 1) // 해당 페이지 그룹에서 첫번째 페이지 넘버는 마지막 페이지 넘버에서 페이지 카운트를 빼서 구한다.

    const next = lastNumber + 1
    const prev = firstNumber - 1

    let html = ''

    if (prev > 0) {
      html += `<button class="prev" data-fn="prev">이전</button>` // 첫번째 페이지가 1인 경우 prev 값이 0이 되기 때문에 실행 되지 않는다.
    }

    for (let i = firstNumber; i <= lastNumber; i++) {
      // 해당 페이지 그룹의 첫번째 페이지 부터 마지막 페이지 까지 html 태그 작성.
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`
    }

    if (lastNumber < totalPage) {
      // lastNumber 가 전체 페이지의 끝이 아닐 경우 '다음'버튼 넣어 준다.
      html += `<button class="next" data-fn="next">다음</button>`
    }

    $pagination.innerHTML = html
    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`)
    $currentPageNumber.style.color = '#9dc0e8'

    const $currentPageNumbers = getAll(`.pagination button`)
    $currentPageNumbers.forEach((button) => {
      button.addEventListener('click', () => {
        // 페이지넘버 버튼 모두에 'click'이벤트를 걸어준다.
        if (button.dataset.fn === 'prev') {
          // click대상이 prev일 경우
          currentPage = prev
        } else if (button.dataset.fn === 'next') {
          // click대상이 next인 경우
          currentPage = next
        } else {
          currentPage = button.innerText // 페이지를 클릭 했을경우. currentPage를 업데이트 해줌.
        }
        pagination() // 페이지네이션 재호출
        getTodos() // Todos 재호출 .
      })
    })
  }

  const createTodoElement = (item) => {
    const { id, content, completed, recommended } = item // 디스트럭쳐링
    const isChecked = completed ? 'checked' : ''
    const isRecommended = recommended ? 'active' : ''
    const $todoItem = document.createElement('div') // div 요소 생성
    $todoItem.classList.add('item') // class='item' 추가
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_recommend_button ${isRecommended}">
                <i class="fa-regular fa-star"></i> 
                <i class="fa-solid fa-star"></i>
              </button>
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '' //.todos 의 innerHTML 을 ' ' 로 reset시킴
    todos.forEach((item) => {
      const todoElement = createTodoElement(item)
      $todos.appendChild(todoElement) // todoElement를 .todos의 자식요소로 넣음
    })
  }

  const getTodos = () => {
    fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`) // json서버의 Paginate기능. 전체 데이터를 limit의 갯수만큼 구분지어 cureentPage번째에 해당하는 데이터들을 불러 옵니다. limit이 정의 되지 않으면 기본 10개로 나눠진다.
      .then((response) => response.json())
      .then((todos) => {
        renderAllTodos(todos)
      })
      .catch((error) => console.error(error.message))
  }

  const addTodo = (e) => {
    e.preventDefault() // input 태그에 의한 새로고침 방지, input태그는 submit이 일어났을때 전체 새로고침을 한다.
    const content = $todoInput.value
    if (!content) return
    const todo = {
      content,
      completed: false,
    }
    fetch(API_URL, {
      // json 서버 주소.
      method: 'POST', // 새로운 데이터 서버에 추가
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then(getTodos()) // 서버에 데이터를 추가 한 다음 다시 서버의 데이터를 불러 온다.(getTodos());
      .then(() => {
        $todoInput.value = '' // input영역 value 비워주기
        $todoInput.focus() // input영역에 focus 두기
      })
      .catch((error) => console.error(error.message))
  }

  const toggleTodo = (e) => {
    if (e.target.className !== 'todo_checkbox') return // class가 'todo_checkbox' 인것을 제외 하곤 다 return
    const $item = e.target.closest('.item') // e(.todo_checkbox)와 가장 가까운 .item 반환
    const id = $item.dataset.id // 해당 item의 id 값 반환
    const completed = e.target.checked // check 박스가 check 되었을 때
    fetch(`${API_URL}/${id}`, {
      // id 값으로 json 서버의 데이터에 접근 한다.
      method: 'PATCH', // json 서버의 데이터를 수정 한다.
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
      .then((response) => response.json())
      .then(getTodos) // 수정후 데이터를 다시 가져 온다.
      .catch((error) => console.error(error.message))
  }

  const recommendTodo = (e) => {
    if (!e.target.classList.contains('todo_recommend_button')) return

    const $item = e.target.closest('.item')
    const id = $item.dataset.id
    const recommended = !e.target.classList.contains('active') // false면 true가 되고 true면 false가 된다. (recomended가 true면 class에 'active'가 존재 하기 때문에 true가반환되어 !에 의해 최종 값은 false가 된다.)
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ recommended }), //rest API로 되어 있기 때문에 {} 안의 값만 업데이트 된다.
    })
      .then((response) => response.json())
      .then(getTodos)
      .catch((error) => console.error(error.message))
  }

  const changeEditMode = (e) => {
    const $item = e.target.closest('.item')
    const $label = $item.querySelector('label')
    const $editInput = $item.querySelector('input[type="text"]')
    const $contentButtons = $item.querySelector('.content_buttons')
    const $editButtons = $item.querySelector('.edit_buttons')
    const value = $editInput.value // focus 위치를 뒤로 보내기 위해 value값을 미리 저장 해둔다.

    if (
      e.target.className === 'todo_edit_button' || // class가 'todo_edit_button' 일 경우만.
      e.target.tagName == 'LABEL'
    ) {
      $label.style.display = 'none'
      $editInput.style.display = 'block'
      $contentButtons.style.display = 'none'
      $editButtons.style.display = 'block'
      $editInput.focus() // edit 버튼을 눌렀을 때 input에 커서가 focus되게 한다. 하지만 커서가 값의 앞에 위치하게 된다.
      $editInput.value = '' // 값을 비운다음
      $editInput.value = value // 다시 값을 채워줘야 input에 focus된 커서가 값의 끝에 위치 한다.
    }

    if (
      e.target.className === 'todo_edit_cancel_button' ||
      e.key === 'Escape'
    ) {
      $label.style.display = 'block'
      $editInput.style.display = 'none'
      $contentButtons.style.display = 'block'
      $editButtons.style.display = 'none'
      $editInput.value = $label.innerText // 취소 버튼을 눌럿을때 기존에 label에 저장 되어 있던 값으로 다시 원상복구 시켜준다.
    }
  }

  const editTodo = (e) => {
    if (e.target.className !== 'todo_edit_confirm_button' && e.key !== 'Enter')
      return

    const $item = e.target.closest('.item')
    const id = $item.dataset.id
    const $editInput = $item.querySelector('input[type="text"]')
    const content = $editInput.value

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH', // 데이터 수정.
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then(getTodos)
      .catch((error) => console.error(error.message))
  }

  const removeTodo = (e) => {
    if (e.target.className !== 'todo_remove_button') return
    const $item = e.target.closest('.item')
    const id = $item.dataset.id

    fetch(`${API_URL}/${id}`, {
      // 삭제를 할때는 headers와 body 필요 없다. 데이터를 넣는게 아니기 때문.
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(getTodos)
      .catch((error) => console.error(error.message))
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      // dom content가 load 되면 getTodos를 실행.
      getTodos()
      pagination()
    })

    $form.addEventListener('submit', addTodo)
    $todos.addEventListener('click', toggleTodo)
    $todos.addEventListener('click', changeEditMode)
    $todos.addEventListener('keydown', changeEditMode)
    $todos.addEventListener('click', editTodo)
    $todos.addEventListener('keydown', editTodo)
    $todos.addEventListener('click', removeTodo)
    $todos.addEventListener('click', recommendTodo)
  }

  init()
})()
