import express from 'express';
import cors from 'cors';
import userRouter from './router/user';
import authRouter from './router/auth';
import projectRouter from './router/project';
import commentRouter from './router/comment';
import reviewRouter from './router/review';
import answerRouter from './router/answer';
import applicationRouter from './router/application';
import proposalRouter from './router/propasal';
import resultRouter from './router/result';
import cookies from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  })
);

app.use(cookies());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/project', projectRouter);
app.use('/comment', commentRouter);
app.use('/review', reviewRouter);
app.use('/answer', answerRouter);
app.use('/application', applicationRouter);
app.use('/proposal', proposalRouter);
app.use('/result', resultRouter);

app.listen('8000', () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 8000
  ################################################
`);
});
