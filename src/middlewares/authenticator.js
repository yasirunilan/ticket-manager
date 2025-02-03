import passport from "passport";
import { StatusCodes } from "http-status-codes";

const authenticate = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: info.message });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authenticate;
