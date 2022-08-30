import { ftp } from '../ftp/ftpConnection';

export const ftpService = {
    async pwd() {
        await ftp.connect();
        const result = await ftp.pwd();
        ftp.close();
        return result;
    },

    async cd(newPath) {
        await ftp.connect();
        await ftp.cd(newPath)
        const pwd = await ftp.pwd();
        const listOfFiles = await ftp.listCurrentPath();
        ftp.close();
        return {
            pwd,
            listOfFiles
        }
    }
}
