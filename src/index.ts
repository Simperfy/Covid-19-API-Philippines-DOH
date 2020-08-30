/* eslint-disable max-len */
import {app} from './app';
const port = process.env.OPTIC_API_PORT || process.env.PORT || 3000;

app.listen(port, () => console.log(`\nStarted Server on port: ${port}`));
