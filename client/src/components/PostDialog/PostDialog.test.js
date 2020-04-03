import React from 'react';
import { shallow } from 'enzyme';

import PostDialog from './PostDialog';

import {
  storeFactory,
  checkProps,
  findByTestAttribute
} from '../../utils/test/testUtils';

const INITIAL_PROPS = {
  postId: '456',
  username: 'test',
  profileDispatch: jest.fn()
};

/**
 * Function to set up a wrapped component
 * @function setup
 * @param {object} initialState The initial state to be used for this setup
 * @returns {ShallowWrapper} The wrapped component
 */
const setup = (
  initialState = { user: { token: '123', currentUser: { username: 'test' } } }
) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(
    <PostDialog store={store} {...INITIAL_PROPS} />
  ).dive();
  return wrapper;
};

test('renders without error', () => {
  const wrapper = setup().dive();
  const component = findByTestAttribute(wrapper, 'component-post-dialog');
  expect(component.exists()).toBeTruthy();
});

describe('redux props', () => {
  test('has token piece of state as prop', () => {
    const wrapper = setup();
    expect(wrapper.props().token).toBe('123');
  });

  test('has currentUser piece of state as prop', () => {
    const wrapper = setup();
    expect(wrapper.props().currentUser).toEqual({ username: 'test' });
  });
});

test('does not throw error with expected props', () => {
  const result = checkProps(PostDialog, INITIAL_PROPS);
  expect(result).toBeUndefined();
});
