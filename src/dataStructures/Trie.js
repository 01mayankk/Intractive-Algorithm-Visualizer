// Trie with generator for visualization
export class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }
  *traverse(node = this.root, prefix = "") {
    if (node.isEnd) yield prefix;
    for (let char in node.children) {
      yield* this.traverse(node.children[char], prefix + char);
    }
  }
} 