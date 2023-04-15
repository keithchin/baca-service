import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { subforumRoutes } from './routes/subforumRoutes';
import { userRoutes } from './routes/userRoutes';
import { ConnectOptions } from 'mongoose';

const DEFAULT_PORT = 3000;


let port = process.env.PORT || DEFAULT_PORT;

dotenv.config();

const app = express();


/**
 * Check if port is used on 5000
 */
const server = app.listen(DEFAULT_PORT, () => {
  console.log(`Server listening on port ${DEFAULT_PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${DEFAULT_PORT} is already in use, trying another port...`);
    const newPort = parseInt(process.env.PORT || '3000', 10) + 1;
    server.listen(newPort, () => {
      console.log(`Server listening on port ${newPort}`);
    });
  } else {
    console.error(error);
  }
});

const mongoUri = process.env.MONGO_URI;

if (!mongoUri || typeof mongoUri !== 'string') {
  console.error('MongoDB URI is not defined or is not a string');
  process.exit(1);
}

interface MyConnectOptions extends ConnectOptions {
  customOption?: boolean;
}

mongoose.connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
} as MyConnectOptions).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error(err);
});

app.use(express.json());

app.use('/api/subforums', subforumRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { app };
