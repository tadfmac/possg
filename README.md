# possg

BLOG向けのシンプルなSSGです。    
シンプルすぎて機能がだいぶ足りません。    

## 導入（開発中のため暫定）

まだ開発中なので、いろいろ変わります！

### 1. core 導入

```
git clone https://github.com/tadfmac/possg-core.git
cd possg-core
npm i
npm link
cd ..
```

### 2. possg 導入

```
git clone https://github.com/tadfmac/possg.git
cd possg
npm i
npm link
cd ..
```

コマンド実行できたら成功
```
possg

Usage:
  possg init <target dir>
  possg createroute
  possg import <zip>
  possg publish <key>
  possg unpublish <key>
  possg remove <key>
  possg removeall
  possg buildall
```

### 3. 環境構築

ワークディレクトリを設定します。
任意のディレクトリ ここでは例として `work` を作成します。

```
mkdir work
cd work
possg init .
```

これで必要なファイルの一部が `work` 内に生成されます。

### 4. config.mjs を編集

タイトルなどblog用の設定を行います。
コンテンツを生成するフォルダパス等の設定を行います。

```
possg createroute
```

を実行すると `config.mjs` に設定したディレクトリを追加で生成します。

### 5. .env の生成とwebサーバ起動（オプション）

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

### 6. template を修正する

`/templae` 配下に下記テンプレートのサンプルが置いてあります。

- `content-template.ejs` 記事ページのテンプレート
- `index-template.ejs` インデックスページのテンプレート

適宜カスタマイズしてご利用ください。

### 7. サンプル記事のインポート

`/examples/20260126.zip` にサンプル記事があります。    
こちらをHTMLにしてみましょう。

```
possg import ./examples/20260126.zip
```

これで記事ができます。

### 8. サンプル記事の確認

ブラウザで、`http://localhost:3550/staging/` にアクセスしてみてください。(`.env` に指定した id / pass の入力が必要)    

記事1つだけのリンクが表示されたインデックスページが表示されているはずです。

### 9. サンプル記事の修正や追加

`/example-data/20260126.zip` を解凍すると、`index.md` が含まれています。    
こちらを修正後、再度 zip 圧縮し、もう一度 import すれば記事の書き換えができます。    

また、zip解凍して出来たフォルダをコピーしてリネームし、`index.md` を書き換えた後に zip 圧縮（ファイル名がコピー元と異なる）後に import すれば別の記事を追加できます。    

### 10. 記事の削除

import した記事の削除を行う場合は、下記コマンドでOK
さきほど import した `20260126.zip` の記事を削除する場合、`.zip` を除いたファイル名 `20260126` を指定します。

```
possg remove 20260126
```

### 11. テンプレート修正後の記事再生成

テンプレートを修正した後などで import 済みの全ての HTML を再生成するには下記コマンドを実行します。    

```
possg buildall
```

## LICENSE

MIT



