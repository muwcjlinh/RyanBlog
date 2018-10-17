import express from 'express';
import * as AuthenticationController from '../controllers/authentication';
import * as UserController from '../controllers/user';
import * as CategoryController from '../controllers/category';
import passportService from '../middleware/passport'; /* eslint-disable-line */
import passport from 'passport';

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default (app) => {
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    categoryRoutes = express.Router();

  // Set API group
  app.use('/api', apiRoutes);

  app.get('/', (req, res) => {
    res.send('Welcome to the 1st edition of Ryan\'s blog.');
  });

  //= ========================
  //= Auth Routes
  //= ========================
  apiRoutes.use('/auth', authRoutes);
  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  //= ========================
  //= User Routes
  //= ========================
  apiRoutes.use('/user', userRoutes);
  userRoutes.get('/', requireAuth, UserController.getUserInfo);
  userRoutes.put('/update', requireAuth, UserController.updateUserInfo);

  //= ========================
  //= Category Routes
  //= ========================
  apiRoutes.use('/category', categoryRoutes);
  categoryRoutes.post('/create', requireAuth, CategoryController.createCategory);
  categoryRoutes.post('/detail/create', requireAuth, CategoryController.createDetailCategory);
  categoryRoutes.put('/update/:categoryId', requireAuth, CategoryController.updateCategory);
};
