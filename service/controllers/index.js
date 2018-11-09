const Block = require('../../chain/block')

exports.getBlock = async (request, h) => {
    const height = request.params.height
    const block = await chain.getBlockByHeight(height)
    // check if there is a block with this height or not
    if (!block) return h.response({
        "statusCode": 404,
        "error": "Not found",
        "message": "block not found.",
    }).code(404)
    else return block
}

exports.addBlock = async (request, h) => {
    // create new block from the body payload
    const newBlock = new Block(request.payload.body)
    // retuern the created block
    return h.response(await chain.addBlock(newBlock)).code(201)
}
