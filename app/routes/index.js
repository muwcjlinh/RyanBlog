import express from 'express';
import * as AuthenticationController from '../controllers/authentication';
import passportService from '../middleware/passport'; /* eslint-disable-line */
import passport from 'passport';

// Middleware to require login/auth
// const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default (app) => {
  const apiRoutes = express.Router(),
    authRoutes = express.Router();

  // Set API group
  app.use('/api', apiRoutes);

  app.get('/', (req, res) => {
    res.send('Welcome to the 1st edition of Ryan\'s blog.');
  });

  //= ========================
  //= Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);
};
