SITE=localhost
cd /var/www/${SITE}/repository;

export NODE_OPTIONS="--max-old-space-size=8192";

npm run build;

echo "Copiando pasta do build para ../httpdocs_new";
cp -R /var/www/${SITE}/repository/build /var/www/${SITE}/httpdocs_new;
cp /var/www/${SITE}/repository/.htaccess /var/www/${SITE}/httpdocs_new/.;

echo "Removendo ../httpdocs_old";
rm -rf /var/www/${SITE}/httpdocs_old;

echo "Criando um backup da versão atual de ../httpdocs para ../httpdocs_old";
mv /var/www/${SITE}/httpdocs /var/www/${SITE}/httpdocs_old;

echo "Movendo ../httpdocs_new para ../httpdocs";
mv /var/www/${SITE}/httpdocs_new /var/www/${SITE}/httpdocs;

echo "Build terminado, teste em (https://${SITE})";
