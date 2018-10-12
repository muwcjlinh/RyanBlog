import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

//= ================
//= User Schema
//= ================
const UserSchema = new Schema ({
  email: { type: String, lowercase: true, unique: true, required: true },
  password: { type: String, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  job: { type: String, required: false },
  bio: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  gender: { type: String, required: false },
  birth: { type: String, required: false }
},
{
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const SALT_FACTOR = 5;
  const user = this;

  /* istanbul ignore if */
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    /* istanbul ignore if */
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      /* istanbul ignore if */
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    /* istanbul ignore if */
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

export default mongoose.model('User', UserSchema);
