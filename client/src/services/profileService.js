import axios from 'axios';

/**
 * Fetches the profile information of a specific user
 * @function getUserProfile
 * @param {string} username Username of profile to fetch
 */
export const getUserProfile = async username => {
  try {
    const response = await axios.get(`/user/${username}`);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
