/* eslint-disable @typescript-eslint/no-unsafe-call */
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri:
    process.env.MONGODB_URI ??
    'mongodb+srv://root:root@miraki-training.gn5hy.mongodb.net/gamyam-crud?retryWrites=true&w=majority&appName=Miraki-Training',
  options: {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  },
}));
