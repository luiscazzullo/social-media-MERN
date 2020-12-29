import config from '../config/config';
import app from './express';
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.on('error', () => {
  throw new Error(`No se pudo conectar a la DB: ${config.mongoUri}`);
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info(`El servidor está corriendo en ${config.port}`)
})