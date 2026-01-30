// app.mjs
// possg hosting server
// (C)2026 by D.F.Mac.@TripArts Music

import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';　
import path from 'path';
import auth from 'basic-auth';
import dt from 'date-utils';
import dotenv from "dotenv";
import config from "./config.mjs";

const fsp = fs.promises;
const dirname = path.dirname(new URL(import.meta.url).pathname);
const LISTEN_IP = "127.0.0.1";
const LISTEN_PORT = config.PORT;

const ROOT_PATH = process.cwd();
const STAGING_WWW_PATH = path.join(ROOT_PATH,config.WWW_DIR,config.STAGING_DIR);
const CONTENT_WWW_PATH = path.join(ROOT_PATH,config.WWW_DIR,config.CONTENT_DIR);

console.log("STAGING_WWW_PATH="+STAGING_WWW_PATH);
console.log("CONTENT_WWW_PATH="+CONTENT_WWW_PATH);

let webServer;
let app;

dotenv.config();

function log(str){
  var dt = new Date();
  let datetime = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log("["+datetime+"] "+(str));
}

try {
  await runExpressApp();
  await runWebServer();
} catch (err) {
  console.error(err);
}

function basicAuth(req, res, next){
  const user = auth(req);
  const validUser = process.env.BASIC_USER;
  const validPass = process.env.BASIC_PASS;
  if (!user || user.name !== validUser || user.pass !== validPass) {
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res.status(401).send("Authentication required.");
  }
  next();
}

async function runExpressApp() {
  app = express();
  app.use(express.urlencoded({ extended: true , limit: '10mb'}));
  app.use(express.json({ extended: true , limit: '10mb'}));
  app.use(cors());
  app.use(config.STAGING_URL_BASE,basicAuth,express.static(STAGING_WWW_PATH));
  app.use(config.CONTENT_URL_BASE,express.static(CONTENT_WWW_PATH));
}

async function runWebServer() {
  webServer = http.createServer(app);
  webServer.on('error', (err) => {
    console.error('starting web server failed:', err.message);
  });

  await new Promise((resolve) => {
    webServer.listen(LISTEN_PORT, () => {
      console.log('server is running PORT:'+LISTEN_PORT);
      resolve();
    });
  });
}
