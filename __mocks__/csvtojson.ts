/* eslint-disable require-jsdoc */
class MockCSV {
  fromFile(path: any) {
    return this;
  }

  preFileLine(callback: any) {
    return Promise.resolve([{'someDate': 'someValue'}]);
  }
}

export function csv(): MockCSV {
  return new MockCSV();
}
