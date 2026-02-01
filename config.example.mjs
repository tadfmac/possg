const config = {
  "PORT":3350,
  "WWW_DIR" : "www",
  "CONTENT_DIR" : "contents",
  "STAGING_DIR" : "staging",
  "TMP_DIR" : ".tmp",
  "DB_DIR" : "db",
  "DB_FILE_NAME" : "articles.db",
  "STAGING_URL_BASE" : "/staging",
  "CONTENT_URL_BASE" : "/",
  "TEMPLATE_DIR" : "template",
  "TEMPLATE_FILE_NAME" : "content-template.ejs",
  "IDX_TEMPLATE_FILE_NAME" : "index-template.ejs",
  "frontmatter": {
    "core": {
      "title": {
        "type": "string",
        "required": true
      },
      "datetime": {
        "type": "datetime",
        "required": true
      }
    },
    "meta": {
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "required": false
      }
    }
  },
  "GA_ID":"G-1234567890",
  "BLOGTITLE": "シンプルBlog",
  "FOOTERTEXT": "type your credit",
  "BLOGDESC": "ここは秘密のBlogです。",
  "INDEX_PAGE_SIZE":10,
  "ICON_URL":"/img/icon.png",
  "RETURN_URL":"/",
  "RETURN_TEXT":"Top page"
};

export default config;
