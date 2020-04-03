import React from 'react';
import { shallow } from 'enzyme';
import { UnconnectedApp } from './App';

import { findByTestAttribute } from '../../utils/test/testUtils';

/**
 * Factory function that returns a wrapped component
 * @function setup
 * @returns {ShallowWrapper}
 */
export const setup = () => {
  const wrapper = shallow(<UnconnectedApp modal={{ modals: [] }} />);
  return wrapper;
};

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttribute(wrapper, 'component-app');
    expect(component.exists()).toBeTruthy();
  });
});
