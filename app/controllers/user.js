import User from '../models/user';

//= =============================
//= Update User's Info
//= =============================
export async function updateUserInfo (req, res) {
  try {
    let user = await findUser(req.user._id);
    user.job = req.body.job;
    user.bio = req.body.bio;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.gender = req.body.gender;
    user.birth = req.body.birth;
    let result = await saveUser(user);
    res.status(200).json({ info: result });
  } catch (err) {
    /* istanbul ignore next */
    res.status(422).json({ error: err });
  }
}

//= Helper functions ============
function findUser (userId) {
  return new Promise ((resolve, reject) => {
    User.findOne({ _id: userId })
      .then((user) => {
        resolve(user);
      })
      .catch(err => {
        /* istanbul ignore next */
        reject(err);
      });
  });
}

function saveUser (user) {
  return new Promise ((resolve, reject) => {
    user.save()
      .then(() => {
        resolve('User\'s info - Updated.');
      })
      .catch(err => {
        /* istanbul ignore next */
        reject(err);
      });
  });
}
