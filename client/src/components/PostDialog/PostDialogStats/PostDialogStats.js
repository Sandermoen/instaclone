import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useTransition } from 'react-spring';

import { likePost } from '../../../redux/posts/postsActions';

import Icon from '../../Icon/Icon';

const PostDialogStats = ({
  currentUser,
  post,
  setCurrentProfile,
  setPost,
  token,
  currentPostId,
  likePost
}) => {
  const [likedPost, setLikedPost] = useState(
    post.likes.includes(currentUser.username)
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
    setLikedPost(post.likes.includes(currentUser.username));
  }, [post]);
  const handleClick = async () => {
    likePost(currentPostId, token);
  };

  return (
    <div ref={ref} className="post-dialog__stats">
      <div className="post-dialog__actions">
        {transitions.map(({ item, key, props }) =>
          item ? (
            <Icon
              style={props}
              onClick={() => handleClick()}
              className="icon--button post-dialog__like color-red"
              icon="heart"
              key={key}
            />
          ) : (
            <Icon
              style={props}
              onClick={() => handleClick()}
              className="icon--button post-dialog__like"
              icon="heart-outline"
              key={key}
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
        {post.likes.length === 0 ? (
          <span>
            Be the first to{' '}
            <b style={{ cursor: 'pointer' }} onClick={() => handleClick()}>
              like this
            </b>
          </span>
        ) : (
          <span>
            <b>
              {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </b>
          </span>
        )}
      </p>
      <p className="heading-5 color-light uppercase">february 28</p>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  likePost: (postId, authToken) => dispatch(likePost(postId, authToken))
});

export default connect(null, mapDispatchToProps)(PostDialogStats);
