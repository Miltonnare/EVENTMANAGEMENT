const app = require('./app');
const config = require('./config');
const connectDb = require('./config/db');

const startServer = async () => {
  await connectDb();

  app.listen(config.port, () => {
    console.log(`Server running on PORT: ${config.port}`);
  });
};

startServer();
