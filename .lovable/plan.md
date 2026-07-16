# Prompt de Design — Painel Admin / Empresa (inspirado em mozeconomia.co.mz)

Nota: a parte de "unidades" fica de fora deste redesign, conforme pedido. O foco é 100% no visual das telas do painel administrativo da empresa.

---

## Prompt pronto para colar

> Redesenhe todo o visual do painel administrativo da empresa (área logada) usando exatamente a linguagem visual do site https://mozeconomia.co.mz/ — mesma paleta, mesma tipografia, mesmo tom, mesmo nível de acabamento. Não é para inventar um estilo novo: é para replicar fielmente a identidade Mozeconomia e adaptá-la às telas internas do nosso sistema (dashboard, faturação, produtos, clientes, relatórios, definições).
>
> **Identidade visual a replicar (Mozeconomia):**
> - Paleta: verde escuro/esmeralda (#0F5132 aprox.) como cor primária de marca e destaques ("Facturação", "Gestão"); azul-marinho quase preto (#0B1B2B) para títulos e texto principal; amarelo âmbar (#F4B740) para CTAs de destaque tipo "Teste Grátis"; branco puro e um off-white esverdeado bem claro (#F2F8F5) para fundos e bandas de topo; cinzas neutros frios para texto secundário e bordas.
> - Tipografia: sans-serif geométrica pesada e alta legibilidade (estilo Inter / Manrope / Plus Jakarta Sans), com títulos em peso 700–800 e tracking apertado, corpo em 400–500. Números e valores monetários com tabular-nums.
> - Formas: cantos arredondados generosos (rounded-2xl nos cards, rounded-full nos botões primários), sombras suaves e difusas (nada de sombra dura), muito whitespace, hierarquia clara por tamanho e peso — não por cor.
> - Ícones: linha fina consistente (Lucide), nunca coloridos por padrão, só o verde da marca em estados ativos.
> - Selos/pills: pequenos badges verdes com texto branco (tipo "ERP 100% Online", "Certificado pela AT") — usar o mesmo padrão para status internos (Pago, Pendente, Emitido, Anulado).
>
> **Aplicar às seguintes telas do painel da empresa:**
> 1. **Dashboard** — cards de KPI (faturação do dia/mês, nº de facturas, clientes activos, valor em dívida) no topo com números grandes em navy e variação percentual em verde/vermelho; gráfico principal de vendas (linha ou barras) com fill verde translúcido; lista de últimas facturas e produtos mais vendidos em dois cards lado a lado.
> 2. **Faturação** — tabela densa mas arejada, linhas altas, zebra suave, badges de estado, botão primário "Nova Factura" verde arredondado com ícone +. Modal/drawer de emissão com layout limpo em duas colunas.
> 3. **Produtos / Stock** — grid ou tabela com miniatura, nome, preço, stock; filtros no topo tipo chips.
> 4. **Clientes** — lista com avatar/inicial em círculo verde claro, nome em navy, NUIT/contacto abaixo em cinza.
> 5. **Relatórios** — cabeçalho com selector de período (chips), cards de totais, gráficos com a mesma paleta verde/navy, opção de exportar em botão secundário outline navy.
> 6. **Definições da empresa** — formulário em cartão único, labels acima dos inputs, inputs com borda cinza clara e focus ring verde, botão guardar verde à direita.
> 7. **Sidebar / Navegação** — barra lateral fixa com fundo branco (ou navy escuro na versão dark), logo da empresa no topo, itens de menu com ícone linha + label, item activo com fundo verde muito claro (#E8F3ED) e texto/ícone verde escuro, indicador lateral verde de 3px. Topbar com busca global, notificações e avatar do utilizador à direita.
>
> **Regras obrigatórias:**
> - Nenhuma cor hardcoded nos componentes — todas as cores viram tokens semânticos em `src/styles.css` (`--primary` = verde Mozeconomia, `--accent` = âmbar, `--foreground` = navy, etc.) e usadas via classes Tailwind semânticas (`bg-primary`, `text-foreground`).
> - Nada de roxo/índigo, nada de gradientes genéricos AI, nada de fontes default tipo Poppins.
> - Números monetários sempre com "MT" e formatação pt-MZ.
> - Responsivo: sidebar colapsa em mobile, tabelas viram cards.
> - Mesmo nível de polimento visual do site de referência — se parecer "template genérico", está errado.

---

## O que vou fazer quando aprovares

1. Actualizar `src/styles.css` com os tokens da paleta Mozeconomia (verde primário, navy foreground, âmbar accent, off-white esverdeado de fundo) em oklch, para light e dark.
2. Carregar a família tipográfica (Manrope ou Plus Jakarta Sans) via `<link>` no `__root.tsx` e registar em `@theme`.
3. Construir/ajustar layout do painel: sidebar + topbar + área de conteúdo, com os estados activos e espaçamentos descritos.
4. Redesenhar cada tela listada acima usando os mesmos padrões de card, tabela, badge e botão.
5. Deixar a parte de "unidades" intocada nesta iteração.

Confirma que queres avançar com esta direcção (ou diz o que ajustar antes) e eu implemento.
