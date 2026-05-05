let cachedId: string | null = null;

export const getOrSetUserId = (): string => {
  if (typeof window === 'undefined') return '';
  if (cachedId) return cachedId;

  let userId = localStorage.getItem('manna_user_id');

  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('manna_user_id', userId);
  }

  cachedId = userId;
  return userId;
};