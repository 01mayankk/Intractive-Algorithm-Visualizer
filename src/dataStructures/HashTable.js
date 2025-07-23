// HashTable with generator for visualization
export class HashTable {
  constructor(size = 16) {
    this.table = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  set(key, value) {
    const idx = this._hash(key);
    for (let pair of this.table[idx]) {
      if (pair[0] === key) { pair[1] = value; return; }
    }
    this.table[idx].push([key, value]);
  }
  get(key) {
    const idx = this._hash(key);
    for (let pair of this.table[idx]) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }
  *traverse() {
    for (let bucket of this.table) {
      for (let pair of bucket) {
        yield pair;
      }
    }
  }
} 