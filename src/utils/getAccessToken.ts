let cachedAccessToken: string | null = null;

export const getAccessToken = () => {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const userData = localStorage.getItem("K_user");
  if (!userData) {
    throw new Error("No access token found");
  }
  const user = JSON.parse(userData);
  cachedAccessToken = user.accessToken;
  return cachedAccessToken;
};
