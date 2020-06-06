import socketTypes from './socketTypes';
import { connect } from '../../services/socketService';
import { addNotification } from '../notification/notificationActions';
import { addPost, removePost } from '../feed/feedActions';

export const connectSocket = () => (dispatch) => {
  const socket = connect();
  dispatch({ type: socketTypes.CONNECT, payload: socket });

  socket.on('newNotification', (data) => {
    dispatch(addNotification(data));
  });

  socket.on('newPost', (data) => {
    dispatch(addPost(data));
  });

  socket.on('deletePost', (data) => {
    dispatch(removePost(data));
  });
};

export const disconnectSocket = () => ({
  type: socketTypes.DISCONNECT,
});
