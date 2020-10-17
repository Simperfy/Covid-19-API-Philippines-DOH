/* eslint-disable require-jsdoc */
const fs: any = jest.genMockFromModule('fs');

fs.existsSync = () => true;
fs.exists = () => Promise.resolve(true);
export default fs;
