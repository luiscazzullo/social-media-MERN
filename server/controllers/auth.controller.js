import User from '../models/User';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../../config/config';

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ 
      email: req.body.email 
    });

    if(!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if(!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: 'No se pudo autenticar' });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie('t', token, { expire: new Date() + 9999 });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(401).json({ error: 'No se pudo registrar' });
  }
}

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({
    message: 'Cerró sesión'
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
  algorithms: ['sha1', 'RS256', 'HS256']
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "Usuario no autorizado"
    })
  }
  next()
}

export default { 
  signin, 
  signout, 
  requireSignin, 
  hasAuthorization 
};