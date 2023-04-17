import mongoose, { ConnectOptions } from 'mongoose';

interface MyConnectOptions extends ConnectOptions {
    customOption?: boolean;
}

export const connect = async (uri: string) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MyConnectOptions);
      console.log(`Connected to test database at ${uri}`);
    } catch (error) {
      console.error('Error connecting to the database', error);
      throw new Error((error as Error).message);
      process.exit(1);
    }
  } else {
    console.log('Already connected to database');
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from the database', error);
    throw new Error((error as Error).message);
    process.exit(1);
  }
};