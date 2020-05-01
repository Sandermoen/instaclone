import axios from 'axios';

/**
 * Searches for a username that is similar to the one supplied
 * @function searchUsers
 * @param {string} username The username to search for
 * @param {number} offset The number of documents to skip
 * @returns {array} Array of users that match the criteria
 */
export const searchUsers = async (username, offset = 0) => {
  try {
    const response = await axios.get(`/api/user/${username}/${offset}/search`);
    return response.data;
  } catch (err) {
    console.warn(err);
  }
};

/**
 * Verifies a user's email
 * @function verifyUser
 * @param {string} authToken A user's auth token
 * @param {string} confirmationToken The token to verify an emailk
 */
export const confirmUser = async (authToken, confirmationToken) => {
  try {
    await axios.put(
      '/api/user/confirm',
      {
        token: confirmationToken,
      },
      {
        headers: {
          authorization: authToken,
        },
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};
