import config from '../config';
import { BoardState } from '../types';

class Board {

  private initialized = false;
  
  private size = 1;

  private x = 1;

  private y = 1;

  private state = BoardState.DEFAULT;

  private dom = document.createElement('div');

  init(x: number, y: number, state = BoardState.DEFAULT) {
    this.state = state;
    this.dom.style.border = `2px solid ${state}`;
    this.dom.style.borderRadius = '10px';
    this.dom.style.width = `${config.boardWidth}px`;
    this.dom.style.height = `${config.boardHeight}px`;
    this.dom.style.position = 'absolute';
    this.x = x;
    this.y = y;
    this.dom.style.transform = `translate(${config.boardWidth * x}px, ${config.boardHeight * y}px)`;
    this.dom.style.left = `${0}px`;
    this.dom.style.top = `${0}px`;
    this.dom.innerText = `${(x+ 1) * (y + 1)}`
    this.dom.style.color = '#ffffff';


    const img = document.createElement('img')
    img.src = 'http://source.unsplash.com/random/150x150'
    this.dom.append(img)
    this.bindDrag()
    this.initialized = true;
  }

  bindDrag() {
    this.dom.draggable = true;

    this.dom.addEventListener('dragstart', event => {
      this.dom.style.borderStyle = 'dashed';
      setTimeout(() => {
        this.dom.style.display = 'none';
        // this.className = 'invisible';
      }, 0);
    })

    this.dom.addEventListener('dragend', event => {
      this.dom.style.borderStyle = 'solid';
      // this.dom.style.opacity = '1';
      this.dom.style.display = 'block';

    })
  }

  render(dom: HTMLElement) {
    if (this.initialized) {
      dom.appendChild(this.dom);
    }
  }
}

export default Board;
