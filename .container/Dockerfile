# Imagem Base Ubuntu 18.04
FROM ubuntu:18.04 as base_frontend_image

# Variaveis Ambiente
ENV NODE_ENV=production
ENV SITE=buslab-frontend.dev.marttech.com.br
ENV FOLDER=./.container
ENV REACT_APP_BASE_URL=https://bl-prd-backend.gentlemushroom-77cc66cf.brazilsouth.azurecontainerapps.io
ENV REACT_APP_SOCKET_URL=https://bl-prd-socketio.gentlemushroom-77cc66cf.brazilsouth.azurecontainerapps.io
ENV REACT_APP_SOCKET_IS_SECURE=true

# Instalando pacotes bases do Ubuntu
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y software-properties-common curl

# Configurar Timezone para America/Sao_Paulo
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Instalando Node
RUN curl -fsSL https://deb.nodesource.com/setup_13.x | bash - \
    && apt-get -y install --no-install-recommends \
    zlib1g-dev libzip-dev zip libpng-dev libicu-dev \
    wget gpg gpg-agent unzip libxml2-dev nodejs \
    && npm install --global yarn

# Instalando Apache Server
RUN apt update 
RUN apt install -y apache2 
RUN apt install -y apache2-utils 

# Instalando editor Nano
RUN apt-get update && \
    apt-get install -y nano

# Instalando GIT
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Limpando dados
RUN apt clean
RUN rm -rf /var/lib/apt/lists/*

###########################################################################################

FROM base_frontend_image as apache_frontend_image

# Inserindo apache2.conf no container
COPY --chown=www-data:www-data $FOLDER/docker/apache2.conf /etc/apache2/

# Dando permissões ao Apache
RUN chown -R www-data:www-data /etc/apache2/sites-available
RUN chown -R www-data:www-data /etc/apache2/sites-enabled

# Habilitando apache modules
RUN a2enmod deflate
RUN a2enmod headers
RUN a2enmod rewrite

# Inserindo apache2.conf no container
COPY --chown=www-data:www-data $FOLDER/docker/create-site.sh /var/www/$SITE/

# Permissao para rodar o script de criar httpd.conf
RUN chmod +x /var/www/$SITE/create-site.sh

# Script para criar o httpd.conf do apache2
RUN /bin/bash /var/www/$SITE/create-site.sh

###########################################################################################

FROM apache_frontend_image as project_frontend_image

# Pasta Raiz do Projeto
WORKDIR /var/www/$SITE/repository

# Permissão para alterar pastas
RUN chown -R www-data:www-data /var/www/$SITE/

# Copiando Projeto para dentro do container e setando permissões
COPY --chown=www-data:www-data . .

# Instala as dependências
RUN npm install --omit=dev

# Permissao para rodar o script de cria a pasta public do projeto
RUN chmod +x /var/www/$SITE/repository/$FOLDER/docker/build.sh

# Script para criar o public/ do projeto
RUN /bin/bash /var/www/$SITE/repository/$FOLDER/docker/build.sh

RUN service apache2 stop

EXPOSE 80

CMD ["/bin/bash", "-c", "apachectl -DFOREGROUND"]