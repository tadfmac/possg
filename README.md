# possg

BLOG向けのシンプルなSSGです。    
シンプルすぎて機能がだいぶ足りません。    

まだ開発中なので、いろいろ変わります！

## (開発中メモ) 初期設定

### 1. .env を作る

```
cd possg
touch .env
```

内容
```
BASIC_USER=<username>
BASIC_PASS=<password>
```

### 2. config.mjs を作る

```
cp ./config.example.mjs ./config.mjs
```

後でいろいろ書き換えてください。    

### 3. template を修正する

`/templae` 配下に下記テンプレートのサンプルが置いてあります。

- `content-template.ejs` 記事ページのテンプレート
- `index-template.ejs` インデックスページのテンプレート

適宜カスタマイズしてご利用ください。

### 4. (開発中のみの手順) possg-core へ link

本来は `npm i possg-core` としたいところですが、まだ開発中のため npm に登録されていません。    

下記サイトの手順で possg-core を導入してください。

https://github.com/tadfmac/possg-core

possg-core 導入後に下記実施します。

```
cd possg
npm link possg-core
npm link
```

### 5. (オプション) ホスティングサーバ起動

```
cd possg
npm i
npm start
```

SSGで出力するHTMLの出力先を既存のwebサーバのホスティング対象パス等に設定する場合は不要です。

## (開発中メモ) 使い方

### 確認

```
cd possg
```

ここで、
```
possg
```

と入力してみてください。

```
Usage:
  possg import <zip>
  possg publish <key>
  possg unpublish <key>
  possg remove <key>
  possg removeall
  possg buildall
```

のように表示されたら成功です。

### サンプル記事のインポート

`/example-data/20260126.zip` にサンプル記事があります。    
こちらをHTMLにしてみましょう。

```
possg import ./example-data/20260126.zip
```

これで記事ができます。

### サンプル記事の確認

ブラウザで、`http://localhost:3550/staging/` にアクセスしてみてください。(`.env` に指定した id / pass の入力が必要)    

記事1つだけのリンクが表示されたインデックスページが表示されているはずです。

### サンプル記事の修正や追加

`/example-data/20260126.zip` を解凍すると、`index.md` が含まれています。    
こちらを修正後、再度 zip 圧縮し、もう一度 import すれば記事の書き換えができます。    

また、zip解凍して出来たフォルダをコピーしてリネームし、`index.md` を書き換えた後に zip 圧縮（ファイル名がコピー元と異なる）後に import すれば別の記事を追加できます。    

### 記事の削除

import した記事の削除を行う場合は、下記コマンドでOK
さきほど import した `20260126.zip` の記事を削除する場合、`.zip` を除いたファイル名 `20260126` を指定します。

```
possg remove 20260126
```

### テンプレート修正後の記事再生成

テンプレートを修正した後などで import 済みの全ての HTML を再生成するには下記コマンドを実行します。    

```
possg buildall
```

## LICENSE

MIT



