import 'dotenv/config';
import app from './app.js';
import database from './config/db.js';
import env from './config/env.js';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();