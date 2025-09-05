# Codpack

Codpack é um catálogo navegável de blocos visuais e snippets pensado para agilizar a criação de interfaces — com foco em quem trabalha com Elementor Pro e precisa explorar, visualizar e reutilizar rapidamente seções, páginas e trechos de CSS.

## O que é, em poucas palavras
- Uma vitrine rápida e responsiva de conteúdo reutilizável (Seções, Páginas, Códigos CSS e Mockups/Plugins)
- Uma experiência de navegação que prioriza descoberta: carrosséis horizontais com rolagem suave e 3 cards por vez
- Um ponto único para ver, copiar e favoritar itens que você quer reaproveitar em projetos

## Para quem foi feito
- Designers e devs que montam interfaces no dia a dia e precisam encontrar referências e blocos prontos com agilidade
- Times e agências que querem padronizar elementos visuais e CSS entre projetos
- Quem usa Elementor Pro e deseja uma base de componentes/blocos para acelerar entregas

## Problema que resolve
- Perda de tempo procurando referências, copiando estilos e reorganizando snippets dispersos
- Falta de um repositório visual centralizado de blocos e códigos prontos para reaproveitamento
- Dificuldade em “ver” rapidamente como uma seção/página ficaria sem abrir dezenas de links ou projetos antigos

## Como funciona (fluxo do usuário)
- Navegue pelas categorias no conteúdo principal: Seções, Páginas, Códigos CSS e Mockups/Plugins
- Explore os carrosséis horizontais: cada card exibe uma miniatura (thumbnail) e ações rápidas
- Ações diretas no card:
  - Visualizar: abre uma prévia/visão externa do item
  - Copiar: copia um conteúdo relevante (ex.: snippet, link, id) para a área de transferência
  - Favoritar: marca itens importantes para fácil acesso depois
- Notificações: o ícone “sino” exibe um dropdown com avisos recentes e ações “Ler tudo” e “Excluir”
- Conta: o avatar abre um menu com Perfil, Suporte e Sair

## Conteúdos exibidos
- Seções: blocos de página reutilizáveis (headers, heros, grids, CTAs etc.)
- Páginas: páginas completas para referência
- Códigos CSS: snippets prontos para estilização e utilidades
- Mockups/Plugins: artefatos de apoio ao design e à apresentação

## Decisões de experiência
- Velocidade de navegação: carrosséis com snap e rolagem suave deixam a descoberta mais natural
- Thumbnails em SVG gerados dinamicamente (data URL): dispensam imagens externas e mantêm a interface leve
- Navbar com feedback contextual: logo à esquerda; notificações e perfil à direita
- Dropdowns posicionados acima do conteúdo: evitam sobreposição com cards e mantêm a interação fluida

## Instalação e execução local
- Pré-requisitos:
  - Node.js 18+ (recomendado)
  - npm 9+ (ou pnpm/yarn)

Passos:

```bash
# 1) Instalar dependências
npm install

# 2) Rodar em desenvolvimento (HMR)
npm run dev
# Servidor em: http://localhost:5173/

# 3) Build de produção (gera ./dist)
npm run build

# 4) Pré-visualizar o build localmente
npm run preview
```

## Scripts disponíveis
- dev: inicia o servidor de desenvolvimento Vite com Svelte
- build: gera o bundle de produção em dist/
- preview: serve o build localmente para inspeção

## O que o projeto NÃO é (por enquanto)
- Um marketplace ou loja de componentes
- Um gerenciador de acesso/assinaturas (a autenticação é apenas simulada)
- Uma biblioteca de código pronta para produção (o foco aqui é a experiência e o conceito do catálogo)

## Estado atual
- Protótipo funcional de UI com navegação, carrosséis, dropdowns e ações básicas em cards
- Conteúdos de exemplo são gerados localmente; as ações de notificação e perfil usam `console.log` como placeholder

## Próximos passos (proposta)
- Integrar com uma API real para servir os itens e seus metadados
- Autenticação real (login/logout) e perfis
- Persistência de favoritos e histórico do usuário
- Ações reais em notificações (marcar como lidas e excluir)
- Página de detalhe do item (pré-visualização completa, variações, instruções de uso)
- Busca e filtros (por categoria, tag, estilo, status)
- Internacionalização e tema (claro/escuro) com toggle

## Licença e direitos autorais
Este projeto é distribuído sob licença proprietária. Todos os direitos são reservados. Você não pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar ou vender cópias deste software, no todo ou em parte, sem autorização expressa e por escrito da Codnodo Studio.

Copyright (c) 2025 Codnodo Studio. Todos os direitos reservados.
