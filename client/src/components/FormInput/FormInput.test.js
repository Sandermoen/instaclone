import React from 'react';
import { shallow } from 'enzyme';

import FormInput from './FormInput';

import { checkProps, findByTestAttribute } from '../../utils/test/testUtils';

const defaultProps = {
  placeholder: 'sfds',
  type: 'text',
  onChange: jest.fn(),
  required: true
};

/**
 * Factory function that returns a wrapped component
 * @function setup
 * @returns {ShallowWrapper}
 */
export const setup = (initialProps = {}) => {
  const setupProps = { ...defaultProps, ...initialProps };
  const wrapper = shallow(<FormInput {...setupProps} />);
  return wrapper;
};

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttribute(wrapper, 'component-input');
    expect(component.exists()).toBeTruthy();
  });
});

test('does not throw error with expected props', () => {
  const result = checkProps(FormInput, defaultProps);
  expect(result).toBeUndefined();
});
