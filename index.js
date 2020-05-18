const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const path = require('path');
const socketio = require('socket.io');
const jwt = require('jwt-simple');
require('dotenv').config();

const apiRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    console.log(err);
  }
  console.log(err.message);
  res.status(err.statusCode).send({
    error:
      err.statusCode >= 500
        ? 'An unexpected error ocurred, please try again later.'
        : err.message,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

(async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to database');
  } catch (err) {
    throw new Error(err);
  }
})();

const expressServer = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

const io = socketio(expressServer);
app.set('socketio', io);
console.log('Socket.io listening for connections');

// Authenticate before establishing a socket connection
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (token) {
    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
      return next(new Error('Not authorized.'));
    }
    socket.user = user;
    return next();
  } else {
    return next(new Error('Not authorized.'));
  }
}).on('connection', (socket) => {
  socket.join(socket.user.id);
  console.log('socket connected:', socket.id);
});
