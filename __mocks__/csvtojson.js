/* eslint-disable require-jsdoc */
class MockCSV {
  fromFile(path) {
    return this;
  }

  preFileLine(callback) {
    return Promise.resolve([{'someDate': 'someValue'}]);
  }
}

csv = () => new MockCSV();

module.exports = csv;
