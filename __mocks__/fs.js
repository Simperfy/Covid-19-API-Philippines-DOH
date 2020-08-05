/* eslint-disable require-jsdoc */
const fs = jest.genMockFromModule('fs');

fs.existsSync = () => true;

module.exports = fs;
