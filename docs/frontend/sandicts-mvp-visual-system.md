---
title: Sandicts MVP Visual System
doc-type: frontend-visual-system
role: source-of-truth
canonical: docs/frontend/sandicts-mvp-visual-system.md
scope: frontend, tokens, components, accessibility
---

# Sistema visual da Suna

## Fonte de verdade

A interface utiliza `@fradelli/ui@0.5.0`, com a mesma fundação do portfólio:
tema escuro, Inter, primária amarela, cores semânticas e superfícies glass/solid.
A adoção foi autorizada em 19/10/2026. O
[plano e inventário](sandicts-fradelli-design-system-adoption-plan.md) registra
o diagnóstico anterior; o código e este documento descrevem o contrato atual.

- Importar componentes por subpaths públicos (`@fradelli/ui/button`, `/card`,
  `/field`, `/input`, `/sheet`, `/popover`, `/alert-dialog`, `/radio-group`).
  O entrypoint raiz do pacote é intencionalmente vazio.
- Importar `@fradelli/ui/styles.css` uma vez em globals; manter `@source` do
  pacote para que Tailwind compile suas classes.
- Não gerar primitives locais nem duplicar tokens, fórmulas de vidro, sombras,
  foco ou escalas tipográficas. O gerador anterior de componentes foi retirado.
- Layouts, rotas, conteúdo, integrações, i18n, arte e regras ficam no aplicativo.
  RHF/Zod e TanStack Query/Orval mantêm suas responsabilidades.

## Tipografia, materiais e geometria

O root carrega Inter e define `--font-inter`. Papéis públicos:
`fd-text-display`, `fd-text-section`, `fd-text-card`, `fd-text-body`,
`fd-text-interface` e `fd-text-label`. Roboto é exclusivo do wordmark Suna.

Usar `Card` glass por padrão; `surface="solid"` para painéis densos ou cards
internos. O Card define padding na raiz (24px default, 16px sm), slots sem
padding lateral adicional e geometria idêntica entre materiais. Não compensar
com `p-0`, margens negativas ou padding adicional nos slots.

Chrome pode usar `fd-surface-glass-elevated`; geometria e posicionamento são do
layout local. Não aninhar blur em linhas de listas. Texto legal usa superfície
sólida. Fallback sem blur/color-mix, forced colors e redução de transparência
pertencem ao pacote; `data-fd-transparency="reduce"` no html desativa vidro.

Cores e espaços vêm de `--fd-*`. Usar `bg-surface`, `bg-surface-elevated`,
`text-muted-foreground` e `text-status-success`/demais semânticas. Não confundir
`--fd-color-primary` com a cor da marca. Arte local usa os aliases técnicos
temporários `--sandicts-brand-*` e
não modifica primária, foco ou navegação do pacote.

## Componentes e comportamento

- `Button`/`PendingButton`: ações e pendência com rótulo acessível; prevenir
  submissão duplicada. Links usam `asChild` com um único Next Link.
- `Field`/`Input`: labels persistentes, refs RHF, ids e descrições/erros
  associados explicitamente. Copy e validação pertencem ao consumidor.
- `Alert`/`StatusBadge`: cor mais texto; anúncio explícito somente quando
  necessário. Nunca deduzir estado de domínio pela cor. O `Alert` 0.5.0
  posiciona título e descrição na mesma coluna, e o E2E de autenticação protege
  a separação vertical do aviso beta em 320, 390, 768 e 1440 px.
- `NavigationItem`: estilo/foco/estado ativo públicos. URL, grupos e modos
  bottom/rail/sidebar/drawer continuam no app.
- `Sheet` e `AlertDialog`: dialog nativo, título/descrição, foco seguro,
  Escape e retorno de foco; verificar em navegador real.
- `Popover`: menu da conta e busca por esporte. Manter lógica e rótulos locais.
- `RadioGroup`: teclado/seleção compartilhados, conteúdo das opções e regras
  locais. Não converter IDs de fixtures em códigos reais da API.
