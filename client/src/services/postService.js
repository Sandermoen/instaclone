import axios from 'axios';

/**
 * Fetches a complete post with comments and the fully
 * sized image instead of a thumbnail image
 * @function getPost
 * @param {string} postId Id of the post to fetch
 * @returns {object} The post requested
 */
export const getPost = async (postId) => {
  try {
    const response = await axios.get(`/api/post/${postId}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 *
 * @param {string} username A users username
 * @param {number} offset The amount of posts to skip
 */
export const getPosts = async (username, offset = 0) => {
  try {
    const response = await axios.get(`/api/user/${username}/posts/${offset}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
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
    await axios.post(`/api/post/${postId}/vote`, null, {
      headers: { authorization: authToken },
    });
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Sends an image and a caption as multipart/form-data and creates a post
 * @function createPost
 * @param {object} formData Multipart form data about the image being uploaded
 * @param {string} authToken The user's auth token
 * @returns {object} The created post
 */
export const createPost = async (formData, authToken) => {
  try {
    const post = await axios.post('/api/post', formData, {
      headers: {
        authorization: authToken,
        'Content-Type': 'multipart/form-data',
      },
    });
    return post.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Deletes a post
 * @function deletePost
 * @param {string} postId The id of the post to delete
 * @param {string} authToken A user's auth token
 */
export const deletePost = async (postId, authToken) => {
  try {
    await axios.delete(`/api/post/${postId}`, {
      headers: {
        authorization: authToken,
      },
    });
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Toggles bookmarking a post
 * @param {string} postId The id of the post to bookmark
 * @param {string} authToken A user's auth token
 * @return {object}
 */
export const bookmarkPost = async (postId, authToken) => {
  try {
    const response = await axios.post(`/api/user/${postId}/bookmark`, null, {
      headers: { authorization: authToken },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Retrieves all filters
 * @function getPostFilters
 * @returns {array} Array of filters
 */
export const getPostFilters = async () => {
  try {
    const response = await axios.get('/api/post/filters');
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Gets suggested posts
 * @function getSuggestedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The amounts of posts to skip
 * @returns {array} Array of posts
 */
export const getSuggestedPosts = async (authToken, offset = 0) => {
  try {
    const response = await axios.get('/api/post/suggested/' + offset, {
      headers: {
        authorization: authToken,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Gets posts associated with a specific hashtag
 * @function getHashtagPosts
 * @param {string} authToken A user's auth token
 * @param {string} hashtag The hashtag to find posts by
 * @param {number} offset The amount of posts to skip
 * @returns {array} Array of posts
 */
export const getHashtagPosts = async (authToken, hashtag, offset = 0) => {
  try {
    const response = await axios.get(`/api/post/hashtag/${hashtag}/${offset}`, {
      headers: {
        authorization: authToken,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};
