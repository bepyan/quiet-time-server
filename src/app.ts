import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import routers from './routes';
import {
  loadDB,
  load_heroku_awaker,
  load_QTContent_collector,
  load_QTConent_publisher,
} from './loaders';
import { errorResponser, errorLogger } from './middlewares';

const app = express();
const PORT = process.env.PORT || 1234;

loadDB();
load_heroku_awaker();
load_QTConent_publisher();
load_QTContent_collector();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routers);
app.use(errorLogger);
app.use(errorResponser);

app.listen(PORT, () => {
  console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   Server listening on port: ${PORT}    ┃
  ┃     http://localhost:${PORT}/api       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});
