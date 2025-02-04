import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import logger from "./utils/logger.js";
import passport from "./config/passport.js";
import config from "./config/config.js";

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMaxRequests,
  message: "Too many requests from this IP, please try again after 15 minutes",
});


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
// Initialize Passport middleware
app.use(passport.initialize());

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

export default app;
