import mongoose, { ConnectOptions } from 'mongoose';

interface MyConnectOptions extends ConnectOptions {
    customOption?: boolean;
}

export const connect = async (uri: string) => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as MyConnectOptions);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Error connecting to the database', error);
      throw new Error((error as Error).message); // add this line to see the error message
      process.exit(1);
    }
  };
export const disconnect = async () => {
  await mongoose.disconnect();
  console.log('Database disconnected successfully');
};