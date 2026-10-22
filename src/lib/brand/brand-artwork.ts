type BrandArtwork = Readonly<{
  id: string;
  source: string;
  sourceHeight: number;
  sourceWidth: number;
  viewBox: string;
}>;

const brandArtworks = {
  "suna-grains": {
    id: "suna-grains",
    source: "/brand/suna-logo-source.png",
    sourceHeight: 1254,
    sourceWidth: 1254,
    viewBox: "154 177 915 1001",
  },
} as const satisfies Record<string, BrandArtwork>;

type BrandArtworkId = keyof typeof brandArtworks;

function getBrandArtwork(artworkId: BrandArtworkId) {
  return brandArtworks[artworkId];
}

export { brandArtworks, getBrandArtwork };
export type { BrandArtwork, BrandArtworkId };
