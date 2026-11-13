import express from "express";
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.js";

const app = express();
app.disable("x-powered-by");
app.set(
  "trust proxy",
  process.env.TRUST_PROXY || "loopback, linklocal, uniquelocal"
);
app.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" })
);
app.use(express.static("build/client", { maxAge: "1h" }));
app.all("*", createRequestHandler({ build }));

const port = Number(process.env.PORT) || 3000;
app.listen(port, process.env.HOST || "0.0.0.0", () =>
  console.log(`listening on ${port}`)
);