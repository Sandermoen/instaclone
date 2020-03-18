import React, { useReducer, useRef } from 'react';
import { connect } from 'react-redux';

import { votePost, toggleBookmark } from '../../../redux/posts/postsActions';

import Icon from '../../Icon/Icon';
import PulsatingIcon from '../../Icon/PulsatingIcon/PulsatingIcon';

const PostDialogStats = ({
  currentUser,
  post,
  token,
  currentPostId,
  votePost,
  toggleBookmark
}) => {
  const ref = useRef();

  const INITIAL_STATE = {
    likesCount: post.likesCount,
    liked: post.likes.includes(currentUser.username)
  };

  const likesReducer = (state, action) => {
    switch (action.type) {
      case 'LIKE_POST': {
        return { likesCount: state.likesCount++, liked: true };
      }
      case 'UNLIKE_POST': {
        return { likesCount: state.likesCount--, liked: false };
      }
      default: {
        throw new Error('Invalid action type issued to likesReducer');
      }
    }
  };

  const [state, dispatch] = useReducer(likesReducer, INITIAL_STATE);

  const handleClick = async () => {
    // We want this to happen instantly since it's non-crucial data
    // We can assume that the server will respond with 200 and be fine
    state.liked
      ? dispatch({ type: 'UNLIKE_POST' })
      : dispatch({ type: 'LIKE_POST' });
    votePost(currentPostId, token);
  };

  return (
    <div ref={ref} className="post-dialog__stats">
      <div className="post-dialog__actions">
        <PulsatingIcon
          toggle={state.liked}
          elementRef={ref}
          constantProps={{ onClick: () => handleClick() }}
          toggledProps={[
            {
              className: 'icon--button post-dialog__like color-red',
              icon: 'heart'
            },
            {
              className: 'icon--button post-dialog__like',
              icon: 'heart-outline'
            }
          ]}
        />
        <Icon
          onClick={() => document.querySelector('.add-comment__input').focus()}
          className="icon--button"
          icon="chatbubble-outline"
        />
        <Icon className="icon--button" icon="paper-plane-outline" />
        <Icon
          className="icon--button"
          icon={post.bookmarked ? 'bookmark' : 'bookmark-outline'}
          onClick={() => toggleBookmark(currentPostId, token)}
        />
      </div>
      <p className="heading-4">
        {state.likesCount === 0 ? (
          <span>
            Be the first to{' '}
            <b
              style={{ cursor: 'pointer' }}
              onClick={event => {
                event.nativeEvent.stopImmediatePropagation();
                handleClick();
              }}
            >
              like this
            </b>
          </span>
        ) : (
          <span>
            <b>
              {state.likesCount} {state.likesCount === 1 ? 'like' : 'likes'}
            </b>
          </span>
        )}
      </p>
      <p className="heading-5 color-light uppercase">february 28</p>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  votePost: (postId, authToken) => dispatch(votePost(postId, authToken)),
  toggleBookmark: (postId, authToken) =>
    dispatch(toggleBookmark(postId, authToken))
});

export default connect(null, mapDispatchToProps)(PostDialogStats);
