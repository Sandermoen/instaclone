import React from 'react';
import { assertPropTypes } from 'check-prop-types';

/**
 * Function to find a component by it's data-test attribute
 * @function findByTestAttribute
 * @param {ShallowWarapper} wrapper Wrapper to serach
 * @param {string} attributeName Attribute to find
 * @returns {JSX.Element}
 */
export const findByTestAttribute = (wrapper, attributeName) => {
  const component = wrapper.find(`[data-test='${attributeName}']`);
  return component;
};

/**
 * Function to check props on a react component
 * @function checkProps
 * @param {React.Component} Component Component to assert on.
 * @param {object} expectedProps Expected props.
 * @returns {undefined | Error}
 */
export const checkProps = (Component, expectedProps) => {
  const result = assertPropTypes(
    Component.propTypes,
    expectedProps,
    'prop',
    Component.name
  );

  return result;
};
