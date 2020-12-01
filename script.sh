mv .env.example .env;
yarn build;
cp .htaccess ./build;
cp -r src/images/icons/ build/static/media/;