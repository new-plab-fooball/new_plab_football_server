import express, { Response } from 'express';
import { fileUpload } from '../../src/utils/file_upload';
import { multerSet } from '../../src/middleware/multer';
import { createDataBase, readDataBase, updateDataBase } from '../data/database';
import { userInfo } from '../../src/utils/user_info';
const projectRouter = express.Router();

const profileUpload = multerSet.fields([
  { name: 'name' },
  { name: 'intro' },
  { name: 'project_post' },
  { name: 'field' },
  { name: 'skills' },
  { name: 'duration_period' },
  { name: 'recruitment_period' },
  { name: 'location' },
  { name: 'is_online' },
  { name: 'tags' },
  { name: 'team_list' },
  { name: 'images' },
  { name: 'thumail' },
]);

projectRouter.post(
  '/',
  multerSet.array('images'),
  async (req: any, res: Response) => {
    const leader: any = userInfo(req);
    if (!leader) res.status(400).send('로그인 해주세요.');
    const to_db = {
      ...req.body,
      is_complete: false,
      leader: leader.id,
      is_online: Number(req.body.is_online),
      location: Number(req.body.location),
      team_list: JSON.stringify([]),
    };
    if (Object.keys(req.files).length !== 0) {
      to_db['images'] = JSON.stringify(
        fileUpload(req?.files, 'project', leader.id)
      );
    }
    try {
      await createDataBase('project', to_db);
      res.status(200).json({
        result: true,
        message: '프로젝트를 생성했습니다. 팀원 모집을 시작하겠습니다.',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        result: false,
        message:
          '프로젝트 생성에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
      });
    }
  }
);

projectRouter.put('/', profileUpload, async (req: any, res: Response) => {
  const to_db = {
    ...req.body,
    like_count: 0,
    is_complete: false,
  };
  delete to_db.user;
  if (Object.keys(req.files).length !== 0)
    // to_db['thumnail'] = fileUpload(req?.files?.thumnail?.[0]);
    try {
      console.log(req.body);
      await updateDataBase('project', to_db, `id=${req.body.id}`);
      res.status(200).json({
        result: true,
        message:
          '프로젝트를 모집글을 수정했습니다. 팀원 모집을 다시 시작하겠습니다.',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        result: false,
        message:
          '프로젝트 수정에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
      });
    }
});

projectRouter.put(
  '/complete',
  profileUpload,
  async (req: any, res: Response) => {
    const to_db = {
      is_complete: true,
    };
    try {
      await updateDataBase('project', to_db, `id=${req.body.id}`);
      res.status(200).json({
        result: true,
        message: '프로젝트를 완료했습니다.',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        result: false,
        message:
          '프로젝트 완료에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
      });
    }
  }
);

projectRouter.get('/:page', async (req: any, res: Response) => {
  const from_db: any = await readDataBase(
    'project',
    [
      'id',
      'name',
      'intro',
      'field',
      'recruitment',
      'skills',
      'duration_period',
      'recruitment_period',
    ],
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
      message: '유저 목록을 불러오지 못했습니다.',
    });
  }
});

export default projectRouter;
