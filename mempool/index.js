const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')

class Mempool {
    constructor() {
        this.tempMempool = {}
        this.timeoutRequests = {}
        this.validMempool = {}
        this.timeoutRequestsWindowTime = 5*60*1000; // 5 mins
        this.vaildMempoolWindowTime = 30*60*1000; // 30 mins

    }

    addTimeoutReq(address, data) {
        this.timeoutRequests[address] = setTimeout( () => {
            this.removeTimeoutReq(address)
        }, this.timeoutRequestsWindowTime)
        this.tempMempool[address] = data
    }

    removeTimeoutReq(address) {
        // remove from temp mempool data and timeout
        delete this.timeoutRequests[address]
        delete this.tempMempool[address]
    }

    verifyTimeoutRequest(address) {
        let timeoutReq = this.timeoutRequests[address]
        // check if request is still valid
        if (timeoutReq) {
            let tempData = this.tempMempool[address]
            let timeElapse = new Date().getTime() - tempData.requestTimeStamp;
            let timeLeft = (this.timeoutRequestsWindowTime - timeElapse) / 1000;
            tempData.validationWindow = timeLeft;
            return tempData
        } else {
            return false
        }
    }

    validateRequestByWallet(address, signature) {
        let data = this.verifyTimeoutRequest(address)
        if (data) {
            let isValid = bitcoinMessage.verify(data.message, address, signature)
            if (isValid) {
                // add address to valid mempool
                this.addToValidMempool(address)
                return data
            } else {
                return false
            }
        } else {
            return false
        }
    }

    addToValidMempool(address) {
        this.validMempool[address] = setTimeout( () => {
            this.removeValidMempool(address)
        }, this.vaildMempoolWindowTime)
    }

    removeValidMempool(address) {
        delete this.validMempool[address]
    }

    verifyAddressRequest(address) {
        if (this.validMempool[address]) return true
        else return false
    }

}

module.exports = Mempool
