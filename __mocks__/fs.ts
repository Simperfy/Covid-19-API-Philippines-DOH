/* eslint-disable require-jsdoc */
const fs: any = jest.genMockFromModule('fs');

fs.existsSync = () => true;

export default fs;
