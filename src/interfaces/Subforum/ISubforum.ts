import { Document } from 'mongoose';

export  interface ISubforum extends Document {
    title: string;
    description: string;
}