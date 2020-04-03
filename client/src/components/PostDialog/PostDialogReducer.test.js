import { postDialogReducer, INITIAL_STATE } from './postDialogReducer';

const comment = {
  _id: '456',
  message: 'test',
  author: { _id: '123', username: 'test' },
  post: '12345',
  date: 32432432324,
  commentReplies: 0,
  commentVotes: []
};

const post = {
  _id: '12345',
  image: 'www.image.com',
  caption: 'test post',
  author: { username: 'test' },
  date: 32432432324,
  postVotes: [{ votes: [] }],
  comments: [comment],
  commentReplies: []
};

const user = { _id: '123', username: 'test' };

const seededState = {
  fetching: false,
  error: false,
  replying: false,
  data: post
};

test('throws error when an invalid action is passed', () => {
  expect(() => postDialogReducer(null, { type: 'test' }).toThrow());
});

test('returns expected state when `FETCH_POST_FAILURE` is passed', () => {
  const error = 'failed';
  const newState = postDialogReducer(INITIAL_STATE, {
    type: 'FETCH_POST_FAILURE',
    payload: error
  });

  expect(newState).toEqual({
    ...INITIAL_STATE,
    fetching: false,
    error
  });
});

test('returns expected state when `FETCH_POST_SUCCESS` is passed', () => {
  const newState = postDialogReducer(INITIAL_STATE, {
    type: 'FETCH_POST_SUCCESS',
    payload: post
  });

  expect(newState).toEqual({
    fetching: false,
    error: false,
    replying: false,
    data: post
  });
});

test('returns expected state and calls dispatch when `VOTE_POST` is passed', () => {
  const dispatchMock = jest.fn();
  const newState = postDialogReducer(seededState, {
    type: 'VOTE_POST',
    payload: {
      currentUser: user,
      postId: '321',
      dispatch: dispatchMock
    }
  });

  expect(newState).toEqual({
    fetching: false,
    error: false,
    replying: false,
    data: {
      ...post,
      postVotes: [{ votes: [{ author: user._id }] }]
    }
  });

  expect(dispatchMock).toHaveBeenCalledTimes(1);
});

test('returns expected state when `VOTE_COMMENT` is passed and comment has NOT been voted on', () => {
  const newState = postDialogReducer(seededState, {
    type: 'VOTE_COMMENT',
    payload: { commentId: '456', currentUser: user }
  });

  expect(newState).toEqual({
    ...seededState,
    data: {
      ...seededState.data,
      comments: [{ ...comment, commentVotes: [{ author: user._id }] }]
    }
  });
});

test('returns expected state when `ADD_COMMENT` is passed', () => {
  const newComment = {
    _id: '678',
    message: 'test2',
    author: user,
    post: '12345',
    date: 32432432324,
    commentReplies: 0,
    commentVotes: []
  };
  const newState = postDialogReducer(seededState, {
    type: 'ADD_COMMENT',
    payload: newComment
  });

  expect(newState).toEqual({
    ...seededState,
    data: {
      ...seededState.data,
      comments: [...seededState.data.comments, newComment]
    }
  });
});

test('returns expected state when `REMOVE_COMMENT` is passed', () => {
  const newState = postDialogReducer(seededState, {
    type: 'REMOVE_COMMENT',
    payload: comment._id
  });

  expect(newState).toEqual({
    ...seededState,
    data: { ...seededState.data, comments: [] }
  });
});

describe('COMMENT_REPLY', () => {
  let commentReply = undefined;
  beforeEach(() => {
    commentReply = {
      _id: '678',
      parentComment: comment._id,
      message: 'comment reply',
      author: user,
      commentReplyVotes: []
    };
  });

  test('returns expected state when `ADD_COMMENT_REPLY` is passed', () => {
    const newState = postDialogReducer(seededState, {
      type: 'ADD_COMMENT_REPLY',
      payload: {
        comment: commentReply,
        parentCommentId: comment._id
      }
    });

    expect(newState).toEqual({
      ...seededState,
      data: {
        ...seededState.data,
        comments: [{ ...comment, commentReplies: 1 }],
        commentReplies: [commentReply]
      }
    });
  });

  test('returns expected state when `REMOVE_COMMENT_REPLY` is passed', () => {
    const newState = postDialogReducer(
      {
        ...seededState,
        data: {
          ...seededState.data,
          commentReplies: [commentReply],
          comments: [{ ...comment, commentReplies: 1 }]
        }
      },
      {
        type: 'REMOVE_COMMENT_REPLY',
        payload: {
          commentReplyId: commentReply._id,
          parentCommentId: comment._id
        }
      }
    );

    expect(newState).toEqual({
      ...seededState,
      data: {
        ...seededState.data,
        comments: [{ ...comment, commentReplies: 0 }],
        commentReplies: []
      }
    });
  });

  test('returns expected state when `VOTE_COMMENT_REPLY` is passed', () => {
    const newState = postDialogReducer(
      {
        ...seededState,
        data: {
          ...seededState.data,
          commentReplies: [commentReply],
          comments: [{ ...comment, commentReplies: 1 }]
        }
      },
      {
        type: 'VOTE_COMMENT_REPLY',
        payload: { commentReplyId: commentReply._id, currentUser: user }
      }
    );

    expect(newState).toEqual({
      ...seededState,
      data: {
        ...seededState.data,
        comments: [{ ...comment, commentReplies: 1 }],
        commentReplies: [
          { ...commentReply, commentReplyVotes: [{ author: user._id }] }
        ]
      }
    });
  });
});

test('returns expected state when `SET_REPLYING` is passed', () => {
  const newState = postDialogReducer(seededState, {
    type: 'SET_REPLYING',
    payload: { username: user.username, commentId: comment._id }
  });

  expect(newState).toEqual({
    ...seededState,
    replying: { commentUser: user.username, commentId: comment._id }
  });
});
