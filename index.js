/* eslint-disable max-len */
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`\nStarted Server on port: ${port}`));