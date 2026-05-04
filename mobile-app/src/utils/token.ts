import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@accessToken';
const REFRESH_TOKEN_KEY = '@refreshToken';
const PROFILE_KEY = '@profile';

export const saveAuthSession = async (accessToken: string, refreshToken: string, profile?: any) => {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('Cannot save auth session: missing or invalid accessToken');
  }
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('Cannot save auth session: missing or invalid refreshToken');
  }

  try {
    const pairs: [string, string][] = [
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ];
    if (profile) {
      pairs.push([PROFILE_KEY, JSON.stringify(profile)]);
    }
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error saving auth session', error);
    throw error;
  }
};

export const loadAuthSession = async () => {
  try {
    const values = await AsyncStorage.multiGet([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PROFILE_KEY]);
    return {
      accessToken: values[0][1],
      refreshToken: values[1][1],
      profile: values[2][1] ? JSON.parse(values[2][1]) : null,
    };
  } catch (error) {
    console.error('Error loading auth session', error);
    return { accessToken: null, refreshToken: null, profile: null };
  }
};

export const clearAuthSession = async () => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PROFILE_KEY]);
  } catch (error) {
    console.error('Error clearing auth session', error);
  }
};

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};
