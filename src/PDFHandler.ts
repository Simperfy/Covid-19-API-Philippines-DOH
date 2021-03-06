/* eslint-disable max-len,no-throw-literal */
import fs from 'fs';
import pdfParse from 'pdf-parse';
import path from 'path';

const PATH_TO_PDF = path.join(__dirname, '../tmp/latest.pdf');
const REGEX = 'https://bit.ly/([A-Za-z0-9]+)';

/**
 * Handles latest pdf downloaded through Google Drive
 */
class PDFHandler {
  /**
   * Load latest pdf and return the latest Google Folder Link
   * @return {Promise<String>} Link to latest Google Drive Folder
   */
  getLatestFolderLink = async () => {
    const dataBuffer = fs.readFileSync(PATH_TO_PDF);
    const parsedPDF = await pdfParse(dataBuffer);
    const { text } = parsedPDF;

    const symbol = text.match(REGEX);
    if (symbol === null) throw Error('[PDFHandler.js] Regex Didn\'t matched anything');
    console.log(`Regex Matches: ${symbol[0]}`);
    return symbol[0];
  }
}

export default PDFHandler;
