import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './routes/index';

export default () => {
  let app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  router(app);

  return app;
};
