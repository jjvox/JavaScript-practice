;(function () {
  'use strict'

  const commands = [
    {
    cmd: 'backColor',  // execCommand() 에서 명령어 부분.
    val: 'blue',
    label: '배경 컬러'
    },
    {
      cmd: 'bold',
      label: '굵기'  
    },
    {
      cmd: 'justifyCenter',
      label:'가운데 정렬'
    },
    {
      cmd: 'justifyFull',
      label:'양쪽 정렬'
    },
    {
      cmd: 'justifyLeft',
      label:'좌측 정렬'
    },
    {
      cmd: 'justifyRight',
      label:'우측 정렬'
    },
    {
      cmd: 'underline',
      label:'밑줄'
    }
  ];

  const commandObject = {}

  const get = (target) => {
    return document.querySelector(target)
  }

  const doCommand = (cmdKey) => {
    const cmd = commandObject[cmdKey];
    const val = cmd.val ? prompt('값을 입력해 주세요', cmd.val) : ''
    if (cmd.cmd === 'underline') {
      console.log('a')
    }
    document.execCommand(cmd.cmd, false, val);
  }

  const onClickShowEditorButton = () => {  // 에디터 보기 버튼 작동
    $editorEdit.innerHTML = $editorHTML.innerText;
    $editorEdit.classList.toggle('show');
    $editorHTML.classList.toggle('show');
  };

  const onClickShowHTMLButton = () => {  // html 보기 버튼 작동.
    $editorHTML.innerText = $editorEdit.innerHTML
    $editorEdit.classList.toggle('show');
    $editorHTML.classList.toggle('show');
  };

  const $editorButtons = get('.editor_buttons');

  const $showEditorButton = get('.show_editor_button');
  const $showHTMLButton = get('.show_html_button');
  const $editorEdit = get('.editor.edit');
  const $editorHTML = get('.editor.html');

  const init = () => {
    commands.map((command) => {
      commandObject[command.cmd] = command
      const element = document.createElement('button');
      element.innerText = command.label
      element.addEventListener('click', (e) => {
        e.preventDefault();
        doCommand(command.cmd);
      })
      $editorButtons.appendChild(element);
    })
  };
  
  $showEditorButton.addEventListener('click', onClickShowEditorButton);
  $showHTMLButton.addEventListener('click', onClickShowHTMLButton);

  init()
})()
