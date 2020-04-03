import {
  postDialogCommentFormReducer,
  INITIAL_STATE
} from './postDialogCommentFormReducer';

test('returns expected state when `POST_COMMENT_START` is passed', () => {
  const newState = postDialogCommentFormReducer(INITIAL_STATE, {
    type: 'POST_COMMENT_START'
  });

  expect(newState).toEqual({ ...INITIAL_STATE, posting: true });
});

test('returns expected state when `POST_COMMENT_FAILURE` is passed', () => {
  const newState = postDialogCommentFormReducer(
    {
      ...INITIAL_STATE,
      posting: true
    },
    { type: 'POST_COMMENT_FAILURE', payload: 'error' }
  );

  expect(newState).toEqual({
    ...INITIAL_STATE,
    posting: false,
    error: 'error'
  });
});

test('returns expected state and calls dispatch when `POST_COMMENT_SUCCESS` is called', () => {
  const mockDispatch = jest.fn();
  const newState = postDialogCommentFormReducer(INITIAL_STATE, {
    type: 'POST_COMMENT_SUCCESS',
    payload: { comment: 'test', dispatch: mockDispatch }
  });

  expect(newState).toEqual(INITIAL_STATE);
  expect(mockDispatch).toHaveBeenCalledTimes(1);
});

test('returns expected state and calls dispatch when `POST_COMMENT_REPLY_SUCCESS` is called', () => {
  const mockDispatch = jest.fn();
  const newState = postDialogCommentFormReducer(INITIAL_STATE, {
    type: 'POST_COMMENT_REPLY_SUCCESS',
    payload: { comment: 'test', dispatch: mockDispatch, parentCommentId: '123' }
  });

  expect(newState).toEqual(INITIAL_STATE);
  expect(mockDispatch).toHaveBeenCalledTimes(1);
});

test('returns expected state when `SET_COMMENT` is passed', () => {
  const newState = postDialogCommentFormReducer(INITIAL_STATE, {
    type: 'SET_COMMENT',
    payload: 'test comment'
  });

  expect(newState).toEqual({ ...INITIAL_STATE, comment: 'test comment' });
});

test('throws error when an invalid action is passed', () => {
  expect(() =>
    postDialogCommentFormReducer(INITIAL_STATE, { type: 'test' })
  ).toThrow();
});
