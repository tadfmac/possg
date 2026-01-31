// init.mjs
import fs from "fs-extra";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// possg package root
const POSSG_ROOT = __dirname;

// assets
const SAMPLE_CONFIG = path.join(POSSG_ROOT, "config.example.mjs");
const TEMPLATE_DIR = path.join(POSSG_ROOT, "template");
const APP_NAME = "app.mjs";
const APP_PATH = path.join(POSSG_ROOT,APP_NAME);
const PACKAGE_NAME = "package.json";
const PACKAGE_PATH = path.join(POSSG_ROOT,PACKAGE_NAME);

const IGNORE_FILES = new Set([
  ".DS_Store",
  "Thumbs.db",
  ".gitkeep",
]);

const GITIGNORE = `
.DS_Store
node_modules
`;

class InitApp{
  constructor(){

  }
  async init(targetDir){
    const outDir =
      targetDir === "."
        ? process.cwd()
        : path.resolve(process.cwd(), targetDir);

    if (await fs.pathExists(outDir)) {
      const files = await fs.readdir(outDir);
      const visible = files.filter(f => !IGNORE_FILES.has(f));
      if (visible.length > 0) {
        console.error(`Directory is not empty: ${outDir}`);
        return;
      }
    }

    console.log(`Initializing possg site at: ${outDir}`);

    await fs.ensureDir(outDir);
    const configPath = path.join(outDir, "config.mjs");
    await fs.copy(SAMPLE_CONFIG, configPath);

    const { default: config } = await import(
      pathToFileURL(configPath).href
    );

    const dbRoot = path.join(outDir, config.DB_DIR);
    const tmpRoot = path.join(outDir, config.TMP_DIR);
    const templateRoot = path.join(outDir, config.TEMPLATE_DIR);

    await fs.ensureDir(dbRoot);
    await fs.ensureDir(tmpRoot);
    await fs.ensureDir(templateRoot);

    await fs.copy(TEMPLATE_DIR, templateRoot);

    await fs.copy(APP_PATH,path.join(outDir,APP_NAME));
    await fs.copy(PACKAGE_PATH,path.join(outDir,PACKAGE_NAME));

    const gitignore = GITIGNORE;

    await fs.writeFile(
      path.join(outDir, ".gitignore"),
      gitignore.trimStart()
    );

    console.log("✔ possg project initialized");
    console.log("");
    console.log("Next steps:");
    console.log("edit your config.mjs");
    console.log(`  cd ${path.relative(process.cwd(), outDir) || "."}`);
    console.log("  possg createroute");
  }
  async #loadConfig() {
    const configPath = path.join(process.cwd(), "config.mjs");

    if (!await fs.pathExists(configPath)) {
      console.error("possg.config.js not found. Run possg init first.");
      return null;
    }

    const { default: config } = await import(pathToFileURL(configPath).href);

    return config;
  }
  async createRoute(){
    const outDir = process.cwd();
    const config = await this.#loadConfig();

    const wwwRoot = path.join(outDir, config.WWW_DIR);
    const contentRoot = path.join(wwwRoot, config.CONTENT_DIR);
    const stagingRoot = path.join(wwwRoot, config.STAGING_DIR);

    await fs.ensureDir(wwwRoot);
    await fs.ensureDir(contentRoot);
    await fs.ensureDir(stagingRoot);

    console.log("✔ possg www route directories created!");
  }
}

export default InitApp;
