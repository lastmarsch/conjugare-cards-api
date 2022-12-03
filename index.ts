import cors from 'cors';
import express from 'express';
import { conjugareRouter } from './controllers/conjugare';

const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.use('/conjugare', conjugareRouter);

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
