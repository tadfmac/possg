# possg

[日本語](./README-JP.md)

A simple SSG for blogs.

## Features

- `import`: bring in articles via a zip file or a folder
- `publish` / `unpublish`: toggle an article between draft (staging) and published (content)
- `buildall`: bulk-regenerate all articles after a template change
- Tag feature: automatically generates filtered index pages from an article's frontmatter `tags`
- Syntax highlighting for code blocks ([highlight.js](https://highlightjs.org/))
- `genviewer`: generates HTML that lets you preview an article (zip) just by dragging and dropping it into the browser
- `version`: shows the current version of possg / possg-core

## Installation (Provisional — Still Under Development)

Still under active development, so things will keep changing!

### 1. Install possg

```
npm install -g possg
```

This makes the `possg` command available (`possg-core` is also installed automatically as a dependency).

If the command runs, you're all set:
```
possg

Usage:
  possg init <target dir>
  possg createroute
  possg import <zip|folder>
  possg publish <key>
  possg unpublish <key>
  possg remove <key>
  possg removeall
  possg buildall
  possg genviewer
  possg version
```

**If you want to contribute (working from source)**

If you want to try modifying the possg / possg-core code directly, you can use `npm link` to have your local source referenced directly.

```
git clone https://github.com/tadfmac/possg-core.git
cd possg-core
npm i
npm link .
cd ..

git clone https://github.com/tadfmac/possg.git
cd possg
npm link possg-core
npm i
npm link .
cd ..
```

### 2. Set Up Your Environment

Set up a working directory. Here we'll create one called `work` as an example.

```
mkdir work
cd work
possg init .
```

This generates some of the files you need inside `work` (`config.mjs` / `template/` / `customfunc/` / `db/` / `examples/`, etc.).

### 3. Edit config.mjs

Configure blog-related settings such as the title.
Configure the folder paths where content gets generated, and so on (see [possg-core's README](https://github.com/tadfmac/possg-core/blob/main/README.md#main-configmjs-keys) for the available settings).

```
possg createroute
```

Running this additionally generates the directories configured in `config.mjs`.

### 4. Generate .env and Start the Web Server (Optional)

If you want to use possg's built-in web server, do the following extra setup.

The staging root is protected by a basic-auth password.
Set this up in `.env`.

```
cd possg
touch .env
```

Save `.env` with content like this:
```
BASIC_USER=<username>
BASIC_PASS=<password>
```

Then start the server with:

```
cd work
npm i
npm start
```

possg can also be used as a plain HTML file generator.
In that case, host the generated files yourself on any web server that can serve static files, such as httpdocs.

### 5. Edit the Template

Sample versions of the following files are placed under `/template`.

- `content-template.ejs` — the article page template
- `index-template.ejs` — the index page template
- `possg.css` — the stylesheet loaded by both templates above (the URL it's loaded from is set via `CSS_URL` in config.mjs)
- `possg.js` — the script that powers the code block's copy button (loaded from the URL set via `JS_URL`)

Customize these as you like. `possg/template/` is the master copy, and it gets copied into each app's `template/` at init time (it isn't kept in sync automatically after that, so if you want to change both, you'll need to apply the change manually to each).

### 6. Import the Sample Article

There's a sample article at `/examples/20260126.zip`.
Let's turn it into HTML.

```
possg import ./examples/20260126.zip
```

This creates the article.

`import` accepts not just zip files but also **a folder specified directly**, containing `index.md` and images (you can point it at the unzipped folder as-is).

```
unzip ./examples/20260126.zip -d ./examples/
possg import ./examples/20260126
```

### 7. Check the Sample Article

Try visiting `http://localhost:3550/staging/` in your browser. (You'll need to enter the id/pass you set in `.env`.)

You should see an index page with a link to just the one article.

### 8. Edit or Add Sample Articles

Unzipping `/examples/20260126.zip` gives you `index.md`.
Edit it, then either zip it back up or re-import it as a folder, and the article gets rewritten.

You can also copy and rename the folder or zip (for a zip the filename becomes the key, for a folder it's the folder name), edit `index.md`, and import it to add a different article.

### 9. Publish / Unpublish an Article

An imported article starts out in draft (staging) state. To publish it:

```
possg publish 20260126
```

To un-publish it and move it back to draft:

```
possg unpublish 20260126
```

### 10. Delete an Article

To delete an imported article, just run the command below.
To delete the article you imported earlier as `20260126.zip`, specify the filename (or folder name) without the `.zip`, i.e. `20260126`.

```
possg remove 20260126
```

### 11. Regenerate Articles After a Template Change

To regenerate the HTML for every imported article — for example after changing a template — run:

```
possg buildall
```

## Tag Feature

Specifying `tags` in an article's frontmatter automatically generates an article-list page filtered by that tag.

```yaml
---
title: Article title
datetime: "20260101 12:00"
tags: ["food", "Yokohama"]
---
```

To use this, you need a `tags` schema defined under `frontmatter.meta` in `config.mjs` (see `config.example.mjs` for an example definition). On apps that don't define it, the tag feature itself isn't generated at all.

## Syntax Highlighting

Specify a language on a code block in your article body, and it gets colorized automatically.

````markdown
```javascript
const hello = () => console.log("hi");
```
````

## Article Preview (genviewer)

If you want to check how a zip article would render with the real template and styles before actually `import`-ing it, use `genviewer`.

```
possg genviewer
```

Running this generates `viewer.html` directly under your working directory. Open it in a browser — double-clicking to open it as `file:///` works, and so does hosting it on a web server — and dragging and dropping a zip file onto it previews the rendered result right there. The "Reload" button reloads whatever changes were made to the last file you dropped (Chromium-based browsers only).

**Note**: if the template uses Apache SSI (`<!--#include virtual="...">`), the SSI part is resolved via `fetch()`, so opening it as `file:///` will leave just that part unresolved due to the browser's fetch restrictions (everything else works fine). If you want to fully verify a template that uses SSI, host `viewer.html` on a web server and access it that way.

For how to handle a template that depends on an external CDN library (jQuery, a carousel library, etc.), see [possg-core's README](https://github.com/tadfmac/possg-core/blob/main/README.md#genviewer-article-preview) (you configure this on the `customfunc.mjs` side). SSI needs no configuration at all, since it's auto-detected.

## Checking the Version

```
possg version
```

Shows the current version of `possg` and `possg-core` respectively.

## LICENSE

MIT
