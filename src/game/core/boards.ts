import config from '../config';
import { BoardState } from '../types';
import Board from './board';

export default class Boards {
  
  private dom = document.createElement('div');

  private initialized = false;

  boards: Board[]  = [];

  init() {

    this.dom.style.width = `${config.boardWidth * config.boardsWSize}px`;
    this.dom.style.height = `${config.boardHeight * config.boardsHSize}px`;
    this.dom.style.background = 'rgba(1, 1, 1, 0.3)';
    this.dom.style.position = 'relative'

    this.renderBoard()
    this.initialized = true;
  }

  renderBoard() {
    for (let row = 0; row < config.boardsWSize; row ++) {
      for (let col = 0; col < config.boardsHSize; col ++) {
        const board = new Board();
        const val = Math.random();
        if (val < 0.01) {
          board.init(row, col, BoardState.ACTIVE);
        } else if (val < 0.02) {
          board.init(row, col, BoardState.DISABLE);
        } else if (val < 0.03) {
          board.init(row, col, BoardState.PRE_ACTIVE);
        } else {
          board.init(row, col);
        }
        this.boards.push(board)
        // this.dom.append(board.dom)
        board.render(this.dom);
      }
    }
  }

  render(dom: HTMLElement) {
    if (this.initialized) {
      dom.appendChild(this.dom);
    } else {
      this.init();
      dom.appendChild(this.dom);

    }
  }
}