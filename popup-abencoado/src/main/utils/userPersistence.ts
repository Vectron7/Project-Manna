export const getOrSetUserId = (): string => {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem('manna_user_id');

  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('manna_user_id', userId);
  }

  return userId;
};