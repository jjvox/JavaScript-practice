import { initMouseControlGame, setBoxDOM } from "./module/mouseControlModule.js";
import { handleModalClose } from "./utils/modal.js";


const initialize = () => {
  const retryButton = document.getElementsByClassName('retry-button')[0];
 
  retryButton.addEventListener('click', () => handleModalClose(initMouseControlGame));
}

setBoxDOM({
  row: 5,
  col: 5,
  start: [0, 0],
  end: [4, 4],
  walls: [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
  ]
});


initialize();