import dotenv from "dotenv"
dotenv.config()
import fetch from "node-fetch"
import express from "express"
import cryptoJS from "crypto-js"
const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const apiPathWallet = "v2/auth/r/wallets"
const SERVER_PORT = process.env.SERVER_PORT
const app = express()

import {walletLog, errorLog, debugLog, defaultLog} from './loggingConf.js'

app.post('/wallet', (req, res) => {

    const nonce = (Date.now() * 1000).toString()
    const body = {
    }

    let signature = `/api/${apiPathWallet}${nonce}${JSON.stringify(body)}`
    const sig = cryptoJS.HmacSHA384(signature, apiSecret).toString()

    fetch(`https://api.bitfinex.com/${apiPathWallet}`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            /* auth headers */
            'Content-Type': 'application/json',
            'bfx-nonce': nonce,
            'bfx-apikey': apiKey,
            'bfx-signature': sig
        }
    })
        .then(res => res.json())
        .then(json => res.end(Buffer.from(JSON.stringify(json))))
        .then(json => walletLog.info(json))
        .catch(err => {
            errorLog.error(err)
        })
})

app.listen(SERVER_PORT,() => {
    console.log('Wallet server has been started on port', + SERVER_PORT, '...')
})