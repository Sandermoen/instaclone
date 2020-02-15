import { authSuccess, authFailure } from './authActions';

import authReducer, { INITIAL_STATE } from './authReducer';

test('returns default state when no action is passed', () => {
  const newState = authReducer(undefined, {});
  expect(newState).toEqual(INITIAL_STATE);
});

test('returns expected state when `AUTH_SUCCESS` is passed', () => {
  const newState = authReducer(undefined, authSuccess());
  expect(newState).toEqual({ auth: true, error: false });
});

test('returns expected state when `AUTH_FAILURE` is passed', () => {
  const error = 'Invalid email or password';
  const newState = authReducer(undefined, authFailure(error));
  expect(newState).toEqual({ auth: false, error });
});
