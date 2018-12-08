const Block = require('../../chain/block')

exports.getBlock = async (request, h) => {
    const height = request.params.height
    const block = await chain.getBlockByHeight(height)
    // decode star story
    block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('utf8');
    // check if there is a block with this height or not
    if (!block) return h.response({
        "statusCode": 404,
        "error": "Not found",
        "message": "block not found.",
    }).code(404)
    else return block
}

exports.getStarByHash = async (request, h) => {
    const hash = request.params.hash
    try {
        const block = await chain.getBlockByHash(hash)
        if (!block) throw new Error('No block found.')
        // decode star story
        block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('utf8');
        return block
    } catch(err) {
        return h.response({
            "statusCode": 404,
            "error": "Not found",
            "message": "block not found.",
        }).code(404)
    }
}

exports.getStarByAddress = async (request, h) => {
    const address = request.params.address
    try {
        const blocks = await chain.getBlocskByAddress(address)
        if (!blocks.length) throw new Error('No block found.')
        return blocks.map( b => {
            // decode star story
            b.body.star.storyDecoded = Buffer.from(b.body.star.story, 'hex').toString('utf8');
            return b
        })
    } catch(err) {
        return h.response({
            "statusCode": 404,
            "error": "Not found",
            "message": "blocks not found.",
        }).code(404)
    }
}

exports.addBlock = async (request, h) => {
    // create new block from the body payload
    const address = request.payload.address
    const star = request.payload.star
    star.story = Buffer(star.story).toString('hex')
    if (mempool.verifyAddressRequest(address)) {
        const newBlock = new Block({
            address,
            star
        })
        newBlock.body.star.storyDecoded = Buffer.from(newBlock.body.star.story, 'hex').toString('utf8');
        // remove address request from mempool
        mempool.removeValidMempool(address)
        // retuern the created block
        return h.response(await chain.addBlock(newBlock)).code(201)
    } else {
        return h.response({
            "statusCode": 400,
            "error": "Not valid",
            "message": `This signature is not valid.`,
        }).code(400)
    }
}

exports.requestValidation = async (request, h) => {
    const walletAddress = request.payload.address
    let validationWindow = mempool.timeoutRequestsWindowTime / 1000
    const requestTimeStamp = new Date().getTime()
    const message = `${walletAddress}:${requestTimeStamp}:starRegistry`
    const data = mempool.verifyTimeoutRequest(walletAddress)
    // check if validation was rquested before
    if (data) {
        return h.response(data).code(200)
    } else {
        // add to timeout and to tempMempool
        mempool.addTimeoutReq(walletAddress, {walletAddress, requestTimeStamp, message})
        return h.response({walletAddress, requestTimeStamp, message, validationWindow}).code(200)
    }
}

exports.messageValidate = async (request, h) => {
    const walletAddress = request.payload.address
    const signature = request.payload.signature
    const data = mempool.validateRequestByWallet(walletAddress, signature)
    if (data) {
        // remove remove timeout request
        mempool.removeTimeoutReq(walletAddress)
        return h.response({
            "registerStar": true,
            "status": {
                "address": walletAddress,
                "requestTimeStamp": data.requestTimeStamp,
                "message": data.message,
                "validationWindow": data.validationWindow,
                "messageSignature": true
            }
        }).code(200)
    } else {
        return h.response({
            "statusCode": 400,
            "error": "Not valid",
            "message": `This signature is not valid.`,
        }).code(400)
    }
}
