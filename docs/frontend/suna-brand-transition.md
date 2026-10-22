---
title: Suna Brand Transition
doc-type: frontend-decision
role: source-of-truth
scope: frontend, brand, migration
---

# Transição de marca para Suna

Suna é a marca visível do produto. O rebranding desta etapa altera textos,
metadados, logo, favicon e imagens sociais sem migrar a infraestrutura que ainda
opera com o nome Sandicts.

## Referências preservadas temporariamente

- domínios e URLs `sandicts.com.br` e seus ambientes;
- nomes dos repositórios e o nome técnico do pacote npm;
- a pasta interna do cliente gerado (`generated/sandicts-api`) e seus imports,
  mantidos temporariamente para compatibilidade; a fonte do contrato passa a ser
  `openapi/suna-api.json`;
- cookies, armazenamento local, chaves de cache e identificadores de sessão;
- variáveis de ambiente e configurações de autenticação;
- aliases CSS `--sandicts-brand-*` e seletores já consumidos pelo Design System.

Essas referências não devem aparecer como marca para o usuário, mas também não
devem ser renomeadas isoladamente. Cada grupo exige uma migração compatível para
evitar quebra de domínio, sessão, cache, automação ou integração.

## Fonte dos assets

O arquivo `public/brand/suna-logo-source.png` é o logo oficial transparente,
sem lettering, recebido em 22 de outubro de 2026. O runtime e as imagens sociais
usam diretamente seus pixels; `src/lib/brand/brand-artwork.ts` registra apenas
o enquadramento transparente, sem redesenhar a geometria. O favicon é uma cópia
sincronizada da mesma fonte por meio de `npm run brand:sync`.
