import mongoose from 'mongoose';

// const uri = mongodb+srv://AbilioGoncalves:banco123@cluster0.h10ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Defina a variável MONGODB_URI no arquivo .env.local');
}

/**
 * Global é usado para manter uma conexão com o banco entre chamadas em ambiente de desenvolvimento
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;