/* eslint-disable max-len,no-throw-literal */
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
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
  async getLatestFolderLink() {
    const dataBuffer = fs.readFileSync(PATH_TO_PDF);
    const parsedPDF = await pdfParse(dataBuffer);
    const text = parsedPDF.text;

    const symbol = text.match(REGEX);
    if (symbol === null) {
      throw '[PDFHandler.js] Regex Didn\'t matched anything';
    }
    console.log('Regex Matches: ' + symbol[0]);
    return symbol[0];
  }
}

exports.PDFHandler = PDFHandler;
