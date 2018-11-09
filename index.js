const BlockChain = require('./chain')
const Block = require('./chain/block')



const main = async () => {
    // init the chain
    let chain = new BlockChain()

    let blockCount = await chain.getBlockCount()
    console.log(`Current Block counts ${blockCount}`)
    // loop to add 10 more blocks to the chain
    for (let i = blockCount; i < blockCount + 4; i++) {
        // creat new block
        let newBlock = new Block(`Block #${i}`)
        // add the block
        await chain.addBlock(newBlock)
    }
    console.log(`10 Blocks are added to the chain right now ${await chain.getBlockCount()} total block`)
    // validate the chain after adding new blocks
    console.log(`Chain is valid ${await chain.validateChain()}`)
}


main()
