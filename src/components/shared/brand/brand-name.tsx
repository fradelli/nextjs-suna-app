import type { ComponentProps } from "react";
import {
  activeBrandVariantId,
  getBrandVariant,
  type BrandVariantId,
} from "@/config/brand";
import { cn } from "@fradelli/ui/cn";

type BrandNameProps = ComponentProps<"span"> &
  Readonly<{
    variantId?: BrandVariantId;
  }>;

function BrandName({
  className,
  variantId = activeBrandVariantId,
  ...props
}: BrandNameProps) {
  const variant = getBrandVariant(variantId);

  return (
    <span
      {...props}
      className={cn(
        "font-brand text-[0.92em] leading-none font-medium tracking-[0.04em] text-foreground",
        className,
      )}
      data-brand-name=""
    >
      {variant.displayName}
    </span>
  );
}

export { BrandName };
export type { BrandNameProps };
