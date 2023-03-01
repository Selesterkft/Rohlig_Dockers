import { createCipheriv } from 'crypto';
import { U_TRANSPACKIF_Get_Params } from "../db/storedProcedures";
import fetch from 'node-fetch';
import { response } from 'express';
// const fetch = require('node-fetch');

let urlLogin;
let encryptedHash;
let apiKey;

export async function fnParams() {
    let queryParams = '';
    const p = await U_TRANSPACKIF_Get_Params(queryParams);
    return p;
}

async function encrypt() {
    let p = await fnParams();
    try {
        let jsonParams = JSON.parse(JSON.stringify(p));

        apiKey = jsonParams.data.find((it) => { return it.PARAMCODE === "API_KEY" }).PARAMVALUE
        let apiSecretKey = jsonParams.data.find((it) => { return it.PARAMCODE === "API_SECRET_KEY" }).PARAMVALUE
        let initVector = jsonParams.data.find((it) => { return it.PARAMCODE === "INIT_VECTOR" }).PARAMVALUE
        urlLogin = jsonParams.data.find((it) => { return it.PARAMCODE === "URL_LOGIN" }).PARAMVALUE
        let phrase = jsonParams.data.find((it) => { return it.PARAMCODE === "PHRASE" }).PARAMVALUE

        let cipher = createCipheriv('aes-256-cbc', apiSecretKey, initVector);
        encryptedHash = cipher.update(phrase, 'utf8', 'base64');
        encryptedHash += cipher.final('base64');
    } catch (err) {
        console.log('29 error : ', err)
        console.error();
    }
    return encryptedHash
};

export async function loginService() {
    await encrypt();
    const url = new URL(urlLogin);
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
    };

    let body = {
        "api_key": apiKey,
        "validation_hash": encryptedHash
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    })
    const jsonData = response.json();
    console.log('+++ loginService.js (line: 58)', JSON.stringify(jsonData));
    return JSON.stringify(jsonData);
}