/* eslint-disable require-jsdoc */
class MockCSV {
  fromFile(path) {
    return Promise.resolve([{'someDate': 'someValue'}]);
  }
}

csv = () => new MockCSV();

module.exports = csv;
