require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const initAdmin = require('./src/config/initAdmin');
const { PORT } = require('./src/config/env');

const startServer = async () => {
  await connectDB();
  await initAdmin();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
