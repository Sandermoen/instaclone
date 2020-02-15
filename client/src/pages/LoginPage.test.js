import React from 'react';
import { shallow } from 'enzyme';

import LoginPage from './LoginPage';

import { findByTestAttribute } from '../utils/test/testUtils';

/**
 * Factory function that returns a wrapped component
 * @function setup
 * @returns {ShallowWrapper}
 */
export const setup = () => {
  const wrapper = shallow(<LoginPage />);
  return wrapper;
};

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttribute(wrapper, 'page-login');
    expect(component.exists()).toBeTruthy();
  });
});
