import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import config from './config.js';
import { AuthenticationError } from '../utils/appError.js';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, new AuthenticationError('Incorrect credentials.'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, new AuthenticationError('Incorrect credentials.'));
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;