/** Required External Modules */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import CookieParser from "cookie-parser";

import initializeDB from "./utils/db";
import userRouter from "./resources/user";
import adminUserRouter from "./admin/resources/user";
import eventRouter from "./resources/event";
import statsRouter from "./resources/stats";
import tournamentRouter from "./resources/tournament";
import summaryRouter from "./resources/summary";
import statSummaryCron from "./cron/statsSummary";
import matchRouter from "./resources/match";

dotenv.config();

/** App Variables */

// Check if port was loaded into process environment
if (!process.env.PORT) {
  console.log("Error finding environment variable PORT");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

// Creates connection to Database
(async () => {
  await initializeDB();

  await statSummaryCron();
})();
// Creates instance of an express application
const app = express();

/** App Configuration */

// Mount middleware to entry point
app.use(helmet()); // Middleware functions that set HTTP resp headers
app.use(cors()); // Enables CORS requests
app.use(CookieParser());
app.use(express.json()); // Parses incoming requests with JSON payloads

// Routes
app.use("/api/users", userRouter);
app.use("/admin/users", adminUserRouter);
app.use("/api/events", eventRouter);
app.use("/api/stats", statsRouter);
app.use("/api/tournaments", [tournamentRouter, matchRouter]);
app.use("/api/summary", summaryRouter);

/** Server Activation */

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/** Webpack HMR Activation */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept(); // Accepts updates for the given module and its dependencies
  module.hot.dispose(() => server.close()); // Removes persistent resources
}
