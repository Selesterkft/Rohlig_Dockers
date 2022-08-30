import { ftp } from '../ftp/ftpConnection';
import {
    U_FTP_GET_NEW_TransactID, U_FTP_IMPORT_SHIPMENT
} from '../db/storedProcedures';
import utf8 from 'utf8';

export const datachangeService = {
    async importShipmentsFromFTP() {
        await ftp.connect();

        await ftp.cd(process.env.FTP_SHIPMENTS_DOWNLOAD_DIR);

        const listOfFiles = (await ftp.listCurrentPath()).filter(e => e.name.slice(-4) === '.xml').map(e => e.name);
        const importedFiles = [];
        let ftpTransactId;
        console.log('+++ ftp', listOfFiles)

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
                console.log('+++ data', data, utf8.encode(data))
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
    }
}