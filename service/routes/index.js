const Joi = require('joi')
const controller = require('../controllers')

module.exports = server => {

    // get one block with height
    server.route({
        method: 'GET',
        path: '/block/{height}',
        handler: controller.getBlock,
        options: {
            validate: {
                params: {
                    height: Joi.number().error(new Error('block height is always a number.'))
                }
            }
        }
    })

    // add one block to the chain with body
    server.route({
        method: 'POST',
        path: '/block',
        handler: controller.addBlock,
        options: {
            // this to validate the body in the payload if not present
            validate: {
                payload: {
                    body: Joi.string().min(1).required().error(new Error('body is required to consider it add it to the chain.'))
                }
            }
        }
    })
}
