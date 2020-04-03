import React from 'react';
import { shallow } from 'enzyme';

import PostDialogStats from './PostDialogStats';

import {
  storeFactory,
  checkProps,
  findByTestAttribute
} from '../../../utils/test/testUtils';

const mockCurrentUser = { _id: '123', username: 'test', bookmarks: [] };

const INITIAL_PROPS = {
  post: {
    _id: '123',
    image: 'www.image.com',
    caption: 'test',
    author: { ...mockCurrentUser },
    postVotes: [{ votes: [] }],
    date: Date.now()
  },
  token: '12345',
  currentUser: mockCurrentUser,
  dispatch: jest.fn(),
  profileDispatch: jest.fn(),
  bookmarkPost: jest.fn()
};

/**
 * Function to set up a wrapped component
 * @function setup
 * @param {object} initialState The initial state to be used for this setup
 * @returns {ShallowWrapper} The wrapped component
 */
const setup = (initialState = {}, additionalProps = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(
    <PostDialogStats store={store} {...INITIAL_PROPS} {...additionalProps} />
  ).dive();
  return wrapper;
};

test('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttribute(wrapper, 'component-post-dialog-stats');

  expect(component.exists()).toBeTruthy();
});

test('does not throw error with expected props', () => {
  const result = checkProps(PostDialogStats, INITIAL_PROPS);
  expect(result).toBeUndefined();
});

test('calls dispatch when like button is clicked', () => {
  const mockDispatch = jest.fn();
  const wrapper = setup({}, { dispatch: mockDispatch });
  const likeButton = findByTestAttribute(wrapper, 'component-like-button');

  likeButton.simulate('click', {
    nativeEvent: { stopImmediatePropagation: jest.fn() }
  });
  expect(mockDispatch).toHaveBeenCalledTimes(1);
});
