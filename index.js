const service = require('./service')
const BlockChain = require('./chain')
const Mempool = require('./mempool')




const init = async () => {
    global.chain = new BlockChain()
    global.mempool = new Mempool()
    await service.start()
    console.log(`Server running at: ${service.info.uri}`)
}

init()
