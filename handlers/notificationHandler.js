module.exports.sendNotification = (req, notification) => {
  const io = req.app.get('socketio');
  io.sockets.in(notification.receiver).emit('newNotification', notification);
};
