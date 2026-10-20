# Adoção do Fradelli Design System — execução local

Implementação autorizada pelo usuário após revisão do plano em 19/10/2026.
Repositório: `fradelli/reactjs-sandicts-web`. Portfólio e Design System foram
somente referências de leitura. A entrega foi vinculada à `KAN-230`; commit,
push, PR e merge foram autorizados pelo usuário em 20/10/2026. Deploy continua
fora desta execução.

## Resultado

- Dependência exata `@fradelli/ui@0.5.0`, registry do escopo e Node mínimo
  24.20.0. Configuração de leitura do pacote preparada nos workflows existentes.
- Inter, CSS e tokens públicos, primária amarela, estados semânticos, papéis
  tipográficos, glass/solid e foco compartilhados.
- Consumidores importam Button, Card, Field, Input, Badge, Alert, Separator,
  Sheet, Skeleton, PendingButton, LoadingRegion, StatusBadge, NavigationItem,
  Popover, AlertDialog, RadioGroup e cn por seus subpaths públicos.
- Retiradas implementações duplicadas, helper cn local, gerador de primitives,
  components.json e dependências diretas sem consumidor. Layouts e composições
  com responsabilidade de produto permanecem locais.
- Logo preservado: cores da arte usam `--sandicts-brand-*` e não alteram
  primária, foco ou navegação. Roboto é exclusivo do wordmark.
- Card possui padding na raiz; slots não acumulam padding. Os textos legais
  usam superfície sólida. Shells e overlays mantêm os modos responsivos.
- Fundo escuro uniforme. A decoração estrelada foi removida após orientação
  explícita do usuário; as demais características do design system permanecem.
- Protótipos HTML consomem CSS compilado do pacote instalado. Seus botões são
  derivados de `buttonVariants`, não de outra paleta. Aliases antigos existem
  somente no vocabulário desses arquivos estáticos, fora do runtime Next.
- Geradores e regras de resíduos impedem retorno de imports locais, fontes
  anteriores e fórmulas locais de vidro. Documentação normativa foi alinhada.

Os hooks e contratos de autenticação/API, permissões e destinos continuam com
suas responsabilidades originais. Logout usa PendingButton compartilhado;
Google permanece sob controle do SDK. As páginas operacionais continuam
placeholders; o onboarding continua protótipo com cenários simulados.

## Validação

| Verificação        | Evidência                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Instalação privada | Versão 0.5.0 instalada pela configuração existente, sem abrir ou registrar credenciais                                        |
| Testes             | 58 arquivos, 277 testes aprovados                                                                                             |
| Build              | Build Next 16.4.2 de produção aprovado; todas as rotas previstas geradas                                                      |
| Geração            | Tokens, arte e sprites em sincronismo; execução seguida de check sem diferenças                                               |
| Código             | Lint, TypeScript e formatação conferidos pelos comandos locais                                                                |
| Navegador          | Fluxos e matriz visual em Chromium no build de produção local                                                                 |
| Rotas              | 20 rotas em 320, 390, 768, 1024 e 1440px; status HTTP 200, heading visível e ausência de overflow horizontal                  |
| Componentes        | Card 24/16px e raio compartilhado; contraste dos pares semânticos; opt-out de transparência                                   |
| Interação          | Navegação compacta/rail/sidebar, login simulado, Escape e retorno de foco no drawer, ação segura e foco na confirmação nativa |
| Preferências       | Motion reduzido e cores forçadas; reflow estreito e zoom CSS de 200%                                                          |
| Protótipos HTML    | Estados de magic link, recuperação, textos longos e sprites Phosphor conferidos                                               |

Comandos da execução:

```sh
npm run quality
npm run test:ci
npm run api:check
npm run build
npm run test:e2e -- --workers=2
npm audit --audit-level=moderate
git diff --check
```

A suíte E2E é validada em dois ambientes: 27 casos de fluxos/visual sobre o
build de produção local com indexação desativada, e quatro casos de SEO público
sobre o servidor de desenvolvimento configurado pelo Playwright. A aplicação
impede, corretamente, build produtivo local com indexação habilitada. Essa
proteção não foi alterada para adaptar os testes.

Capturas da matriz são geradas em `test-results/fradelli-*.png`, ignoradas pelo
Git e recriadas a cada execução. Foram inspecionadas capturas da home, Player,
login e onboarding em larguras compactas e desktop.

Durante a validação, tipos de rotas em `.next/dev` ficaram corrompidos e houve
404 no servidor de desenvolvimento. O cache gerado foi limpo; o build de
produção e a matriz com verificação de status HTTP confirmaram as rotas reais.
Nenhuma rota ou proteção de acesso foi removida para contornar essas falhas.

## Limitações e gates de publicação

- Auditoria npm: zero ocorrências após atualização do Next para 16.4.2, dos
  pais compatíveis e de overrides transitivos restritos. Como `braces@3.0.3`
  não possui versão corrigida para GHSA-vfj7-8cjw-p6xm, o preset agregado do
  Next foi substituído pelos mesmos plugins explícitos; Core Web Vitals,
  React, hooks, TypeScript, acessibilidade e imports continuam ativos.
- O CI remoto aprovou Governance, Quality, Test, Contract e Build. Deploy não
  fez parte desta execução. O pacote deve autorizar leitura
  por este repositório; `packages: read` e configuração do registry, sozinhos,
  não comprovam essa autorização. Builds remotos da Vercel exigem configuração
  de autenticação de registry no ambiente. Nenhum segredo foi criado ou copiado.
- Safari/iOS, Firefox e leitor de tela não foram exercitados neste ambiente.
  A emulação de viewport e zoom CSS não substitui esses testes manuais.
- Não há baseline de métricas de produção para afirmar ganho ou ausência de
  regressão percentual em LCP/INP/CPU. O fundo é uniforme e não executa efeitos,
  mas a comparação quantitativa do plano permanece um gate antes de publicação.
- API/backend real e permissões remotas não foram alterados. `api:check` passou
  com Orval 8.22.0 fixado; os testes de autenticação usam os mocks existentes.

## Reversão

Reverter como unidade manifesto/lockfile, fontes, CSS, consumers, geradores,
artefatos e configuração dos workflows. Não retirar apenas a dependência deixando
imports. Não existe migração de dados. O plano original descreve a ordem inversa
das etapas. A entrega da tarefa usa `KAN-230`, com PR para `developer`; futuras
promoções para `staging` e `master` continuam em PRs separados.
