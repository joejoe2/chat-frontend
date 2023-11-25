# deploy.sh
# !/usr/bin/env sh
# exit on error
set -e
# 打包
npm run build
cd dist
# prevent 404 when using vue-router with history mode
cp index.html 404.html
# use custom domain with github pages
echo 'frontend.joejoe2.com' > CNAME
git init
git add -A
git commit -m 'deploy'
# deploy to https://github.com/joejoe2/chat-frontend.git 分支為 gh-pages
git push -f https://github.com/joejoe2/chat-frontend.git HEAD:gh-pages
cd -