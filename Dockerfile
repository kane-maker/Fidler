# ベースイメージを指定
FROM node:18-alpine AS build

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# Babel のプラグインをインストール
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# アプリケーションコードをコピー
COPY . .

# Reactアプリをビルド
RUN npm run build

# 軽量なNginxイメージを使用
FROM nginx:1.25-alpine

# ビルド成果物をNginxの公開ディレクトリにコピー
COPY --from=build /app/build /usr/share/nginx/html

# Nginxのデフォルト設定を無効化（オプション）
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
