import moxios from 'moxios';

import { storeFactory } from '../../utils/test/testUtils';
import { signInStart } from './userActions';

describe('auth action creator', () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });

  test('sets the currentUser and sets error to false upon success', () => {
    expect.assertions(1);

    const store = storeFactory();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          username: 'testuser'
        }
      });
    });

    return store
      .dispatch(
        signInStart({ email: 'test@hotmail.com', password: 'testpassword' })
      )
      .then(() => {
        const newState = store.getState();
        expect(newState.user).toEqual({
          currentUser: { username: 'testuser' },
          error: false
        });
      });
  });

  test('sets error and currentUser to false', () => {
    expect.assertions(1);
    const store = storeFactory();
    const error = 'Invalid credentials please try again';

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: error
      });
    });

    return store.dispatch(signInStart()).then(() => {
      const newState = store.getState();
      expect(newState.user).toEqual({
        error,
        currentUser: null
      });
    });
  });
});
