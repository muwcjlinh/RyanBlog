import User from '../models/user';
import { setUserInfo } from '../middleware/helpers';

//= =============================
//= Update User's Info
//= =============================
export function updateUserInfo (req, res) {
  findUser(req.user._id)
    .then(function (user) {
      user.job = req.body.job;
      user.bio = req.body.bio;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.gender = req.body.gender;
      user.birth = req.body.birth;
      return saveUser(user);
    })
    .then(result => {
      res.status(200).json({ info: result });
    })
    .catch(
      /* istanbul ignore next */
      err => {
        res.status(422).json({ error: err });
      }
    );
}

//= =============================
//= Get User's Info
//= =============================
export function getUserInfo (req, res) {
  findUser(req.user._id)
    .then(user => {
      res.status(200).json({ info: setUserInfo(user) });
    })
    .catch(
      /* istanbul ignore next */
      err => {
        console.log(err);
        res.status(422).json({ error: err });
      }
    );
}

//= Helper functions ============
function findUser (userId) {
  return new Promise ((resolve, reject) => {
    User.findOne({ _id: userId })
      .then((user) => {
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

function saveUser (user) {
  return new Promise ((resolve, reject) => {
    user.save()
      .then(() => {
        resolve('User\'s info - Updated.');
      })
      .catch(
        /* istanbul ignore next */
        err => {
          reject(err);
        }
      );
  });
}