- `PageState`, `AreaPlaceholder` e shells são composições locais. O fundo é escuro uniforme, sem estrelas ou decoração copiada do portfólio.
- O botão Google permanece controlado pelo SDK. Não recriar sua renderização.

Busca com combobox e select de cenários permanecem locais: não há equivalente
completo público. Não acrescentar tabelas, toast ou novos fluxos onde só existem
placeholders. Componentes interativos não podem conter links/botões aninhados.

## Movimento e acessibilidade

O fundo usa a cor escura pública do pacote, sem estrelas, parallax ou meteoros,
conforme orientação explícita do usuário. Motion de controles vem do pacote e
respeita preferência de redução de movimento.

Validar contraste composto, teclado, zoom/reflow, textos longos, celular/tablet/
desktop, safe area e todos os estados existentes. O pacote controla o foco dos
controles: não somar um segundo ring no wrapper. Elementos nativos locais usam
o fallback de foco público. A única língua ativa é pt-BR.

## Common State Matrix

| State                    | Default treatment                                                     |
| ------------------------ | --------------------------------------------------------------------- |
| Initial page loading     | Skeleton shaped like the expected content; preserve layout            |
| Action loading           | Spinner or progress inside the initiating control; prevent duplicates |
| Empty                    | Shared empty-state composition with a relevant next action            |
| Success                  | Persistent updated UI plus optional inline success confirmation       |
| Field validation         | Message beside the field and invalid control treatment                |
| Business-rule error      | Message near the blocked action with a safe next step                 |
| Service or network error | Alert or error boundary with retry when retry is safe                 |
| Forbidden                | Simple explanation and safe route back to the correct context         |
| Not found                | Neutral state that does not disclose private resource existence       |
| Disabled                 | Lower emphasis while retaining readable label and state               |

Loading, error, and empty states must occupy the same structural region as the
content they replace. Avoid full-screen blocking spinners for local reads or
mutations.

## Icon Direction

Use `@phosphor-icons/react` as the interface icon set.

Rules:

- use named imports
- use `1rem` icons in compact text or controls
- use `1.25rem` icons for default controls and navigation
- use `1.5rem` icons for prominent landmarks
- use approximately `2.5rem` to `3rem` icons in empty states
- use canonical `*Icon` exports and the shared `Icon` / `IconProps` types
- use regular weight by default; fill or bold may reinforce an already visible
  selected state
- mark decorative icons with `aria-hidden="true"`
- give icon-only controls an accessible name
- pair status icons with text
- do not use a Phosphor icon as the Suna logo
- do not mix a second general-purpose icon set into MVP product UI

## Accessibility Baseline

- Meet WCAG AA contrast for text, controls, and meaningful state indicators.
- Validate text pairs at `4.5:1` and UI/focus boundaries at `3:1` whenever the
  shared package version change.
- Keep keyboard focus visible through the package focus indicator.
- Do not remove outlines without an equivalent visible focus treatment.
- Use semantic HTML before adding ARIA.
- Keep labels and error relationships programmatically discoverable.
- Do not communicate status, selection, or validation with color alone.
- Respect reduced-motion preferences.
- Keep touch targets practical on mobile.
- Ensure dialogs, menus, and popovers can be completed with a keyboard.
- Keep muted text readable; muted does not mean low contrast.

## Geração e validação

`npm run visual-system:sync` regenera arte, sprites e CSS dos protótipos a partir
do pacote instalado. `prototype-theme.css` mantém apenas aliases de vocabulário
para o HTML estático; não participa do runtime Next. Não editar CSS gerado.

Executar `npm run quality`, `npm test`, `npm run build` e `npm run test:e2e`.
Atualizar evidências e registrar limitações do ambiente; Chromium não comprova
Safari/iOS ou Firefox. Não atualizar snapshots sem revisão da mudança visual.
