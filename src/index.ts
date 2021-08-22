import express, { Request, Response, NextFunction } from "express";
import logging from "./config/logging";
import cors from "cors";
import http from "http";
import AppRouter from "./router";
import config from "./config/config";
const NAMESPACE = "server";

const openServer = async () => {
  try {
    const router = express();
    router.use((req: Request, res: Response, next: NextFunction) => {
      logging.info(
        NAMESPACE,
        `METHOD-[${req.method}], URL-[${req.url}], IP-[${req.socket.remoteAddress}]`,
      );
      res.on("finish", () => {
        logging.info(
          NAMESPACE,
          `METHOD-[${req.method}], URL-[${req.url}], IP-[${req.socket.remoteAddress}], STATUS-[${res.statusCode}]`,
        );
      });
      next();
    });
    router.use(express.json());
    router.use(cors());
    router.use("/", AppRouter);
    logging.info(NAMESPACE, "env variable check - " + JSON.stringify(config));
    const httpServer = http.createServer(router);
    httpServer.listen(config.server.port, () => {
      logging.info(
        NAMESPACE,
        `server is running on ${config.server.hostname}:${config.server.port}`,
      );
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message);
  }
};

openServer();
