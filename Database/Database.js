/* eslint-disable require-jsdoc */
class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance=this;
    }

    return Database.instance;
  }

  async all() {}

  async filter() {}
}

exports.Database = Database;
