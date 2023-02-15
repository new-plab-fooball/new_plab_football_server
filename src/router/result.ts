import express, { Response } from 'express';
import { fileUpload } from '../../src/utils/file_upload';
import { multerSet } from '../../src/middleware/multer';
import { createDataBase, readDataBase, updateDataBase } from '../data/database';
const resultRouter = express.Router();

const profileUpload = multerSet.fields([
  { name: 'title' },
  { name: 'tags' },
  { name: 'ref_link' },
  { name: 'recruitment' },
  { name: 'team_list' },
  { name: 'thumnail' },
  { name: 'result_post' },
  { name: 'project' },
]);

resultRouter.post('/', profileUpload, async (req: any, res: Response) => {
  const to_db = {
    ...req.body,
    like_count: 0,
  };
  if (Object.keys(req.files).length !== 0)
    // to_db['thumnail'] = fileUpload(req?.files?.thumnail?.[0]);
    try {
      await createDataBase('result', to_db);
      res.status(200).json({
        result: true,
        message:
          '완성작을 게시했습니다. 다른 유저 및 팀의 피드백을 받아보세요.',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        result: false,
        message:
          '완성작 게시에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
      });
    }
});

resultRouter.put('/', profileUpload, async (req: any, res: Response) => {
  const to_db = {
    ...req.body,
    like_count: 0,
  };
  if (Object.keys(req.files).length !== 0)
    // to_db['thumnail'] = fileUpload(req?.files?.thumnail?.[0]);
    try {
      await updateDataBase('result', to_db, `id=${req.body.id}`);
      res.status(200).json({
        result: true,
        message:
          '완성작 게시글을 수정했습니다. 다른 유저 및 팀의 피드백을 받아보세요.',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        result: false,
        message:
          '완성작 게시글 수정에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
      });
    }
});

resultRouter.get('/:page', async (req: any, res: Response) => {
  const from_db: any = await readDataBase(
    'result',
    ['id', 'title', 'thumnail', 'tags', 'project'],
    null,
    `${(Number(req.params.page) - 1) * 10},10`
  );
  try {
    return res.status(200).json({
      result: true,
      message: from_db[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '완성작 목록을 불러오지 못했습니다.',
    });
  }
});

export default resultRouter;
