import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTransition } from 'react-spring';

import Icon from '../../Icon/Icon';

const PostDialogStats = ({
  currentUser,
  post,
  setCurrentProfile,
  setPost,
  token,
  currentPostId
}) => {
  const [likedPost, setLikedPost] = useState(
    post.data.likes.includes(currentUser.username)
  );
  const ref = useRef();
  const transitions = useTransition(likedPost, null, {
    from: { transform: 'scale(1.3)' },
    enter: { transform: 'scale(1)' },
    leave: { display: 'none' },
    config: {
      mass: 1,
      tension: 500,
      friction: 20
    },
    // Prevent animating on initial render
    immediate: !ref.current
  });

  useEffect(() => {
    setLikedPost(post.data.likes.includes(currentUser.username));
  }, [post]);

  const likePost = async () => {
    try {
      const response = await axios.post(`/post/${currentPostId}/vote`, null, {
        headers: {
          authorization: token
        }
      });
      setPost(previous => ({
        ...previous,
        data: { ...previous.data, likes: response.data.likes }
      }));
      setCurrentProfile(previous => {
        const posts = [...JSON.parse(JSON.stringify(previous.data.posts))];
        const postIndex = posts.findIndex(post => post._id === currentPostId);
        posts[postIndex].likesCount = response.data.likes.length;
        return { ...previous, data: { ...previous.data, posts } };
      });
    } catch (err) {
      console.warn(err.data);
    }
  };

  return (
    <div ref={ref} className="post-dialog__stats">
      <div className="post-dialog__actions">
        {transitions.map(({ item, key, props }) =>
          item ? (
            <Icon
              style={props}
              onClick={() => likePost()}
              className="icon--button post-dialog__like color-red"
              icon="heart"
            />
          ) : (
            <Icon
              style={props}
              onClick={() => likePost()}
              className="icon--button post-dialog__like"
              icon="heart-outline"
            />
          )
        )}
        <Icon
          onClick={() => document.querySelector('.add-comment__input').focus()}
          className="icon--button"
          icon="chatbubble-outline"
        />
        <Icon className="icon--button" icon="paper-plane-outline" />
        <Icon className="icon--button" icon="bookmark-outline" />
      </div>
      <p className="heading-4">
        {post.data.likes.length === 0 ? (
          <span>
            Be the first to{' '}
            <b style={{ cursor: 'pointer' }} onClick={() => likePost()}>
              like this
            </b>
          </span>
        ) : (
          <span>
            <b>
              {post.data.likes.length}{' '}
              {post.data.likes.length === 1 ? 'like' : 'likes'}
            </b>
          </span>
        )}
      </p>
      <p className="heading-5 color-light uppercase">february 28</p>
    </div>
  );
};

export default PostDialogStats;
