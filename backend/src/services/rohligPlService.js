import { ftp } from '../ftp/ftpConnection';
import {
    U_FTP_GET_NEW_TransactID,
    U_FTP_IMPORT_SHIPMENT,
    U_PLEDI_STATUS_XML_GET_NEXT,
    U_PLEDI_Set_EDI_Communications_Status,
} from '../db/storedProcedures';
import { db, sqlConfig } from '../db/dbConnection';
import Timeout from '../repository/Timeout';

export const rohligPlService = {
    async importShipmentsFromFTP() {
        await ftp.connect();

        await ftp.cd(process.env.FTP_SHIPMENTS_DOWNLOAD_DIR);

        const listOfFiles = (await ftp.listCurrentPath()).filter(e => e.name.slice(-4) === '.txt').map(e => e.name);
        const importedFiles = [];
        let ftpTransactId;

        if (listOfFiles.length > 0) {
            ftpTransactId = (await U_FTP_GET_NEW_TransactID()).FTP_TransactID;

            const startTime = new Date();
            let currentTime = new Date();
            let cFileId = 0;

            while (cFileId < listOfFiles.length && (currentTime - startTime) / 1000 < process.env.DATACHANGE_TIMEOUT) {
                const cFileName = listOfFiles[cFileId];
                const changedFileName = `${cFileName}_${ftpTransactId}`;

                await ftp.rename(cFileName, changedFileName)
                const data = await ftp.download(changedFileName);
                const saveInfo = await U_FTP_IMPORT_SHIPMENT(ftpTransactId, cFileName, data);

                await ftp.remove(changedFileName);

                importedFiles.push(
                    {
                        result: saveInfo.result,
                        message: saveInfo.message,
                        fileName: cFileName,
                        fileId: saveInfo.fileId,
                        OrdId: saveInfo.OrdId,
                        NOC: saveInfo.NOC,
                    }
                );
                cFileId++
                currentTime = new Date();
            }
        }

        ftp.close();

        return {
            ftpTransactId,
            importedFiles,
        };
    },

    async exportStatuses(params) {
        await ftp.connect();

        const exportedFiles = [];
        const timeout = new Timeout(params.timeout, 60);

        do {
            db.initiateConnection(sqlConfig);
            const fileToUpload = await U_PLEDI_STATUS_XML_GET_NEXT()
            if (!fileToUpload.fileId) {
                db.dropConnection()
                break;
            }

            if (!fileToUpload.shipmentReference) {
                fileToUpload.result = {
                    status: 'ERR',
                    message: 'shipmentReference is empty!'
                }
            } else {
                const buffer = Buffer.from(fileToUpload.xml, 'utf-8');
                await ftp.upload(buffer, fileToUpload.fileName);
                fileToUpload.result = {
                    status: 'OK',
                    message: ''
                }
            }
            db.dropConnection()

            db.initiateConnection(sqlConfig);
            await U_PLEDI_Set_EDI_Communications_Status(fileToUpload);
            exportedFiles.push(fileToUpload);
            db.dropConnection()

        } while (!timeout.isEllapsed())
        ftp.close();

        return {
            exportedFiles,
        }
    }
}