// Singly Linked List with generator for visualization
export class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
  }
  insert(value) {
    const node = new ListNode(value);
    if (!this.head) this.head = node;
    else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = node;
    }
  }
  *traverse() {
    let curr = this.head;
    while (curr) {
      yield curr;
      curr = curr.next;
    }
  }
} 