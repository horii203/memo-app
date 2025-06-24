# プロフィール管理アプリ

このプロジェクトは、React・TypeScript・Vite・Firebase を使ったシンプルなメモアプリです。  
ユーザー認証（メールアドレス・パスワード）とプロフィール登録機能を備えています。

---

## 公開 URL

[https://memo-app-7b2c8.web.app/](https://memo-app-7b2c8.web.app/)

---

## 主な機能

- Firebase Authentication によるユーザー認証
- Firestore にプロフィール情報を保存・編集・削除
- リアルタイムでプロフィール一覧の更新を反映

---

## 技術スタック

- React
- TypeScript
- Vite
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS

---

## セットアップ方法

### 1. Firebase プロジェクトを作成

- [Firebase コンソール](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
- 「Authentication」機能を有効にし、メール/パスワード認証をオンにします。
- 「Firestore Database」を作成します。

### 2. 環境変数ファイルの準備

1. プロジェクト直下にある `.env.example` ファイルを `.env` にコピーします。

2. .env ファイルに Firebase 設定情報を入力します。
   ※ 各値は Firebase コンソールの「プロジェクトの設定」→「マイアプリ」から取得できます。

### 3. 依存パッケージのインストール

```
  npm install
```

### 4. 開発サーバーの起動

```
npm run dev
```

起動後、ブラウザで http://localhost:5173 にアクセスしてください。
