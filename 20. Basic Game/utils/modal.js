const modalDOM = document.getElementsByClassName('modal')[0];
const modalTitle = document.getElementsByClassName('modal-title')[0];
const modalDescriptionDOM = document.getElementsByClassName('modal-description')[0];

export const handleModalOpen = ({
  isSuccess,
  timeString
}) => {
  modalDOM.classList.add('open');

  if (isSuccess) {
    modalTitle.innerHTML = "성공!";
    modalDescriptionDOM.innerHTML = `${timeString} 만에 성공 했습니다.`;
  } else {
    modalTitle.innerHTML = "실패!";
    modalDescriptionDOM.innerHTML = `다시 시도해 보세요`;
  }

};

export const handleModalClose = (onModalClose) => {
  modalDOM.classList.remove('open');
  onModalClose?.();
};