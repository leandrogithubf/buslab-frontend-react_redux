Buslab v3

# Docker Configurações

## Servidor Produção ou UHML
Para rodar este projeto no servidor de produção ou UHML, utilizar o Dockerfile contido na pasta .container.

**importante:** 
- Pasta '.container': O arquivo Dockerfile uma variável ambiente chamada **$SITE**, este variável deve conter o domínio da aplicação. Ex: api.buslab.com.br;
- Pasta '.container': O arquivo Dockerfile uma variável ambiente chamada **$FOLDER**, este variável deve conter o caminho da pasta raiz até a pasta que contém o dockerfile da produção;
- Pasta '.container': Dentro da pasta docker, no arquivo **create-site.sh** possuímos duas variaéveis de ambiente, a variável $SITE deve conter o dominio da aplicação e a variável $DOMINIO_CONF deve conter o nome httpd.conf.
- Pasta '.container': Dentro da pasta docker, no arquivo **build.sh** possuímos uma variável ambiente $SITE, este deve contar o nome do domínio da aplicação.

O mesmo dito para produção se adequa para o Dockerfile de desenvolvimento.

## Servidor Localhost
Para rodar este projeto no servidor local (locahost), deve-se copiar o arquivo Dockerfile e .dockerignore contidos na pasta .container para a pasta raiz do projeto. Neste caso as variaveis ambientes estarão contidas nos arquivos .env.

Não será necessário alterar nada no Dockerfile para rodar localmente.

**importante:** O sistema está configurado para acessar o banco de dados da UHML, portanto caso vá usá-lo, deve-se ligar a VPN.

<br>

# Configurações Antigas (Digital Ocean)

#### Requisitos

-   Nodejs - (https://nodejs.org/en/)
    -   versão: v13.14.0
-   NPM - (https://nodejs.org/en/)
    -   versão: v6.14.4
-   npm install -> para instalar as dependências do projeto.
-   npm start -> para executar o projeto
-   Utilizar o prettier como formatador de prefixo padrão com os parâmetros estabelecidos no arquivo .prettierrc que se encontra na raíz do projeto - (https://prettier.io/).
