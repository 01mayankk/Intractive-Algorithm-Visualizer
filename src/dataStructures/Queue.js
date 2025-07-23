// Queue with generator for visualization
export class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  *traverse() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i];
    }
  }
} 