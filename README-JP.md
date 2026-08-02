# possg

[English](./README.md)

BLOG向けのシンプルなSSGです。

## 特徴

- `import`: zipファイルまたはフォルダで記事を入稿
- `publish` / `unpublish`: 下書き(staging)⇔公開(content)の切り替え
- `buildall`: テンプレート修正後の全記事一括再生成
- タグ機能: frontmatterの`tags`から絞り込みindexページを自動生成
- コードブロックのシンタックスハイライト([highlight.js](https://highlightjs.org/))
- `genviewer`: 記事(zipまたはフォルダ)をブラウザにドラッグ&ドロップするだけでプレビューできるHTMLを生成
- `geneditor`: ライブプレビュー付きの自己完結型記事エディタを生成(既存記事の読み込み・同形式での上書き保存にも対応)
- `version`: possg / possg-coreのバージョン表示

## 導入（開発中のため暫定）

まだ開発中なので、いろいろ変わります！

### 1. possg のインストール

```
npm install -g possg
```

これで`possg`コマンドが使えるようになります(`possg-core`も依存パッケージとして自動的にインストールされます)。

コマンド実行できたら成功
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
  possg genviewer [-static]
  possg geneditor [-static] [-title <title>]
  possg version
```

**開発に参加する場合(ソースから利用する場合)**

possg / possg-core本体のコードを直接修正しながら試したい場合は、`npm link`でローカルのソースを直接参照させることができます。

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

### 2. 環境構築

ワークディレクトリを設定します。
任意のディレクトリ ここでは例として `work` を作成します。

```
mkdir work
cd work
possg init .
```

これで必要なファイルの一部が `work` 内に生成されます(`config.mjs` / `template/` / `customfunc/` / `db/` / `examples/` など)。

### 3. config.mjs を編集

タイトルなどblog用の設定を行います。
コンテンツを生成するフォルダパス等の設定を行います(利用可能な設定項目は[possg-coreのREADME](https://github.com/tadfmac/possg-core/blob/main/README-JP.md#主なconfigmjsキー)を参照)。

```
possg createroute
```

を実行すると `config.mjs` に設定したディレクトリを追加で生成します。

### 4. .env の生成とwebサーバ起動（オプション）

possgにビルトインされたwebサーバを利用する場合は追加で下記設定を行なってください。

stagingルートにはbasic認証パスワードがかかっています。
これを `.env` に設定します。

```
cd possg
touch .env
```

下記のような内容で `.env` を保存してください。
```
BASIC_USER=<username>
BASIC_PASS=<password>
```

その後、下記コマンドでサーバーを起動します。

```
cd work
npm i
npm start
```

possg は 単なる htmlファイルジェネレータとしても利用可能です。
その場合は生成されたファイルを別途任意のwebサーバがホスティングできる httpdoc などにおいてホスティングしてください。

### 5. template を修正する

`/template` 配下に下記ファイルのサンプルが置いてあります。

- `content-template.ejs` 記事ページのテンプレート
- `index-template.ejs` インデックスページのテンプレート
- `possg.css` 上記2つのテンプレートが読み込むスタイルシート(`config.mjs`の`CSS_URL`で読み込みURLを指定)
- `possg.js` コードブロックのコピーボタン用スクリプト(`JS_URL`で読み込みURLを指定)

適宜カスタマイズしてご利用ください。`possg/template/`がマスターで、init時に各アプリの`template/`へコピーされたもの(それ以降は自動同期されないので、両方直す場合は手動で反映してください)。

### 6. サンプル記事のインポート

`/examples/20260126.zip` にサンプル記事があります。    
こちらをHTMLにしてみましょう。

```
possg import ./examples/20260126.zip
```

これで記事ができます。

`import`はzipファイルだけでなく、`index.md`と画像を含んだ**フォルダを直接指定**することもできます(zipを解凍したフォルダをそのまま指定できます)。

```
unzip ./examples/20260126.zip -d ./examples/
possg import ./examples/20260126
```

### 7. サンプル記事の確認

ブラウザで、`http://localhost:3550/staging/` にアクセスしてみてください。(`.env` に指定した id / pass の入力が必要)    

記事1つだけのリンクが表示されたインデックスページが表示されているはずです。

### 8. サンプル記事の修正や追加

`/examples/20260126.zip` を解凍すると、`index.md` が含まれています。    
こちらを修正後、再度 zip 圧縮するか、フォルダのまま再度 import すれば記事の書き換えができます。    

また、フォルダやzipをコピーしてリネームし(zipの場合はファイル名、フォルダの場合はフォルダ名がkeyになります)、`index.md` を書き換えた後に import すれば別の記事を追加できます。    

### 9. 記事の公開・非公開

`import` した記事は下書き(staging)状態です。公開するには:

```
possg publish 20260126
```

公開を取り消して下書きに戻すには:

```
possg unpublish 20260126
```

### 10. 記事の削除

import した記事の削除を行う場合は、下記コマンドでOK
さきほど import した `20260126.zip` の記事を削除する場合、`.zip` を除いたファイル名(またはフォルダ名) `20260126` を指定します。

```
possg remove 20260126
```

### 11. テンプレート修正後の記事再生成

テンプレートを修正した後などで import 済みの全ての HTML を再生成するには下記コマンドを実行します。    

```
possg buildall
```

## タグ機能

記事のfrontmatterに`tags`を指定すると、タグごとに絞り込まれた記事一覧ページが自動生成されます。

```yaml
---
title: 記事タイトル
datetime: "20260101 12:00"
tags: ["グルメ", "横浜"]
---
```

利用するには`config.mjs`の`frontmatter.meta`に`tags`のスキーマ定義が必要です(`config.example.mjs`に定義例あり)。定義していないアプリではタグ機能自体が生成されません。

## シンタックスハイライト

記事本文のコードブロックで言語を指定すると、自動的に色付けされます。

````markdown
```javascript
const hello = () => console.log("hi");
```
````

## 記事プレビュー(genviewer)

`import`する前のzipファイルまたはフォルダの記事を、実際のテンプレート・スタイルでどう表示されるか確認したい場合は`genviewer`を使います。

```
possg genviewer
```

を実行すると、ワークディレクトリ直下に`viewer.html`が生成されます。これをブラウザで開き(ダブルクリックで`file:///`として開いても、Webサーバでホスティングしても動作します)、zipファイルまたはフォルダをドラッグ&ドロップすると、その場でレンダリング結果がプレビューされます。「リロード」ボタンで直前にドロップした内容の更新を再読み込みできます(Chromium系ブラウザのみ)。フォルダをドロップした場合は特に便利で、「リロード」を押すたびにディスク上のフォルダを毎回スキャンし直すため、`index.md`や画像を編集した内容がzip再圧縮の手間無しでそのまま反映されます。

**注意**: テンプレートがApacheのSSI(`<!--#include virtual="...">`)を使っている場合、SSI部分は`fetch()`で解決するため、`file:///`として開くとブラウザのfetch制限によりSSI部分だけ解決されません(それ以外は問題なく動作します)。SSIを使うテンプレートで完全に動作確認したい場合は、`viewer.html`をWebサーバでホスティングしてアクセスしてください。

SSIを含めて`file:///`・オフラインでも完全に動作するバージョンが必要な場合は、下記を実行します。

```
possg genviewer -static
```

これは別ファイル`viewer-static.html`を生成します。SSIの内容を閲覧時にfetchするのではなく、生成時に一度だけ解決して埋め込みます(必要な`customfunc.mjs`の設定とトレードオフについては[possg-coreのREADME](https://github.com/tadfmac/possg-core/blob/main/README-JP.md#genviewer記事プレビュー)を参照してください)。

テンプレートが外部CDNライブラリ(jQuery/カルーセルライブラリ等)に依存している場合の対応方法は、[possg-coreのREADME](https://github.com/tadfmac/possg-core/blob/main/README-JP.md#genviewer記事プレビュー)を参照してください(`customfunc.mjs`側で設定します)。通常モード(非static)ではSSIは自動検出されるため設定不要です。

## 記事エディタ(geneditor)

```
possg geneditor
```

`genviewer`と同じレンダリングエンジンを使ったライブプレビュー付きの自己完結型記事エディタ(CodeMirror 6ベース)`editor.html`を生成します。初期表示のYAML frontmatterは汎用テンプレートではなくアプリの`frontmatter`スキーマから生成され、アップロード・ドロップした画像はその場でプレビューに反映され、既存のzip/フォルダ記事をドラッグ&ドロップして編集用に読み込むこともできます。「名前を付けて保存」ボタンで保存先のフォルダ・ZIPファイルを選べ(Chromium系ブラウザ限定)、保存先が決まった後(既存記事の読み込み時、または「名前を付けて保存」実行後)は「保存」ボタンで同じ場所に素早く上書き保存できます。「ZIPをダウンロード」は保存先を選ばないシンプルな代替手段として常に利用できます。インターフェースの初期値は英語で、歯車メニューから日本語に切り替えられます(`localStorage`に記憶されます)。`genviewer -static`と同じSSI/`file:///`のトレードオフを持つ`possg geneditor -static`も利用できます。`-title <title>`でページタイトル・ヘッダ表示テキストを差し替えられます。詳細は[possg-coreのREADME](https://github.com/tadfmac/possg-core/blob/main/README-JP.md#geneditor記事エディタ)を参照してください。

## バージョン確認

```
possg version
```

`possg` / `possg-core` それぞれの現在のバージョンを表示します。

## LICENSE

MIT
