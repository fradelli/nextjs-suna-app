---
title: Plano de adoção do Fradelli Design System
doc-type: frontend-plan
role: proposal
status: implementado-localmente
date: 2026-10-19
scope: frontend, visual-system, migration
---

# Adoção do Fradelli Design System no Sandicts

## 1. Decisão proposta e limites

Adotar `@fradelli/ui@0.5.0` como fonte dos tokens e componentes compartilhados,
com Inter, tema escuro, primária amarela e materiais do portfólio. Preservar
conteúdo, marca, layouts responsivos, contratos, permissões e integrações do
Sandicts. O usuário autorizou a implementação em 19/10/2026 após a entrega deste plano.
O diagnóstico abaixo preserva a investigação inicial. O contrato atual está em
`sandicts-mvp-visual-system.md`; validações e limites da execução estão em
`sandicts-fradelli-design-system-adoption-report.md`. A autorização cobre a
implementação local; publicação e operações de entrega Git continuam pendentes.

O destino é `fradelli/reactjs-sandicts-web`, em `apps/reactjs-sandicts-web` no
workspace Sandicts. Caminhos sem prefixo neste documento são relativos a esse
repositório. O remote foi conferido; o HEAD observado foi `3c07161`.
O checkout estava sem diferenças no início. O repositório `sandicts-docs`
também estava sem diferenças. As referências externas foram somente lidas.

Fontes de governança consultadas: `AGENTS.md` do workspace;
`fradelli/sandicts-docs:docs/engineering/code-semantics.md`;
`docs/ai/project-context.md`; `docs/ai/task-finalization-workflow.md`;
`docs/frontend/sandicts-frontend-tech-decisions.md`;
`docs/frontend/sandicts-react-component-structure.md`;
`docs/frontend/sandicts-mobile-navigation.md`; `.github/workflows/ci-pr.yml`.
A documentação frontend pertence a este repositório, conforme `docs/README.md`.

## 2. Evidências e diagnóstico

### Sandicts

| Área                 | Evidência atual                                                                                              | Consequência para a migração                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Stack                | `package.json`: Next 16.2.11, React/DOM 19.2.7, TS 6.0.3, Tailwind 4.3.0, next-intl 4.13.1                   | App Router; preservar Server Components e limites client                                          |
| Componentes          | shadcn 4.15.0, Radix 1.6.0, CVA, clsx, tailwind-merge, Phosphor                                              | Não há dependência de `@fradelli/ui` hoje; remover concorrência após migrar consumidores          |
| Estado e formulários | TanStack Query 5, RHF 7, Zod 4, Orval 8                                                                      | DS não substitui essas responsabilidades                                                          |
| Fontes               | `src/app/layout.tsx`: IBM Plex Sans e Montserrat; `globals.css`: Roboto local                                | Inter para interface e títulos; Roboto só poderá permanecer na arte/wordmark da marca             |
| Tema                 | `src/app/globals.css`: blocos light/dark locais, `@theme inline`, raio 0.45rem                               | Remover fundação duplicada e aliases incompatíveis; root já força dark                            |
| Marca invade UI      | `src/config/brand.ts` e `src/app/brand-variants.generated.css` definem primary, ring e sidebar além de brand | Desacoplar arte de produto da identidade compartilhada; não permitir que gerador sobrescreva o DS |
| Vidro                | Shells usam `bg-sidebar/80`, `backdrop-blur-2xl`; barra inferior usa saturação e sombras locais              | Substituir fórmula por superfície pública; manter posicionamento e safe areas                     |
| Card                 | `src/components/ui/card/card.styles.ts`: padding vertical na raiz e horizontal nos slots, footer próprio     | Migração estrutural de espaçamento, não simples troca de import                                   |
| Duplicação           | Dez diretórios em `src/components/ui`; LoadingRegion, PendingButton e StatusBadge locais                     | Todos têm equivalentes públicos; retirar implementações após adaptação                            |
| Idiomas              | `src/i18n/config.ts`: somente `pt-BR`                                                                        | Não criar inglês nesta migração; testar textos longos e manter next-intl                          |
| Geração              | `scripts/sync-visual-system.mjs` extrai tokens de globals e injeta fontes antigas em HTMLs                   | Alterar a origem da geração antes de remover o bloco antigo                                       |
| Scaffolding          | `components.json`: radix-nova, stone; `ui:add` e `ui:info`                                                   | Desativar caminho que recriaria primitives locais e tema anterior                                 |
| Runtime              | `.nvmrc` fixa 24.16.0; DS requer >=24.20.0 <25; runtime da análise 24.20.0/npm 11.19.0                       | Alinhar runtime do repositório/CI antes da instalação futura                                      |

### Portfólio e pacote

Referências locais, identificadas por repositório para não versionar caminhos
pessoais: `dev-lucas-lima-web` e `design-system`.

- `dev-lucas-lima-web:package.json` fixa `@fradelli/ui` em `0.5.0`.
- `dev-lucas-lima-web:src/app/globals.css` importa Tailwind, CSS público do
  pacote e declara `@source '../../node_modules/@fradelli/ui/dist'`.
