import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'El nombre es obligatorio'
  },
  email: {
    type: String,
    trim: true,
    unique: 'El email ya existe',
    match: [/.+\@.+\..+/, 'Ingrese un email correcto'],
    required: 'El email es obligatorio'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: 'El password es obligatorio'
  },
  salt: String,
  about: {
    type: String,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 8) {
    this.invalidate('password', 'El password debe tener un mínimo de 8 caracteres');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'El password es obligatorio')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if(!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (error) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf * Math.random())) + ''
  }
}


export default mongoose.model('User', UserSchema);