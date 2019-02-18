
const SHA256 = require('crypto-js/sha256');
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash()
    }
    console.log("Block mined " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;//hash starts with four 0s. higher the difficulty =, higher the time it takes to mine a block
  }

  createGenesisBlock() {
    return new Block(0, "13/02/2019", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}


let ramaCoin = new Blockchain();
ramaCoin.addBlock(new Block(1, "14/02/2019", "blockchain is awesome"));
ramaCoin.addBlock(new Block(2, "15/02/2019", { amount: 001 }));
ramaCoin.addBlock(new Block(3, "16/02/2019", { amount: 002 }));

console.log(JSON.stringify(ramaCoin, null, 4));
console.log('is blockchain valid? ' + ramaCoin.isChainValid());//returns true

//tampering data
ramaCoin.chain[1].data = { amount: 120 };
ramaCoin.chain[1].hash = ramaCoin.chain[1].calculateHash();
console.log('is blockchain valid after adding data? ' + ramaCoin.isChainValid());// returns false. 

//mine block
console.log("Mine block 1...");
ramaCoin.addBlock(new Block(4, "18/02/2019", { amount: 003 }));

console.log("Mine block 2...");
ramaCoin.addBlock(new Block(4, "19/02/2019", { amount: 004 }));
