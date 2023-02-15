import express, { Request, Response } from 'express';
import {
  createDataBase,
  deleteDataBase,
  updateDataBase,
} from '../data/database';
const commentRouter = express.Router();

commentRouter.post('/', async (req: any, res: Response) => {
  const to_db = {
    ...req.body,
    user: req.body.user.id,
  };
  try {
    await createDataBase('project_comment', to_db);
    res.status(200).json({
      result: true,
      message: '프로젝트에 댓글을 작성했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message:
        '프로젝트 댓글 작성에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
    });
  }
});

commentRouter.put('/', async (req: any, res: Response) => {
  const to_db = {
    ...req.body,
  };
  delete to_db.user;
  try {
    await updateDataBase('project_comment', to_db, `id=${req.body.id}`);
    res.status(200).json({
      result: true,
      message: '프로젝트 댓글을 수정했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message:
        '프로젝트 댓글 수정에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
    });
  }
});

commentRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteDataBase('project_comment', `id=${req.params.id}`);
    return res.status(200).json({
      result: true,
      message: '프로젝트 댓글을 삭제했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '프로젝트 댓글 삭제에 실패했습니다.',
    });
  }
});

export default commentRouter;
