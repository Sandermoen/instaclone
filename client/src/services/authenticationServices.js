import axios from 'axios';

/**
 * Logs a user in with the provided credentials
 * @function login
 * @param {string} usernameOrEmail The username or email to login with
 * @param {string} password A password to log in with
 * @param {string} authToken A token to be used instead of a username/email or password
 * @returns {object} The user object
 */
export const login = async (usernameOrEmail, password, authToken) => {
  try {
    const request =
      usernameOrEmail && password
        ? { data: { usernameOrEmail, password } }
        : { headers: { authorization: authToken } };
    const response = await axios('/api/auth/login', {
      method: 'POST',
      ...request,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Logs the user in or signs them up with their github account
 * @function githubLogin
 * @param {number} code Code provided by github to exchange for an access code
 * @returns {object} User object
 */
export const githubAuthentication = async (code) => {
  try {
    const response = await axios.post('/api/auth/login/github', {
      code,
      state: sessionStorage.getItem('authState'),
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Registers a user with the provided credentials
 * @param {string} email A user's email address
 * @param {string} fullName A user's full name
 * @param {string} username A user's username
 * @param {string} password A user's password
 * @returns {object} The user object
 */
export const registerUser = async (email, fullName, username, password) => {
  try {
    const response = await axios.post('/api/auth/register', {
      email,
      fullName,
      username,
      password,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Changes a users password
 * @function changePassword
 * @param {string} oldPassword The user's current password
 * @param {string} newPassword The new password
 * @param {string} authToken A user's auth token
 */
export const changePassword = async (oldPassword, newPassword, authToken) => {
  try {
    await axios.put(
      '/api/auth/password',
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          authorization: authToken,
        },
      }
    );
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};
