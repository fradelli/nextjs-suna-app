# Suna Brand System

## Canonical identity

The canonical Suna symbol is the four-grain transparent PNG supplied on 22
October 2026. Production surfaces use that original raster artwork directly;
the application must not recreate, trace, recolor, or simplify its geometry.

`suna` is real text in Roboto Medium. Inter is the interface and heading font supplied through the shared design
system contract. Brand colors use `--sandicts-brand-*`; they never override
shared primary, focus or navigation tokens.

## Ownership

| Concern | Authoritative source |
| --- | --- |
| Active variant, display name, themes, static colors | `src/config/brand.ts` |
| Original mark artwork | `public/brand/suna-logo-source.png` |
| Transparent crop/view box | `src/lib/brand/brand-artwork.ts` |
| Runtime mark, name, lockups, link | `src/components/shared/brand/**` |
| Runtime/prototype CSS and application icon | `scripts/sync-brand-system.mjs` |
| Visual reference | `/prototypes/brand` |

Do not edit these generated files directly:

- `src/app/brand-variants.generated.css`
- `src/app/icon.png`
- `public/fonts/roboto-latin-500-normal.woff`
- `docs/frontend/prototypes/shared/sandicts-brand-tokens.css`

Run `npm run brand:sync` after changing brand configuration or artwork.

## Components

- `BrandMark` renders the symbol. Pass `label` when it is the only accessible
  representation of the brand.
- `BrandName` renders `suna` in Roboto.
- `BrandLockup` composes horizontal or stacked treatments.
- `BrandLink` is the accessible home link used by product shells.

When text already names the brand, keep the mark decorative. Navigation and
compact product surfaces use the flat treatment. Expressive glow is reserved
for large reference, hero, splash, or social-image surfaces.

## Size and clear-space rules

- Review the symbol at 16px and 24px; use 36px or larger for regular product
  navigation.
- Preserve at least one quarter of the mark width as clear space around an
  isolated mark.
- Do not stretch, rotate, outline, recolor, or place the symbol on a baked
  background. Its transparent outer area may be framed through the registered
  view box, without changing the original pixels.

## Adding a seasonal variant

1. Add a new entry to `brandVariants` in `src/config/brand.ts`.
2. Reuse `suna-grains` unless the campaign has approved replacement artwork.
3. If geometry changes, register it once in
   `src/lib/brand/brand-artwork.ts`.
4. Define light, dark, and static theme values.
5. Inspect the new variant at `/prototypes/brand`.
6. Run `npm run visual-system:sync`.
7. Change `activeBrandVariantId` only after product approval.

Feature screens must not be edited to activate the variant.

`celebration-fixture` is a non-product test fixture. It proves propagation and
must not be selected as the active production identity.
