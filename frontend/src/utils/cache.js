export const isValidCache = (cacheTime) => {
  const CACHE_EXPIRY_TIME = 5 * 60 * 1000;
  const currentTime = Date.now();
  const timeElapsed = currentTime - cacheTime;
  return timeElapsed < CACHE_EXPIRY_TIME;
}