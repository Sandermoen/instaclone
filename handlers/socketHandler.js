module.exports.sendNotification = (req, notification) => {
  const io = req.app.get('socketio');
  io.sockets.in(notification.receiver).emit('newNotification', notification);
};

module.exports.sendPost = (req, post, receiver) => {
  const io = req.app.get('socketio');
  io.sockets.in(receiver).emit('newPost', post);
};

module.exports.deletePost = (req, postId, receiver) => {
  const io = req.app.get('socketio');
  io.sockets.in(receiver).emit('deletePost', postId);
};
