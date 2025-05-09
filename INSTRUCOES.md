# Instruções para Publicação do Dashboard Next.js

Este projeto Next.js foi desenvolvido para exibir os dados da pesquisa sobre pessoas idosas de forma interativa. Siga os passos abaixo para publicar o dashboard em plataformas como Vercel ou Netlify.

## Pré-requisitos

- Node.js e pnpm (ou npm/yarn) instalados em seu ambiente de desenvolvimento local ou no ambiente de build da plataforma de hospedagem.
- Uma conta em uma plataforma de hospedagem que suporte Next.js (ex: Vercel, Netlify).

## Estrutura do Projeto

- `/public/data.json`: Contém os dados processados da planilha, utilizados pelo dashboard.
- `/src/app/page.tsx`: Componente principal da página do dashboard.
- `/src/components/DashboardLayout.tsx`: Componente de layout do dashboard.
- `package.json`: Define as dependências e scripts do projeto.
- `next.config.js` (ou `next.config.mjs`): Configurações do Next.js (pode não existir se as configurações padrão forem usadas).

## Passos para Publicação

1.  **Instalar Dependências:**
    No terminal, navegue até a raiz do projeto (`dashboard_idoso`) e execute o comando para instalar as dependências. Se estiver usando pnpm (como configurado no ambiente de desenvolvimento):
    ```bash
    pnpm install
    ```
    Se preferir npm ou yarn:
    ```bash
    npm install
    # ou
    yarn install
    ```

2.  **Build do Projeto:**
    Após instalar as dependências, gere a versão de produção do site com o comando:
    ```bash
    pnpm build
    # ou
    npm run build
    # ou
    yarn build
    ```
    Isso criará uma pasta `.next` com os arquivos otimizados para produção.

3.  **Publicação (Deploy)**

    **Opção A: Vercel (Recomendado para Next.js)**
    - Crie uma conta ou faça login em [Vercel](https://vercel.com).
    - Conecte seu repositório Git (GitHub, GitLab, Bitbucket) onde o projeto está hospedado, ou faça upload manual dos arquivos do projeto.
    - A Vercel geralmente detecta automaticamente que é um projeto Next.js e configura o build e o deploy.
    - Comandos de build: `pnpm build` (ou o equivalente para npm/yarn).
    - Diretório de saída: `.next` (geralmente detectado automaticamente).
    - Siga as instruções na plataforma para completar o deploy.

    **Opção B: Netlify**
    - Crie uma conta ou faça login em [Netlify](https://www.netlify.com/).
    - Conecte seu repositório Git ou faça upload manual.
    - Configure as definições de build:
        - Comando de build: `pnpm build` (ou `npm run build` / `yarn build`)
        - Diretório de publicação: `.next`
    - Pode ser necessário instalar o plugin `netlify-plugin-nextjs` ou configurar redirecionamentos e funções manualmente para funcionalidades avançadas do Next.js, embora para um site estático gerado com `next export` (se fosse o caso) ou um site Next.js padrão, a configuração básica possa ser suficiente.
    - Para sites Next.js com SSR/ISR, a Netlify tem bom suporte. Verifique a documentação da Netlify para a configuração mais atualizada para Next.js.

    **Opção C: Outros Servidores (Node.js)**
    - Se for publicar em um servidor Node.js próprio:
        - Certifique-se de que o Node.js está instalado no servidor.
        - Faça upload dos arquivos do projeto (incluindo a pasta `.next` gerada pelo build e `node_modules`, ou instale as dependências no servidor).
        - Execute o comando para iniciar a aplicação em modo de produção:
          ```bash
          pnpm start
          # ou
          npm run start
          # ou
          yarn start
          ```
        - Configure um proxy reverso (como Nginx ou Apache) para direcionar o tráfego para a porta em que a aplicação Next.js está rodando (geralmente a porta 3000 por padrão).

## Considerações Adicionais

- **Variáveis de Ambiente:** Se o projeto necessitar de variáveis de ambiente, configure-as na sua plataforma de hospedagem.
- **Dados (`data.json`):** O arquivo `public/data.json` é servido estaticamente. Certifique-se de que ele está presente no build final.

Se encontrar qualquer problema, consulte a documentação oficial do Next.js e da plataforma de hospedagem escolhida.

