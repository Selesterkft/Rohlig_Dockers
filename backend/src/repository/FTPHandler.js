import { Client } from 'basic-ftp';
import * as fs from 'fs';

export default class FTPHandler {
    constructor(ftpConfig, ftpParams) {
        this.ftpConfig = ftpConfig;
        this.ftpParams = ftpParams;
        this.ftpClient = undefined;
        this.encoding = ftpConfig.encoding;
    }

    getNewClient() {
        return new Client(timeout = (ftpParams.timeout * 1000))
    }

    async connect() {
        this.ftpClient = new Client();
        this.ftpClient.ftp.verbose = (process.env.FTP_VERBOSE === 'true');
        await this.ftpClient.access(this.ftpConfig);
    }

    close() {
        this.ftpClient.close();
    }

    async ping() {
        try {
            await this.connect();
            this.close();
            return true;
        } catch (error) {
            return false;
        }
    }

    async cd(newPath) {
        await this.ftpClient.cd(newPath);
    }

    async listCurrentPath() {
        return await this.ftpClient.list();
    }

    async rename(path, newPath) {
        await this.ftpClient.rename(path, newPath);
    }

    async remove(path) {
        await this.ftpClient.remove(path);
    }

    getStreamPath() {
        return (process.env.STREAMS_PATH) ? process.env.STREAMS_PATH : './streams';
    }

    async createStreamPath() {
        if (!fs.existsSync(this.getStreamPath())) {
            fs.mkdirSync(this.getStreamPath());
        }
    }

    async removeFileFromStreamPath(fileName) {
        try {
            await fs.promises.unlink(`${this.getStreamPath()}/${fileName}`);
        } catch (error) {
            //Nothing to do
        }
    }

    async download(fileName) {
        const streamFileName = `${this.getStreamPath()}/${fileName}`;

        await this.createStreamPath();
        await this.removeFileFromStreamPath(fileName);
        await this.ftpClient.downloadTo(streamFileName, fileName);
        const result = fs.readFileSync(streamFileName, { encoding: this.encoding, flag: 'r' });
        this.removeFileFromStreamPath(fileName);
        return result;
    }

    async pwd() {
        return await this.ftpClient.pwd();
    }

    async upload(buffer, fileName) {
        const streamFileName = `${this.getStreamPath()}/${fileName}`;

        await this.createStreamPath();
        await this.removeFileFromStreamPath(fileName);

        fs.writeFileSync(streamFileName, buffer);
        await this.ftpClient.ensureDir(process.env.FTP_STATUSES_UPLOAD_DIR);
        await this.ftpClient.uploadFrom(streamFileName, fileName);
        await this.removeFileFromStreamPath(fileName);

        return {}
    }
}
