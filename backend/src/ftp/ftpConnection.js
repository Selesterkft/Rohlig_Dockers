import FTPHandler from '../repository/FTPHandler';

const ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === 'true' ? true : false,
    encoding: process.env.FTP_ENCODING ? process.env.FTP_ENCODING : 'utf8',
  };

export const ftpParams = {
  timeout: isNaN(parseInt(process.env.FTP_TIMEOUT)) ? 30 : parseInt(process.env.FTP_TIMEOUT)
}

export const ftp = new FTPHandler(ftpConfig, ftpParams);
