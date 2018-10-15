import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../../config/main';
import { setUserInfo } from '../middleware/helpers';

//========================================
// Login Route
//========================================
export function login (req, res) {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: generateToken(userInfo),
    user: userInfo
  });
}

//========================================
// Registration Route
//========================================
export function register (req, res) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }
  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }
  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  checkExistingUser(email, password, firstName, lastName)
    .then(user => {
      return saveUserToDb(user);
    })
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => {
      return res.status(422).send({ error: err });
    });
}

//= Helper functions ===================
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

function checkExistingUser (email, password, firstName, lastName) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then(existingUser => {
        if (existingUser) {
          reject('That email address is already in use.');
        }
        let user = new User({
          email: email,
          password: password,
          name: { firstName: firstName, lastName: lastName }
        });
        resolve(user);
      })
      .catch(
        /* istanbul ignore next */
        err => {
          reject(err);
        }
      );
  });
}

function saveUserToDb (user) {
  return new Promise ((resolve, reject) => {
    user.save()
      .then(() => {
        let userInfo = setUserInfo(user);
        resolve(
          {
            token: generateToken(userInfo),
            user: userInfo
          }
        );
      })
      .catch(
        /* istanbul ignore next */
        err => {
          reject(err);
        }
      );
  });
}
