// Binary Tree with generator for in-order traversal visualization
export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) this.root = node;
    else {
      let curr = this.root;
      while (true) {
        if (value < curr.value) {
          if (!curr.left) { curr.left = node; break; }
          curr = curr.left;
        } else {
          if (!curr.right) { curr.right = node; break; }
          curr = curr.right;
        }
      }
    }
  }
  *inOrder(node = this.root) {
    if (!node) return;
    yield* this.inOrder(node.left);
    yield node;
    yield* this.inOrder(node.right);
  }
} 