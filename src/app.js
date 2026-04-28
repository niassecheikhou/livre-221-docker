import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import setupSwagger from './config/swagger.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

setupSwagger(app);

app.use(notFound);
app.use(errorHandler);

export default app;