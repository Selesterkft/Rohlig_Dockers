import { loginService, fnParams } from './loginService';
import { db, sqlConfig } from '../db/dbConnection';
import {
    U_TRANSPACKIF_GetShipmentStatus,
    U_TRANSPACKIF_Shipment,
    U_TRANSPACKIF_SetShipmentStatus,
    U_TRANSPACKIF_Shipment_Modify,
    U_TRANSPACKIF_GetIDS_To_Send
} from "../db/storedProcedures";
const fetch = require('node-fetch');
let urlSendShipment;

async function sendToTranspack(myParams) {
    console.log('+++ transpackService.js (line: 14)', myParams);
    const headers = myParams.headers;
    const body = myParams.body;
    const response = await fetch(myParams.url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    })

    const jsonData = await response.json();
    return JSON.stringify(jsonData);
}

async function shipmentById(queryParams) {
    let p = await fnParams();
    let jsonParams = JSON.parse(JSON.stringify(p));
    urlSendShipment = jsonParams.data.find((it) => { return it.PARAMCODE === "URL_SHIPMENTS" }).PARAMVALUE
    let jsonToken = await loginService();
    let tokenParams = JSON.parse(jsonToken);
    const authKey = tokenParams.access_token
    urlSendShipment = urlSendShipment.concat("/", queryParams.shipment_id);
    const url = new URL(urlSendShipment);

    let headers = {
        "Authorization": "Bearer #authkey#",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
    };

    headers = JSON.parse(JSON.stringify(headers).replace("#authkey#", authKey));
    const response = await fetch(url, {
        method: "GET",
        headers,
    })

    const jsonData = await response.json();
    return jsonData;
}

export const transpackService = {
    async shipmentSend(queryParams) {
        db.initiateConnection(sqlConfig);
        let headers = {
            "Authorization": "Bearer #authkey#",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Encoding": "application/json",
        };
        let p = await fnParams();
        let jsonParams = JSON.parse(JSON.stringify(p));
        urlSendShipment = jsonParams.data.find((it) => { return it.PARAMCODE === "URL_SHIPMENTS" }).PARAMVALUE
        const url = new URL(urlSendShipment);
        let jsonToken = await loginService();
        let tokenParams = JSON.parse(jsonToken);
        const authKey = tokenParams.access_token
        console.log('+++ transpackService.js (line: 69)', authKey);
        headers = JSON.parse(JSON.stringify(headers).replace("#authkey#", authKey));
        let rowcount = 0
        let ord_l_ids = await U_TRANSPACKIF_GetIDS_To_Send(queryParams);
        for (let x in ord_l_ids.data) {
            let current_ord_l_id = ord_l_ids.data[x].ord_l_id;
            let idparam = {
                ord_l_id: current_ord_l_id
            }
            const b = await U_TRANSPACKIF_Shipment(idparam);
            const body = b.data
            let myParams = {
                "body": body,
                "headers": headers,
                "url": url
            }
            const respJson = await sendToTranspack(myParams);
            let transPackErrMsg = JSON.parse(respJson).message;
            let transPackMsg = JSON.parse(respJson).msg;
            let transPackRetVal = 500;
            if (transPackMsg === 'Shipment entry created.') {
                transPackRetVal = 200
            }
            myParams = {
                "ord_l_id": current_ord_l_id,
                "json": respJson,
                "response": transPackRetVal,
            }
            const m = await U_TRANSPACKIF_Shipment_Modify(myParams);
            rowcount += 1;
        }
        db.dropConnection()
        return { rowcount: rowcount };
    },

    async shipmentStatus(queryParams) {
        db.initiateConnection(sqlConfig);
        let b = await U_TRANSPACKIF_GetShipmentStatus(queryParams);
        let rowcount = 0
        for (let x in b.data) {
            let current_status_id = b.data[x].current_status_id;
            let ord_l_id = b.data[x].ord_l_id;
            let shipmentJson = await shipmentById(b.data[x]);
            let new_status_id = shipmentJson.data.attributes.shipments.status.id;
            if (current_status_id != new_status_id) {
                let queryParams = {
                    "ORD_L_ID": ord_l_id,
                    "New_Status_ID": new_status_id
                }
                let s = await U_TRANSPACKIF_SetShipmentStatus(queryParams);
            }
            rowcount += 1;
        }
        db.dropConnection()
        return { rowcount: rowcount };
    },

}