- `dev-lucas-lima-web:src/app/layout.tsx` carrega Inter via `next/font/google`,
  `display: swap`, variável `--font-inter`.
- `src/app/portfolio-theme.css` do portfólio só conserva composição específica:
  compensação de âncora e título hero fluido. Seu título gigante não é um papel
  tipográfico obrigatório para formulários ou shells do Sandicts.
- `src/components/shared/animated-card/` compõe o Card público com deslocamento
  e escala no hover. O movimento pertence ao wrapper do portfólio; não é
  comportamento inerente do Card nem indicação de que todo card seja clicável.
- `design-system:package.json`, `src/index.ts`, `dist/components/*/index.d.ts`,
  `src/styles/styles.css`, `src/styles/tokens.generated.css` e
  `docs/governance/glass-migration.md` foram consultados. O entrypoint raiz é
  vazio: importar componentes por subpaths públicos, nunca por `src` ou `dist`.
- Peers do pacote: React/DOM >=19.2.7 <20; Tailwind >=4.3.0 <5 opcional.
  As versões declaradas do frontend atendem aos peers. Isso não comprova build
  integrado, que deverá ser validado na implementação.

### Comparação publicada: o que foi observado

Em 19/10/2026, foram abertos o [portfólio](https://devlucaslima.com/) e o
[Storybook](https://fradelli.github.io/design-system/). No portfólio foram
observados hero, navegação, seção de projetos e formulário de contato: fundo
escuro estrelado, amarelo em ações, cards de borda discreta, badges semânticos
e texto claro. A navegação por âncoras levou a `#products` e `#contact`; a
troca PT → EN apresentou estado temporariamente desabilitado e depois conteúdo
em inglês. Nenhum formulário foi enviado.

A story [Card/Surfaces](https://fradelli.github.io/design-system/?path=/story/components-card--surfaces)
exibiu glass e solid com composição equivalente, CTA amarelo e variante
secundária. O catálogo oferece stories de densidade, contratos de layout,
materiais, foco e movimento. A leitura de código complementou a inspeção
publicada para hover, redução de movimento, parallax e ciclos de vida.

Limites da evidência: não foi feito teste exaustivo do site publicado em mobile,
leitor de tela ou todos os estados. Não foi executada nem alterada a aplicação
Sandicts nesta análise; seu inventário foi inspecionado pelo código. Não se
afirma paridade visual medida, ausência de problemas de acessibilidade ou
correspondência do deploy a um SHA específico. Esses são gates da execução.

### Acesso privado

A consulta somente de metadados `npm view @fradelli/ui@0.5.0 version
--registry=https://npm.pkg.github.com`, a partir do frontend e com a configuração
existente, retornou `0.5.0`. Credenciais não foram abertas nem registradas.
`npm config get @fradelli:registry` retornou `undefined`: o acesso explícito ao
registry funciona, mas o roteamento automático do escopo ainda precisa ser
configurado no projeto. Isso não prova download do tarball nem acesso no CI
ou na Vercel. Não houve instalação ou alteração de lockfile.

## 3. Contrato visual de destino

Usar os valores pelo pacote, sem copiar os literais abaixo para a aplicação.
Os valores servem para comparação objetiva com a referência 0.5.0.

| Papel                | Contrato público / referência                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Fundo                | `--fd-color-background`, #0b0b0c                                                                                                          |
| Superfície / elevada | `--fd-color-surface` #141416; `--fd-color-surface-elevated` #1c1c1f                                                                       |
| Texto / secundário   | `--fd-color-foreground` #f4f4f5; `--fd-color-muted-foreground` #9b9ba3                                                                    |
| Primária             | `--fd-color-primary` #f2cf63; foreground próprio do pacote                                                                                |
| Semântica            | `--fd-color-status-{success,warning,info,destructive}-*`; não trocar aviso por primária apenas porque ambos usam amarelo                  |
| Marca                | `--fd-color-brand` do pacote é vermelho; não confundir com primária ou aplicar automaticamente ao logo Sandicts                           |
| Glass                | `fd-surface-glass`: 80%, blur 12px, borda e sombra públicas                                                                               |
| Glass elevada        | `fd-surface-glass-elevated`: 94%, blur 12px; overlays e chrome quando necessário                                                          |
| Papéis               | `fd-text-display` 32/40; `fd-text-section` 24/32; `fd-text-card` 20/28; `fd-text-body` 16/24; `fd-text-interface` e `fd-text-label` 14/20 |
| Card                 | default: padding raiz 24px/gap 16px; sm: padding raiz 16px/gap 12px; slots sem padding lateral adicional                                  |
| Geometria            | Raios e espaçamentos `--fd-radius-*` / `--fd-space-*`; glass e solid têm a mesma geometria                                                |
| Interação            | Variantes públicas de controles, foco gerenciado pelo pacote, redução de movimento; sem segundo ring no wrapper                           |

Superfícies públicas não fornecem por si só raio, largura de borda, padding ou
hover. Usar Card para cards; em chrome, compor geometria com tokens públicos.
Não reconstituir misturas de cor, sombra e blur. Não converter Card em botão:
ações reais usam link ou botão com nome acessível e sem controles aninhados.

Substituir aliases legados como `bg-card`, `bg-sidebar`, `text-destructive` e
`ring-ring` por papéis públicos. Se necessários entre etapas, aliases devem
apenas referenciar tokens públicos, ter consumidores enumerados e prazo de
remoção na etapa final; nunca manter outra paleta paralela.

## 4. Mapeamento de componentes

| Implementação atual                                                    | Destino público / decisão                             | Cuidados                                                                                                     |
| ---------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/components/ui/button/`                                            | `@fradelli/ui/button`                                 | `asChild` com um único Next Link; preservar ref, type, disabled e handlers; botão textual pode quebrar linha |
| `src/components/ui/card/`                                              | `@fradelli/ui/card`                                   | Rever todos os `p-0`, `py-0`, `gap-0`, padding de slots, footer e mídia; não manter compensações antigas     |
| `src/components/ui/alert/`                                             | `@fradelli/ui/alert`                                  | Preservar anúncios; AlertAction tem linha própria                                                            |
| `src/components/ui/badge/`                                             | `@fradelli/ui/badge`                                  | Mapear variantes e semântica, sem usar só cor para estado                                                    |
| `src/components/ui/field/`                                             | `@fradelli/ui/field`                                  | Preservar htmlFor, ids, aria-describedby/invalid e erros RHF                                                 |
| `src/components/ui/input/`                                             | `@fradelli/ui/input`                                  | Preservar registro/ref/valor/autocomplete; fundo elevado do pacote                                           |
| `src/components/ui/label/`                                             | `@fradelli/ui/label`                                  | Associação explícita ao controle                                                                             |
| `src/components/ui/separator/`                                         | `@fradelli/ui/separator`                              | Conferir orientação e semântica decorativa                                                                   |
| `src/components/ui/sheet/`                                             | `@fradelli/ui/sheet`                                  | Radix → dialog nativo; foco, Escape, backdrop, scroll, closeLabel e safe area                                |
| `src/components/ui/skeleton/`                                          | `@fradelli/ui/skeleton`                               | Preservar dimensões da composição e preferências de movimento                                                |
| `src/components/shared/pending-button/`                                | `@fradelli/ui/pending-button`                         | Mesmos pending/pendingLabel; não permite asChild; largura contempla dois estados                             |
| `src/components/shared/loading-region/`                                | `@fradelli/ui/loading-region`                         | Preservar anúncio único e label localizado                                                                   |
| `src/components/shared/status-badge/`                                  | `@fradelli/ui/status-badge`                           | Manter label/tone/Icon; confirmar seletores de teste que dependem de data attributes locais                  |
| `src/lib/utils.ts`                                                     | `@fradelli/ui/cn`                                     | Remover duplicação do helper se não houver outra responsabilidade; atualizar imports                         |
| `app-shell/navigation/app-shell-navigation.tsx`                        | Composição local + `NavigationItem`                   | O pacote é um link; rotas, grupos, ícones, breakpoints, aria-current e permissões continuam locais           |
| `app-shell/account/account-menu.tsx`                                   | Composição local + `Popover` e `PendingButton`        | Logout, erros e identidade continuam locais; não transformar menu de conta em nova navegação                 |
| `app-shell/context/context-switcher.tsx`                               | Composição local + `Sheet`/links públicos             | Preservar agrupamento, contexto atual e destinos; nenhum novo contexto                                       |
| `features/prototypes/.../components/exit-confirmation-dialog.tsx`      | Composição local + exports nomeados de `alert-dialog` | API não é o namespace Radix; preservar confirmação, ação segura e retorno de foco                            |
| `features/prototypes/.../components/selection-card-radio-group.tsx`    | Composição de opções local + `RadioGroup`             | Preservar required, FormData, setas, seleção e mensagens; foco em item visível inválido                      |
| `features/prototypes/.../components/sport-catalog-search.tsx`          | Busca local + `Input`, `Popover`, `Sheet`             | Não existe combobox completo público; manter filtro, lista, activeIndex e seleção                            |
| `features/prototypes/.../components/prototype-scenario-controller.tsx` | Manter select nativo local                            | Sem Select público; adaptar tokens/foco sem acrescentar dependência                                          |
| `page-state/`, `area-placeholder/`, `app-shell/content/`               | Manter composição local                               | Conteúdo, headingLevel, ações e anúncios têm responsabilidade real                                           |
| `shared/brand/`, `src/lib/brand/`, `src/config/brand.ts`               | Manter identidade e arte                              | Retirar apenas sobrescrita de tema compartilhado                                                             |
| Google sign-in e One Tap                                               | Manter SDK e hosts locais                             | Não imitar nem substituir botão controlado pelo Google; harmonizar entorno                                   |

Os caminhos `app-shell/...` na tabela ficam sob `src/components/shared/`;
`features/prototypes/...` abrevia `src/features/prototypes/player-profile-onboarding/`.
Não introduzir wrappers locais que apenas repitam a API do pacote como solução
permanente. Adaptadores temporários devem ser removidos com seus consumidores
no fechamento da sequência.

O pacote também exporta `switch` e `icons`; não foi identificado consumidor de
Switch no runtime Sandicts. O subpath de ícones é limitado, não substitui todo
o catálogo Phosphor já usado. Não remover Phosphor por presunção.
Não foram encontrados DataTable, toast provider, DropdownMenu ou Dialog genérico
implementados no runtime. Existem listas, alertas inline, Sheet, Popover e
AlertDialog. Calendários, pagamentos e listas operacionais ainda são placeholders;
não criar componentes ou notificações para preencher essa lacuna de produto.

## 5. Cobertura de rotas e proposta por tela

Todos os `page.tsx` existentes foram lidos. Prefixos de grupos do App Router
não fazem parte da URL. Organização usa o segmento real `organizationSlug`.

| URL                                                        | Estado real                                               | Proposta visual e preservação                                                                                                |
| ---------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                        | `features/public-home/`, conteúdo e links de apresentação | Hero com Inter e hierarquia pública, cards glass e ações amarelas; manter destinos e conteúdo; signals internos solid        |
| `/discovery`                                               | `AreaPlaceholder`                                         | Mesmo Card/estado do restante do produto; não inventar busca ou resultados                                                   |
| `/sign-in`                                                 | Autenticação Google e magic link                          | Painel glass, campos e avisos públicos, região de métodos organizada; preservar beta, validação, pendência, reenvio e sessão |
| `/sign-in/magic-link`                                      | Callback integrado                                        | Card central sem padding duplicado; estados legíveis e mesmos encaminhamentos                                                |
| `/privacy`                                                 | Texto legal implementado                                  | Coluna editorial solid, body 16/24, títulos section/display, listas e links legíveis; não alterar texto, versão ou metadata  |
| `/player`                                                  | Redirect para `/app`                                      | Nenhuma nova tela; manter redirect e metadata                                                                                |
| `/app`                                                     | `ShellPagePlaceholder`                                    | Shell Player + estado com superfície compartilhada                                                                           |
| `/app/courts`                                              | `ShellPagePlaceholder`                                    | Mesmo tratamento; preservar destino Quadras                                                                                  |
| `/app/reservations`                                        | `ShellPagePlaceholder`                                    | Mesmo tratamento; sem criar reserva                                                                                          |
| `/app/open-matches`                                        | `ShellPagePlaceholder`                                    | Mesmo tratamento; sem criar partida                                                                                          |
| `/app/profile`                                             | `ShellPagePlaceholder`                                    | Mesmo tratamento; não promover protótipo a perfil integrado                                                                  |
| `/organizations/[organizationSlug]`                        | Dashboard placeholder                                     | Shell operacional + estado; não inventar indicadores                                                                         |
| `/organizations/[organizationSlug]/calendar`               | Placeholder                                               | Preservar hierarquia e slug; sem calendário funcional novo                                                                   |
| `/organizations/[organizationSlug]/calendar/configuration` | Placeholder                                               | Preservar destaque de item/rota e acesso; sem regra de disponibilidade nova                                                  |
| `/organizations/[organizationSlug]/courts`                 | Placeholder                                               | Estado consistente; sem cadastro novo                                                                                        |
| `/organizations/[organizationSlug]/reservations`           | Placeholder                                               | Estado consistente; sem alteração de reserva                                                                                 |
| `/organizations/[organizationSlug]/payments`               | Placeholder                                               | Estado consistente; sem integração financeira nova                                                                           |
| `/organizations/[organizationSlug]/profile`                | Placeholder                                               | Estado consistente; sem perfil integrado novo                                                                                |
| `/prototypes/player-profile-onboarding`                    | Protótipo React com cenários simulados                    | Migrar formulário, radios, busca, confirmação e estados; preservar simulação e noindex                                       |
| `/prototypes/brand`                                        | Galeria interna da marca                                  | Migrar moldura/interface, manter exemplos de arte e variantes explicitamente identificados                                   |
| URL não encontrada                                         | `src/app/not-found.tsx` → feature                         | Mesmo estado/tipografia e links existentes                                                                                   |

Também cobrir `src/app/(public)/sign-in/loading.tsx` e estados do
`features/auth/protected-route/protected-route-boundary.tsx`. Não há fundamento
para criar novas páginas de erro, loading ou rotas de Academy/Admin nesta migração.

Shell público: header compacto com material público. Shell Player: manter cinco
destinos em bottom bar abaixo de 48rem, rail de 48 a 64rem, sidebar acima disso.
Shell Organization: manter drawer compacto e rail/sidebar; conservar hierarquia.
Topbar, menu de conta e seletor de contexto usam elevada; navegação preserva
safe areas, skip link, ordem de foco e espaço reservado no conteúdo. Não aplicar
zoom/elevação em hover a blocos densos ou navegação fixa. Hover de cards de ação
pode usar movimento discreto apenas com pointer preciso e motion permitido.

Os protótipos HTML em `docs/frontend/prototypes/{app-shells,auth-sign-in,
auth-magic-link,global-states}` também são consumidores ativos do sistema visual.
Atualizar seus estilos e geração como parte deste plano, preservando cenários.
`player-profile-onboarding` e `player-profile-selectors` contêm orientação que
deve acompanhar o protótipo React. Nenhum cenário simulado comprova integração.

## 6. Inventário de estilos: remover, substituir e manter

| Arquivos/família existentes                                                                    | Ação futura e justificativa                                                                                                                              |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                                                                          | Remover paletas duplicadas, escalas próprias e imports shadcn; importar CSS público uma vez + source de dist; manter apenas base/layout local necessário |
| Dez `src/components/ui/*/*.styles.ts`                                                          | Remover junto às implementações correspondentes, após atualizar consumidores/testes                                                                      |
| `shared/{pending-button,status-badge,loading-region}/*.styles.ts`                              | Remover após substituição pelos exports públicos                                                                                                         |
| `shared/app-shell/{public,player,organization}/*.styles.ts`                                    | Substituir materiais, bordas/sombras e cores; manter grids, larguras, posição sticky e breakpoints                                                       |
| `shared/app-shell/navigation/app-shell-navigation.styles.ts`                                   | Retirar ring/sombra/estado ativo concorrentes; manter apresentação bottom/rail/drawer, safe area e organização de grupos                                 |
| `shared/app-shell/{account,context}/*.styles.ts`                                               | Trocar paleta, superfície, foco e tipografia; manter largura, quebra de identidade e layout de opções                                                    |
| `shared/{page-state,area-placeholder}/*.styles.ts`                                             | Manter layout/ações e mapear papéis de texto/tons ao pacote                                                                                              |
| `features/public-home/public-home-screen.styles.ts`                                            | Trocar actionCard artesanal por composição pública; revisar statusCard root py-0, header/content p-5 e gap-0                                             |
| `features/auth/sign-in/sign-in-screen.styles.ts`                                               | Remover cardTitle text-2xl concorrente, revisar gap-0; manter colunas, host Google e dimensionamento responsivo                                          |
| `features/auth/protected-route/protected-route-boundary.styles.ts`                             | Manter composição de estado; substituir estilo compartilhado                                                                                             |
| `features/legal/privacy/privacy-policy-screen.styles.ts`                                       | Manter largura editorial, listas e scroll-margin; trocar papéis e foco local duplicado                                                                   |
| `features/not-found/not-found-screen.styles.ts`                                                | Manter composição e mapear tokens/tipografia                                                                                                             |
| `features/prototypes/player-profile-onboarding/player-profile-onboarding-prototype.styles.ts`  | Retirar bg-card/70, bg-background/70, blur próprio, radio borders/estados duplicados e overlays Radix; manter grids e layout de busca/cenários           |
| `src/app/(prototype)/prototypes/brand/page.tsx`                                                | Revisar classes inline de bordas, cards, headings e sombras; manter geometria da arte e conteúdo da galeria                                              |
| `src/config/brand.ts`, `scripts/sync-brand-system.mjs`, `src/app/brand-variants.generated.css` | Conservar fonte da arte; impedir emissão de primary/ring/sidebar que vença o DS; regenerar artefatos, nunca editar saída isoladamente                    |
| `docs/frontend/prototypes/shared/sandicts-visual-tokens.css`                                   | Substituir por artefato derivado da versão instalada, com fonte registrada e verificação determinística, sem copiar fórmulas manualmente                 |
| `scripts/sync-visual-system.mjs`                                                               | Deixar de extrair tema local e carregar fontes antigas; consumir CSS público instalado para protótipos e aliases temporários, se indispensáveis          |
| `scripts/check-visual-system-residues.mjs`, `visual-system-residue-rules.mjs` e teste          | Acrescentar proteção contra imports locais removidos, fontes antigas de UI e nova paleta/fórmula; manter exceções reais de arte, não whitelist ampla     |
| `scripts/sync-prototype-icons.mjs`, `prototype-icon-manifest.mjs`                              | Manter geração de ícones; não é duplicação de tema                                                                                                       |

Na tabela, `shared/` abrevia `src/components/shared/`. Valores de layout como
max-width, altura de host Google e safe areas não são duplicações de identidade.
Rever também JSX inline: somente auditar arquivos `.styles.ts` seria insuficiente.
Não substituir regras por regex indiscriminada ou eliminar texto/semântica de testes.

## 7. Fundo, acessibilidade e desempenho

Após a implementação inicial, o usuário determinou que o fundo estrelado é a
única característica visual do portfólio que não deve ser reproduzida. Essa
orientação substitui a proposta original de decoração nesta seção.

Manter fundo escuro uniforme pelo token público `--fd-color-background`, sem
estrelas, parallax ou meteoros. As superfícies glass/solid, tipografia, cores e
interações do pacote continuam compartilhadas. Privacidade e painéis densos
mantêm superfícies sólidas para legibilidade.

Preservar fallbacks públicos para ausência de blur/color-mix, cores forçadas,
redução de movimento e redução de transparência. Validar contraste composto,
teclado, textos longos e desempenho das telas reais. Não há evolução de fundo
estrelado do Design System prevista para o consumidor Sandicts.

Outras ausências: combobox de busca (consumidor real SportCatalogSearch) pode
motivar proposta separada se houver reutilização comprovada; por ora fica local.
Select de cenários permanece nativo. Não propor DataTable/toast/tooltip sem
consumidor real do Sandicts apenas porque existem no portfólio ou no roadmap.

## 8. Compatibilidade técnica e configurações

1. Fixar versão exata 0.5.0 e lockfile futuro. Declarar registry do escopo em
   configuração versionável sem autenticação; usar credenciais já gerenciadas
   pelos ambientes. Não copiar `.npmrc` autenticado ou tokens do portfólio.
2. Alinhar `.nvmrc` ao mínimo do pacote e conferir `engines` e CI. CI atual usa
   essa versão e só declara `contents: read`; acesso a pacote privado em todos
   os jobs de `npm ci` precisa ser preparado e verificado, inclusive permissão
   do repositório consumidor no pacote. Não basta adicionar `packages: read`
   sem autorização de acesso no registry. Repetir validação em Preview/Production
   da Vercel antes de promoção; acesso local não cobre esses ambientes.
3. Em `src/app/globals.css`: Tailwind → CSS do DS e
   `@source "../../node_modules/@fradelli/ui/dist"`. Revisar ordem de camadas:
   regras locais sem layer e aliases atuais podem vencer o pacote. Conferir
   resultado compilado, não somente a ordem textual dos imports.
4. Em `src/app/layout.tsx`: Inter/`--font-inter`, dark e fonte pública; preservar
   `lang`, SEO, metadata e estrutura de providers. Não adicionar next-themes:
   o produto já é dark e o pacote não exige provider próprio.
5. Manter `src/app/providers.tsx`, QueryProvider, AuthSessionProvider,
   GoogleOneTapHost e I18nClientProvider com as mesmas responsabilidades.
   Usar subpaths respeitando as diretivas client do pacote. Componentes estáticos
   e páginas não devem virar client por causa da migração.
6. Conferir SSR/hidratação, ids estáveis, refs e `asChild`; preservar imports
   Phosphor `/ssr` nos consumidores server. Testar dialog.showModal em navegador
   real: mocks de jsdom não comprovam top layer, foco, backdrop e scroll lock.
7. Remover Radix apenas quando não houver imports restantes, inclusive protótipo;
   remover shadcn, `ui:add`, `ui:info` e `components.json` ao encerrar substituição.
   Manter CVA/clsx/tailwind-merge/tw-animate-css apenas se restarem consumidores
   diretos comprovados. Roboto pode continuar exclusivo de wordmark; não apagar
   `public/fonts/roboto-latin-500-normal.woff` enquanto a marca o consumir.

## 9. Fluxos preservados e riscos de regressão

| Fluxo real           | Invariantes / teste necessário                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google + One Tap     | Mesmo host SDK, supressão por rota, fallback, sessão e tratamento de falhas; nenhum click automático ou chamada duplicada                                        |
| Magic link request   | RHF/Zod, erro de campo 400, rate limit 429, indisponibilidade de envio, sucesso, cooldown e reenvio iguais                                                       |
| Magic link callback  | Preservar inválido, proibido, usado, substituído, expirado, rate limit e erro; mesma aplicação de sessão e redirecionamento seguro                               |
| Rotas protegidas     | Checking, unauthenticated, expired, recoverable-error, api-unavailable e forbidden continuam distintos; não ocultar estado por decoração                         |
| Conta e logout       | Nome/email longos, pending, falha e limpeza de sessão/cache; abertura do menu não dispara logout                                                                 |
| Navegação/contexto   | URL e slug como origem, aria-current, parâmetros e retorno, rotas seguras, rail/bottom/drawer; não promover fixtures de contextos a permissões                   |
| Protótipo onboarding | Reset de nível ao mudar esporte, busca ativa, nenhum resultado, teclado, erro, simulação de save e confirmação ao sair; IDs de protótipo não viram contratos API |
| Privacidade e SEO    | Texto legal, links, canonical/noindex, metadados e arte permanecem sob responsabilidade local                                                                    |

Riscos prioritários: padding duplicado em Card; overrides que escondem o amarelo
do DS; primitivas nativas divergindo de Radix; contraste das superfícies compostas;
fonte mudando largura de rótulos; overlays sob header/One Tap; scroll mobile e
teclado virtual; import de pacote privado falhando somente no CI; scripts
reintroduzindo fontes/paleta antiga. Validar cada um na etapa correspondente.

## 10. Arquivos, sequência e PRs revisáveis

Plano único, com sequência obrigatória até remoção de resíduos. Etapas podem ter
mais de uma PR pequena, mas nenhuma deve ser promovida isoladamente como
“migração concluída”. Manter um checklist das rotas da seção 5 em todas as etapas.

| Etapa                              | Criação / alteração / remoção futura                                                                                                                                          | Saída e dependências                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 0 — Baseline                       | Criar evidências de telas/estados; registrar revisão do plano; atualizar docs de decisão após aprovação                                                                       | Capturas e comportamento atual, matriz completa; exige autorização e ticket real antes de PR                       |
| 1 — Fundação                       | Alterar package.json/lockfile, `.nvmrc`, globals/layout, brand config/gerador, workflows que instalam, documentação de setup; criar config de registry sem segredo se ausente | Peers/runtime/acesso nos ambientes e fonte/tokens públicos; revisar toda a navegação mesmo antes das trocas locais |
| 2 — Primitives e estados           | Alterar consumidores de ui, PendingButton/StatusBadge/LoadingRegion, testes e `lib/utils.ts`; remover implementações substituídas                                             | Card/form/alert coerentes; compatibilidade e espaçamentos validados; depende de 1                                  |
| 3 — Shells e overlays              | Alterar `shared/app-shell/{public,player,organization,navigation,context,account,chrome,content}` conforme consumidores; adaptar Popover/Sheet                                | Public, Player e Organization completos nas três larguras; depende de 2                                            |
| 4 — Telas reais e protótipos React | Alterar public-home, auth/sign-in, auth/protected-route, legal/privacy, not-found e prototypes/player-profile-onboarding; revisar brand page                                  | Todos os estados integrados e simulados preservados; placeholders herdando sistema; depende de 2–3                 |
| 5 — Protótipos HTML                | Alterar gerador visual, CSS HTMLs e documentos de protótipos; manter fundo escuro uniforme                                                                                    | Identidade compartilhada sem estrelas; depende de 1–4                                                              |
| 6 — Encerramento                   | Remover adaptadores/aliases temporários, gerador shadcn/config e dependências sem consumidor; atualizar residue rules/testes e guias visuais                                  | Zero duplicação compartilhada, geração idempotente e matriz completa aprovada; depende de todas                    |

Atualizar também `docs/frontend/sandicts-mvp-visual-system.md`,
`sandicts-brand-system.md`, `sandicts-frontend-tech-decisions.md`,
`sandicts-react-component-migration-map.md`, `docs/ai/project-context.md`,
READMEs e instruções locais que recomendam geração de componentes antigos.
Não criar nova estrutura vazia nem refatorar domínio junto à migração visual.
JSX renderiza; estilos definem visual; hooks estado/efeitos; utils cálculo puro;
types contratos; constants valores fixos. Preservar co-localização existente.

Fluxo futuro: branch com Jira real (`codex/KAN-...-...` ou tipo permitido), PR da
tarefa para `developer`, promoção `developer → staging → master`, conforme CI
local. Não importar fluxo `developer → main` do portfólio. Usar template
`.github/pull_request_template.md`, título `[KAN-...] tipo(escopo): resumo`,
Primary Jira correspondente e somente checks realmente executados. PRs de
promoção usam template de release, SHA, validação de preview e rollback.
Nenhum ticket, branch ou PR foi criado nesta análise.

## 11. Validação funcional e visual da execução

Matriz mínima por rota/estado existente: 320, 390, 768, 1024 e 1440px;
portrait/landscape; zoom 200% e reflow a 400%; nome/email/labels longos; teclado
virtual; scroll de documento longo. Verificar zero overflow horizontal de página,
ações sem corte, foco não coberto por bottom bar e área de toque mínima de 44px
nos controles de uso frequente. Cards não devem depender de altura fixa.

Português é o único locale suportado. Inglês é referência de robustez do
portfólio, não requisito de introdução de locale; se outro locale passar a existir
antes da execução, incluí-lo na mesma matriz. Não alterar cópia para fazer caber.

Teclado: Tab/Shift+Tab, Enter/Espaço, Escape, setas nos radios/combobox, skip link,
retorno de foco e apenas uma navegação responsiva focável. Verificar nomes,
headings, mensagens e erros associados; anúncios live sem repetição. Testar
sucesso, erro, vazio, loading, disabled, pending e indisponibilidade onde existirem,
sem inventar estados de produto. Testar motion reduzido, transparência reduzida,
atributo de opt-out, ausência de blur/color-mix e forced colors.

Comparação visual: telas com mesmos dados e largura antes/depois; componentes
comparados com portfólio/Storybook 0.5.0. Conferir estilos computados para fonte,
cores, padding dos cards, raios, sombras e foco. Animação determinística/pausada
nas capturas; teste separado de comportamento em movimento. Não aprovar snapshots
em massa sem inspeção da mudança intencional.

Comandos disponíveis (executar no frontend durante implementação):

```sh
npm run visual-system:check
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run test:e2e
git diff --check
```

`npm run quality` agrega visual-system:check, lint, typecheck e format:check.
Subchecks existentes: brand:check, visual-system:tokens:check,
visual-system:icons:check e visual-system:residues:check. Após alterar geradores,
executar sync e repetir check; segunda execução não pode produzir diferença.
Não executar format global com --write para corrigir diferenças alheias.

Priorizar testes existentes: `src/components/ui/ui-foundation.test.tsx`, testes
de shared/app-shell, auth/sign-in, protected-route, auth hooks e protótipo;
`e2e/app-shell.spec.ts`, `auth-happy-path.spec.ts`, `global-states.spec.ts`,
`visual-system.spec.ts`, `brand-system.spec.ts`, `legal-pages.spec.ts`,
`magic-link-prototype.spec.ts`, `static-prototype-icons.spec.ts` e
`seo-metadata.spec.ts`. Adaptar mocks de dialog quando necessário e acrescentar
testes de navegador para semântica real dos overlays, sem testar detalhes internos
do pacote no consumidor.

Playwright atual configura só Chromium. Mobile viewport não comprova Safari
iOS: incluir validação manual em Safari/iOS e Firefox para dialog/blur/foco,
registrando limitações reais. CI PR atual executa lint, tipos, test:ci, build,
api:check e audit; não afirmar que roda E2E ou quality integral. `api:check`
regenera o cliente e precisa da especificação acessível da branch; não mudar
contrato para satisfazer migração visual. `npm audit --audit-level=moderate`
é gate existente, não autorização para remediação de dependências não relacionada.

## 12. Critérios objetivos de aceite e reversão

- [ ] Versão exata instalada, peers/runtime e leitura do pacote funcionando em
      ambiente local, CI e preview; nenhuma credencial versionada.
- [ ] Todas as rotas da seção 5 e seus shells/estados existentes revisados, com
      evidência; placeholders continuam placeholders.
- [ ] Interface usa Inter e papéis públicos; primária e cores semânticas resolvem
      para o DS. Logo/arte não sobrescrevem tema de controles.
- [ ] Card glass/solid compartilha geometria; padding 24/16px apenas na raiz
      salvo exceção de layout justificada; slots não acumulam recuo.
- [ ] Nenhuma primitive duplicada ou alias temporário restante; exceções locais
      têm consumidor e responsabilidade registrados.
- [ ] Nenhuma fórmula local de vidro/foco/sombra compartilhada; geradores e
      scaffolding não restauram paleta, fonte ou primitives antigos.
- [ ] Fluxos da seção 9 passam sem mudança de dados, endpoints, permissões,
      redirecionamentos, timers, contratos ou conteúdo legal.
- [ ] Matriz responsiva/acessível e critérios de contraste/desempenho passam;
      fundo não recebe foco/clique nem causa hidratação divergente.
- [ ] Checks da seção 11 aplicáveis aprovados, com comandos, resultados e
      limitações registrados; produto inteiro revisado antes da promoção.

Reversão: registrar baseline e SHAs de cada etapa. Reverter código, CSS,
geradores/artefatos derivados, manifesto e lockfile como unidade; reverter etapas
dependentes em ordem inversa. Não desinstalar isoladamente o pacote deixando seus
imports. Como o Sandicts ainda não usa o DS, rollback da primeira adoção é a
versão anterior do frontend, não uma versão anterior inventada de `@fradelli/ui`.
Não há migração de dados prevista. Validar autenticação e shells após reversão.
Reverter release por PR no fluxo protegido; nunca force push ou sobrescrita de
versão publicada. O tratamento do CI/registry deve acompanhar a versão revertida.

## 13. Decisões que dependem do usuário

1. Execução local autorizada pelo usuário após a entrega do plano.
2. O usuário determinou a remoção das estrelas. O fundo deve permanecer escuro
   uniforme; a decoração do portfólio não faz parte da adoção.
3. Informar/vincular o Jira real antes das futuras branches e PRs. Não há chave
   atribuída a esta migração; referências históricas do código não são seu ticket.

Não dependem de nova decisão: preservar regras e logos, adotar Inter/paleta
compartilhada, usar solid quando leitura exigir, manter somente pt-BR e não
implementar funcionalidades que hoje são placeholders. Essas propostas seguem
o pedido e o código encontrado.

## 14. Validação desta entrega documental

Esta investigação conferiu rotas por código, contratos públicos locais, referência
publicada e metadados do pacote. Não executou instalação, build, testes funcionais,
commit, push, merge ou deploy. `npm run format:check` passou, mas ignora `docs/`;
por isso o documento também foi formatado e conferido explicitamente com
Prettier usando `--ignore-path NUL`. `git diff --check` não apontou problemas.
O status final do frontend contém apenas este novo documento. O diário local
registra a investigação separadamente. A implementação local foi autorizada posteriormente; ver relatório de execução.
