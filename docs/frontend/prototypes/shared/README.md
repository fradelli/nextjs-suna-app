# Fundação visual dos protótipos

`sandicts-visual-tokens.css` é compilado de `@fradelli/ui/styles.css` da versão
instalada. Inclui utilitários do pacote, materiais e seus fallbacks. Não editar
a saída: executar `npm run visual-system:sync` e `npm run visual-system:check`.

`prototype-theme.css` mantém aliases de vocabulário apenas para HTML estático;
seus valores referenciam tokens públicos. Não é importado pelo runtime Next.
A marca é gerada de `src/config/brand.ts` com prefixo `--sandicts-brand-*` e não
pode sobrescrever primária/foco/navegação do DS. Inter pertence à interface;
Roboto é exclusivo do wordmark. Fontes Google têm fallback de sistema offline.

Sprites inline são gerados do manifesto Phosphor, preservando abertura via
arquivo. Não editar blocos `visual-system:icons` manualmente. Layout e cenários
continuam locais em app-shells, global-states, auth-sign-in e auth-magic-link.
