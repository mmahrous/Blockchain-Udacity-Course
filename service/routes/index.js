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
                    star: Joi.object().required().error(new Error('star is required to consider it add it to the chain.')),
                    address: Joi.string().min(1).required().error(new Error('address is required.'))
                }
            }
        }
    })

    // request validation for address
    server.route({
        method: 'POST',
        path: '/requestValidation',
        handler: controller.requestValidation,
        options: {
            // this to validate the body in the payload if not present
            validate: {
                payload: {
                    address: Joi.string().min(1).required().error(new Error('address is required.'))
                }
            }
        }
    })

    // validate message signature
    server.route({
        method: 'POST',
        path: '/message-signature/validate',
        handler: controller.messageValidate,
        options: {
            // this to validate the body in the payload if not present
            validate: {
                payload: {
                    address: Joi.string().min(1).required().error(new Error('address is required.')),
                    signature: Joi.string().min(1).required().error(new Error('signature is required.'))
                }
            }
        }
    })

    // get star by hash
    server.route({
        method: 'GET',
        path: '/stars/hash:{hash}',
        handler: controller.getStarByHash,
        options: {
            validate: {
                params: {
                    hash: Joi.string().error(new Error('block hash is not valid.'))
                }
            }
        }
    })

    // get stars by address
    server.route({
        method: 'GET',
        path: '/stars/address:{address}',
        handler: controller.getStarByAddress,
        options: {
            validate: {
                params: {
                    address: Joi.string().error(new Error('block address is not valid.'))
                }
            }
        }
    })
}
