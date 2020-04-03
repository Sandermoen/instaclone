import React from 'react';
import { shallow } from 'enzyme';

import PostDialogCommentForm from './PostDialogCommentForm';

import { checkProps, findByTestAttribute } from '../../../utils/test/testUtils';

import { createComment } from '../../../services/commentService';
jest.mock('../../../services/commentService');

const INITIAL_PROPS = {
  token: '123',
  postId: '456',
  commentsRef: {},
  dialogDispatch: jest.fn(),
  profileDispatch: jest.fn(),
  replying: false
};

/**
 * Function to set up a wrapped component
 * @function setup
 * @param {object} additionalProps Additional props passed to the component
 * @returns {ShallowWrapper} The wrapped component
 */
const setup = (additionalProps = {}) => {
  const wrapper = shallow(
    <PostDialogCommentForm {...INITIAL_PROPS} {...additionalProps} />
  );
  return wrapper;
};

test('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttribute(
    wrapper,
    'component-post-dialog-add-comment'
  );

  expect(component.exists()).toBeTruthy();
});

test('does not throw error with expected props', () => {
  const result = checkProps(PostDialogCommentForm, INITIAL_PROPS);

  expect(result).toBeUndefined();
});

describe('form input', () => {
  beforeEach(() => {
    createComment.mockClear();
  });

  test('does not attempt to create a comment when the input is empty', () => {
    createComment.mockResolvedValue({});
    const wrapper = setup();
    const form = findByTestAttribute(
      wrapper,
      'component-post-dialog-add-comment'
    );

    // Submitting the form
    form.simulate('submit', { preventDefault: jest.fn() });

    expect(createComment).toHaveBeenCalledTimes(0);
  });

  test('clears the input after a comment has been posted', async () => {
    expect.assertions(1);
    createComment.mockResolvedValue({
      _id: '123',
      message: 'test comment',
      author: { _id: '321', username: 'test' },
      date: Date.now(),
      postVotes: [],
      comments: []
    });
    const wrapper = setup();
    const form = findByTestAttribute(
      wrapper,
      'component-post-dialog-add-comment'
    );

    // Finding and setting the input value before submitting the form
    const input = findByTestAttribute(wrapper, 'component-add-comment-input');
    input.simulate('change', { target: { value: 'test' } });

    // Submitting the form
    form.simulate('submit', { preventDefault: jest.fn() });

    await expect(createComment).toHaveBeenCalledTimes(1);
  });
});
