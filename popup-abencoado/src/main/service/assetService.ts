export const preloadAssets = (paths: string[]): void => {
  if (typeof window === 'undefined') return;

  paths.forEach((path) => {
    const img = new Image();
    img.src = path;
  });
};

export const usePreloadFolder = (assetNames: string[], folder: string) => {
  const paths = assetNames.map(name => `/assets/${folder}/${name}`);
  preloadAssets(paths);
};