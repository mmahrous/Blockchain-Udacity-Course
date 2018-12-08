class Block {
    constructor(data) {
        this.height = '';
        this.timeStamp = '';
        this.body = data;
        this.previousHash = '0x';
        this.hash = '';
    }
}

module.exports = Block
