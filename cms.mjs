#!/usr/bin/env node
import readline from "readline";
import PossgCore from "possg-core";
import config from "./config.mjs";

const core = new PossgCore(config);
await core.init();

const [,, command, ...args] = process.argv;

/* ---------- utils ---------- */

function usage() {
  console.log(`
Usage:
  cms import <zip>
  cms publish <key>
  cms unpublish <key>
  cms remove <key>
  cms removeall
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

/* ---------- commands ---------- */

try {
  switch (command) {

    /* ----- import ----- */
    case "import": {
      const zip = args[0];
      if (!zip) usage();

      await core.import(zip);
      console.log(`✔ imported: ${zip}`);
      break;
    }

    /* ----- publish ----- */
    case "publish": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を公開しますか？ (yes/no): `);
      if (!ok) console.log("Canceled."); break;

      await core.publish(key, true);
      console.log(`✔ published: ${key}`);
      break;
    }

    /* ----- unpublish ----- */
    case "unpublish": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を非公開に戻しますか？ (yes/no): `);
      if (!ok) console.log("Canceled."); break;

      await core.publish(key, false);
      console.log(`✔ unpublished: ${key}`);
      break;
    }

    /* ----- remove ----- */
    case "remove": {
      const key = args[0];
      if (!key) usage();

      const ok = await confirm(`記事 ${key} を削除しますか？ (yes/no): `);
      if (!ok) console.log("Canceled."); break;

      await core.remove(key);
      console.log(`✔ removed: ${key}`);
      break;
    }

    /* ----- removeall ----- */
    case "removeall": {
      const ok = await confirm("⚠ 全記事を削除します。本当によろしいですか？ (yes/no): ");
      if (!ok) console.log("Canceled."); break;

      await core.removeAll();
      console.log("✔ all articles removed");
      break;
    }

    default:
      usage();
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
