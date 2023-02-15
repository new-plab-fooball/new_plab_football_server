import express, { Request, Response } from 'express';
import { userInfo } from '../../src/utils/user_info';

import {
  createDataBase,
  deleteDataBase,
  updateDataBase,
} from '../data/database';
const answerRouter = express.Router();

answerRouter.post('/project', async (req: Request, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    ...req.body,
    user: user_info.id,
  };
  try {
    await createDataBase('project_answer', to_db);
    return res.status(200).json({
      result: true,
      message: '댓글에 대한 답글를 작성했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '댓글에 대한 답글 작성에 실패했습니다.',
    });
  }
});

answerRouter.put('/project', async (req: Request, res: Response) => {
  try {
    await updateDataBase('project_answer', req.body, `id=${req.body.id}`);
    return res.status(200).json({
      result: true,
      message: '댓글에 대한 해당 답글를 수정했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '댓글에 대한 해당 답글 수정에 실패했습니다.',
    });
  }
});

answerRouter.delete('/project/:id', async (req: Request, res: Response) => {
  try {
    await deleteDataBase('project_answer', `id=${req.params.id}`);
    return res.status(200).json({
      result: true,
      message: '댓글에 대한 해당 답글를 삭제했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '댓글에 대한 해당 답글 삭제에 실패했습니다.',
    });
  }
});

answerRouter.post('/result', async (req: Request, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    ...req.body,
    user: user_info.id,
  };
  try {
    await createDataBase('result_answer', to_db);
    return res.status(200).json({
      result: true,
      message: '완성작 리뷰에 대한 답글를 작성했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '완성작 리뷰에 대한 답글 작성에 실패했습니다.',
    });
  }
});

answerRouter.put('/result', async (req: Request, res: Response) => {
  try {
    await updateDataBase('result_answer', req.body, `id=${req.body.id}`);
    return res.status(200).json({
      result: true,
      message: '완성작 리뷰에 대한 해당 답글를 수정했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '완성작 리뷰에 대한 해당 답글 수정에 실패했습니다.',
    });
  }
});

answerRouter.delete('/result/:id', async (req: Request, res: Response) => {
  try {
    await deleteDataBase('result_answer', `id=${req.params.id}`);
    return res.status(200).json({
      result: true,
      message: '완성작 리뷰에 대한 해당 답글를 삭제했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '완성작 리뷰에 대한 해당 답글 삭제에 실패했습니다.',
    });
  }
});

export default answerRouter;
