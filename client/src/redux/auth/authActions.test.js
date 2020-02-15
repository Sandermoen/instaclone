import moxios from 'moxios';

import { storeFactory } from '../../utils/test/testUtils';
import { authStart } from './authActions';

describe('auth action creator', () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });

  test('sets auth to true and error to false upon success', () => {
    expect.assertions(1);

    const store = storeFactory();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200
      });
    });

    return store
      .dispatch(
        authStart({ email: 'test@hotmail.com', password: 'testpassword' })
      )
      .then(() => {
        const newState = store.getState();
        expect(newState.auth).toEqual({ auth: true, error: false });
      });
  });

  test('sets auth to false and displays error upon failure', () => {
    expect.assertions(1);
    const store = storeFactory();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'Invalid credentials please try again'
      });
    });

    return store.dispatch(authStart()).then(() => {
      const newState = store.getState();
      expect(newState.auth).toEqual({
        auth: false,
        error: 'Invalid credentials please try again'
      });
    });
  });
});
