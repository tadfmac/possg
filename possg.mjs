#!/usr/bin/env node
import readline from "readline";
import PossgCore from "possg-core";
import InitApp from "./init.mjs";
import path from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";

const initApp = new InitApp();

let core = null;

async function getCore(conf) {
  if (!core) {
    core = new PossgCore(conf);
    await core.init();
  }
  return core;
}

const [,, command, ...args] = process.argv;

/* ---------- utils ---------- */

function usage() {
  console.log(`
Usage:
  possg init <target dir>
  possg import <zip>
  possg publish <key>
  possg unpublish <key>
  possg remove <key>
  possg removeall
  possg buildall
`);
  process.exit(1);
}

function confirm(msg) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(msg, answer => {
      rl.close();
      resolve(answer === "yes");
    });
  });
}

async function loadConfig() {
  const configPath = path.join(process.cwd(), "config.mjs");

  if (!await fs.pathExists(configPath)) {
    throw new Error("config.mjs not found. Run possg init first.");
  }

  const { default: config } =
    await import(pathToFileURL(configPath).href);

  return config;
}

/* ---------- commands ---------- */

try {
  switch (command) {
    case "init":
      if (!args[0]) {
        console.error("Usage: possg init <dir>");
        break;
      }
      const ok = await confirm(`初期化しますか？ (yes/no): `);
      if (!ok) {console.log("Canceled."); break;}

      await initApp.init(args[0]);
      break;

    case "createroute":
      await initApp.createRoute();
      break;

    /* ----- import ----- */
    case "import": {
      const zip = args[0];
      if (!zip) usage();

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.import(zip);
      console.log(`✔ imported: ${zip}`);
      break;
    }

    /* ----- publish ----- */
    case "publish": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を公開しますか？ (yes/no): `);
      if (!ok) {console.log("Canceled."); break;}

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.publish(key, true);
      console.log(`✔ published: ${key}`);
      break;
    }

    /* ----- unpublish ----- */
    case "unpublish": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を非公開に戻しますか？ (yes/no): `);
      if (!ok) {console.log("Canceled."); break;}

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.publish(key, false);
      console.log(`✔ unpublished: ${key}`);
      break;
    }

    /* ----- remove ----- */
    case "remove": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を削除しますか？ (yes/no): `);
      if (!ok) {console.log("Canceled."); break;}

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.remove(key);
      console.log(`✔ removed: ${key}`);
      break;
    }

    /* ----- removeall ----- */
    case "removeall": {
      const ok = await confirm("⚠ 全記事を削除します。本当によろしいですか？ (yes/no): ");
      if (!ok) {console.log("Canceled."); break;}

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.removeAll();
      console.log("✔ all articles removed");
      break;
    }

    case "buildall": {
      const ok = await confirm("⚠ 全記事のhtmlを再生成します。よろしいですか？ (yes/no): ");
      if (!ok) {console.log("Canceled."); break;}

      const conf = await loadConfig();
      core = await getCore(conf);
      await core.buildAll();
      console.log("✔ all html rebuilt");
      break;
    }
    default:
      usage();
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
