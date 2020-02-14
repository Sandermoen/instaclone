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
