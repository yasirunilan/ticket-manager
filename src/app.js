import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import logger from "./utils/logger.js";
import passport from "./config/passport.js";
import swaggerRouter from "./config/swagger.js";

const app = express();

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
app.use(passport.initialize());

app.use("/api", routes);
app.use("/api/v1", swaggerRouter);

app.use(errorHandler);
// Log unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
export default app;
