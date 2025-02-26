import crypto from 'crypto';

export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let randomString = '';
  for (let i = 0; i < length; i++) {
    // Generate a random index using crypto
    const randomIndex = crypto.randomInt(0, charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
};
