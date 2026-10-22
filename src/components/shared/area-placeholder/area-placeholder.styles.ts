const areaPlaceholderStyles = {
  root: "min-h-screen px-5 py-6 text-foreground sm:px-8",
  container: "mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col",
  backButton: "mb-10 w-fit text-muted-foreground",
  content: "grid flex-1 content-center gap-8 lg:grid-cols-[1fr_320px]",
  eyebrow: "mb-4 text-sm font-medium text-primary",
  title: "fd-text-display max-w-2xl",
  description: "mt-5 max-w-xl text-lg leading-8 text-muted-foreground",
  iconCard: "flex min-h-64 items-center justify-center",
  icon: "size-16 text-status-success",
} as const;

export { areaPlaceholderStyles };
