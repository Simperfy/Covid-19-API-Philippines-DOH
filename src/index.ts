/* eslint-disable import/first */
/* eslint-disable max-len */
import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import server from './graphql';

const port = process.env.OPTIC_API_PORT || process.env.PORT || 3000;

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.use('/', (req, res) => res.redirect('https://documenter.getpostman.com/view/12463261/T1LV9jLU'));

  app.listen(port, () => {
    console.log(`\nStarted Server: http://localhost/${port}`);
    console.log(`GraphQL Server started: http://localhost:${port}${server.graphqlPath}\n`);
  });
})();
