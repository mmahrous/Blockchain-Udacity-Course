const service = require('./service')
const BlockChain = require('./chain')




const init = async () => {
    global.chain = new BlockChain()
    await service.start()
    console.log(`Server running at: ${service.info.uri}`)
}

init()
