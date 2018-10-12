import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './routes/index';
import mongoose from 'mongoose';
import config from '../config/main';

export default () => {
  let app = express();

  // Database Connection
  mongoose.connect(config.database, { useNewUrlParser: true });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  router(app);

  return app;
};
