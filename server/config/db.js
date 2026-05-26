const mongoose = require('mongoose');
const config = require('./index');

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDb Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
