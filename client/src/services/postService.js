import axios from 'axios';

/**
 * Fetches a complete post with comments and the fully
 * sized image instead of a thumbnail image
 * @function getPost
 * @param {string} postId Id of the post to fetch
 * @returns {object} The post requested
 */
export const getPost = async postId => {
  try {
    const response = await axios.get(`/post/${postId}`);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Either likes or dislikes a post
 * @function votePost
 * @param {string} postId The id of the post to be voted on
 * @param {*} authToken The user's auth token
 */
export const votePost = async (postId, authToken) => {
  try {
    await axios.post(`/post/${postId}/vote`, null, {
      headers: { authorization: authToken }
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Sends an image and a caption as multipart/form-data and creates a post
 * @function createPost
 * @param {object} formData Multipart form data about the image being uploaded
 * @param {string} authToken The user's auth token
 */
export const createPost = async (formData, authToken) => {
  try {
    await axios.post('/post', formData, {
      headers: {
        authorization: authToken,
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};
