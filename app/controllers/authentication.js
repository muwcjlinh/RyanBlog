import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../../config/main';

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.name.firstName,
    lastName: request.name.lastName,
    email: request.email,
  };
}

//========================================
// Login Route
//========================================
export function login (req, res) {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}

//========================================
// Registration Route
//========================================
export async function register (req, res) {
  try {
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

    let user = await checkExistingUser(email, password, firstName, lastName);
    let result = await saveUserToDb(res, user);
    res.status(201).json(result);
  }
  catch (err) {
    return res.status(422).send({ error: err });
  }
}

//= Helper functions ===================
function checkExistingUser (email, password, firstName, lastName) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then(existingUser => {
        if (existingUser) {
          reject({ error: 'That email address is already in use.' });
        }
        let user = new User({
          email: email,
          password: password,
          name: { firstName: firstName, lastName: lastName }
        });
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function saveUserToDb (res, user) {
  return new Promise ((resolve, reject) => {
    user.save()
      .then(() => {
        let userInfo = setUserInfo(user);
        resolve(
          {
            token: 'JWT ' + generateToken(userInfo),
            user: userInfo
          }
        );
      })
      .catch(err => {
        reject(err);
      });
  });
}
