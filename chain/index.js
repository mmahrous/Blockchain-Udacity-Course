const crypto = require('crypto')
const Block = require('./block')
const level = require('level')
const _ = require('lodash')

class BlockChain {
    constructor() {
        // create the chain
        this.db = level(`db`, {
            valueEncoding: 'json'
        })

        // add genesis block
        this.getBlockCount()
        .then( count => {
            if (count == 0 ) return this.addBlock(this.createGenesisBlock(), true)
        })
        .then( genesis => {
            if (genesis) console.log(`Genesis block added with hash ${genesis.hash}`)
        })
    }
    // get blocks count
    getBlockCount() {
        return new Promise((resolve, reject) => {
            let i = 0
            this.db.createReadStream()
                .on('data', data => i++)
                .on('error', reject)
                .on('close', () => {
                    return resolve(i)
                });
        })
    }

    // get all the blocks
    getBlocks() {
        return new Promise((resolve, reject) => {
            let blocks = []
            this.db.createValueStream()
                .on('data', data => {
                    blocks.push(data)
                })
                .on('error', reject)
                .on('close', () => {
                    // sort blocks by height
                    blocks = _.sortBy(blocks, ['height'])
                    return resolve(blocks)
                });
        })
    }

    createGenesisBlock() {
        return new Block("First block in the chain - Genesis block");
    }

    async addBlock(block, genesis = false) {
        // add genesis block if there is no block
        if (await this.getBlockCount() == 0 && !genesis) await this.addBlock(this.createGenesisBlock(), true)
        // get all the blocks
        let bestBlocks = await this.getBestBlock()
        let count = await this.getBlockCount()
        // set height
        block.height = count
        // add timestamp unix to block
        block.timeStamp = new Date().getTime().toString().slice(0, -1)
        // if the genesis block is added, add the previousHash from the previous block hash
        if (count > 0) block.previousHash = bestBlocks.hash
        // create the uniq hash value for the block
        block.hash = this.createHash(JSON.stringify(block))
        // add it to leveldb
        await this.db.put(block.hash, block)
        return block
    }

    // get best block last block added to the chain
    async getBestBlock() {
        let blocks = await this.getBlocks()
        return blocks.pop()
    }

    async getBlockHeight() {
        return (await this.getBlockCount())-1
    }

    // create hash for data
    createHash(data) {
        let hash = crypto.createHash('sha256')
        return hash.update(data).digest('hex')
    }

    // get block by hash value
    async getBlockByHash(hash) {
        return await this.db.get(hash)
    }

    // get block its height
    async getBlockByHeight(height) {
        let blocks = await this.getBlocks()
        // check if this height is not present
        if (height > blocks.length-1) return false
        // find the block in the array of blocks
        return blocks.find(n => n.height == height)
    }

    // validate the block
    async validateBlock(height) {
        // get the block byt its height
        let block = await this.getBlockByHeight(height)
        // get the hash value
        let blockHash = block.hash
        // remove the hash value to validate the block
        block.hash = ''
        // create the correct hash
        let validHash = this.createHash(JSON.stringify(block))
        // check
        if (validHash == blockHash) return true
        else return false
    }

    async validateChain(height) {
        // get block count
        let count = await this.getBlockCount()
        let errorLog = []
        // loop over the blocks by the height
        for (let i = 0; i <= count - 1; i++) {
            // validate the block
            let blockValidation = await this.validateBlock(i)
            // check if not genesis block validate the previous hash
            if (i > 0) {
                // get previous block
                let prevBlock = await this.getBlockByHeight(i - 1)
                // get current block
                let block = await this.getBlockByHeight(i)
                // check if previousHash equal the previous block hash
                if (block.previousHash !== prevBlock.hash || !blockValidation) errorLog.push(i)
            } else if (!blockValidation) errorLog.push(i)
        }
        // if errors show it
        if (errorLog.length > 0) return false
        else return true
    }

}

module.exports = BlockChain
