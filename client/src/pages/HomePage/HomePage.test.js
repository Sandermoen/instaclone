import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttribute } from '../../utils/test/testUtils';

import HomePage from './HomePage';

/**
 * Factory function that returns a wrapped component
 * @function setup
 * @returns {ShallowWrapper}
 */
export const setup = () => {
  const wrapper = shallow(<HomePage />);
  return wrapper;
};

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttribute(wrapper, 'page-home');
    expect(component.exists()).toBeTruthy();
  });
});
