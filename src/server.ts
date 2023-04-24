import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { subforumRoutes } from './routes/subforumRoutes';
import { userRoutes } from './routes/userRoutes';
import { subforumSubRoutes } from './routes/subforumSubRoutes';
import { postRoutes } from './routes/postRoutes';
import { ConnectOptions } from 'mongoose';
import net from 'net';


const DEFAULT_PORT = 3000;


let port = process.env.PORT || DEFAULT_PORT;

dotenv.config();

const app = express();
app.use(cors());


/**
 * Check if port is used on 5000
 */

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
} as MyConnectOptions).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error(err);
});

app.use(express.json());

app.use('/api/subforums', subforumRoutes, subforumSubRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const checkPort = (port: number, callback: (port: number) => void) => {
  const server = net.createServer();

  server.once('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying another port...`);
      checkPort(port + 1, callback);
    } else {
      console.error(error);
    }
  });

  server.once('listening', () => {
    server.close();
    callback(port);
  });

  server.listen(port);
};

const startServer = (port: number) => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

checkPort(Number(port), (availablePort) => {
  startServer(availablePort);
});

export { app };
