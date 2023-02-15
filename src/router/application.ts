import express, { Response } from 'express';
import { EmailSend } from '../utils/send_email';
import { userInfo } from '../utils/user_info';
import { acceptAuth, userAuth } from '../middleware/authority';
import {
  createDataBase,
  readDataBase,
  readDataBaseJoin,
  updateDataBase,
} from '../data/database';
const applicationRouter = express.Router();

applicationRouter.post('/', async (req: any, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    project: req.body.project,
    is_accept: 0,
    user: user_info.id,
  };
  try {
    const project_info: any = await readDataBaseJoin(
      {
        project: ['leader', 'name', 'team_list'],
        user: ['email', 'name'],
      },
      ['project.leader', 'user.id'],
      `project.id = ${to_db.project}`
    );
    if (
      JSON.parse(project_info[0][0].project_team_list).includes(
        req.body.user.id
      )
    ) {
      return res.status(401).json({
        result: false,
        message: `${user_info.name} 님은 이미 해당 프로젝트의 팀원입니다.`,
      });
    }
    const check_record: any = await readDataBase(
      'project_application',
      ['user', 'project'],
      `user=${user_info.id} AND project=${to_db.project}`
    );
    if (check_record[0].length === 0) {
      await createDataBase('project_application', to_db);
      EmailSend(
        '프로젝트 참여 신청',
        project_info[0][0].user_email,
        '팀원의 정보를 확인하고 참여 신청에 대한 수락과 거절을 선택해주세요.',
        `<div>${user_info.name} 님이 ${project_info[0][0].project_name}프로젝트에 팀원이 되기 위해 참여 신청하였습니다.<a href="https://www.naver.com/">보러가기</a></div>`
      );
      return res.status(200).json({
        result: true,
        message: '프로젝트에 참여 신청했습니다.',
      });
    } else {
      res.status(401).json({
        result: false,
        message: `이전에 ${user_info.name} 님은 이미 해당 프로젝트에 신청한 이력이 있습니다. 결과를 기다려주세요.`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message:
        '프로젝트 참여 신청에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
    });
  }
});

applicationRouter.post('/ok', async (req: any, res: Response) => {
  try {
    const project_application: any = await readDataBase(
      'project_application',
      ['user', 'project'],
      `id=${req.body.accept_id}`
    );
    const { user, project } = project_application[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['leader', 'name', 'team_list'],
      `id=${project}`
    );
    const accept_user: any = await readDataBase(
      'user',
      ['email', 'name', 'contact'],
      `id=${user}`
    );
    await updateDataBase(
      'project',
      {
        team_list: JSON.stringify([
          ...JSON.parse(project_info[0][0].team_list),
          user,
        ]),
      },
      `id=${project}`
    );
    await updateDataBase(
      'project_application',
      {
        is_accept: 3,
      },
      `id=${req.body.accept_id}`
    );
    EmailSend(
      '프로젝트 참여 수락',
      accept_user[0][0].email,
      `축하합니다!! ${project_info[0][0].leader}님이 프로젝트 참여 신청을 수락하였습니다. 곧 연락이 갈 수도 있습니다.`,
      `<div>${accept_user[0][0].name}님! ${project_info[0][0].name} 프로젝트의 팀원이 되었습니다.<a href="https://www.naver.com/">보러가기</a></div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트를 수락했습니다. ${accept_user[0][0].name} 님에게 연락해보세요. 연락처 ${accept_user[0][0].contact}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 수락에 실패했습니다.',
    });
  }
});

applicationRouter.post('/no', async (req: any, res: Response) => {
  try {
    const project_application: any = await readDataBase(
      'project_application',
      ['user', 'project'],
      `id=${req.body.accept_id}`
    );
    const { user, project } = project_application[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['leader', 'name', 'team_list'],
      `id=${project}`
    );
    const accept_user: any = await readDataBase(
      'user',
      ['email', 'name'],
      `id=${user}`
    );
    await updateDataBase(
      'project_application',
      {
        is_accept: 4,
      },
      `id=${req.body.accept_id}`
    );
    EmailSend(
      '프로젝트 참여 거절',
      accept_user[0][0].email,
      `${project_info[0][0].leader}님이 프로젝트 참여 신청을 거절하였습니다. ㅠㅠ 다른 프로젝트도 조회해보세요! `,
      `<div>${accept_user[0][0].name}님, ${project_info[0][0].leader}님이 프로젝트 참여 신청을 거절하여
         ${project_info[0][0].name} 프로젝트의 팀원이 되지 못했습니다. ㅠㅠ
        <a href="https://www.naver.com/">보러가기</a></div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트 참여 신청을 거절했습니다.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 거절에 실패했습니다.',
    });
  }
});

applicationRouter.post('/check', async (req: any, res: Response) => {
  try {
    const project_application: any = await readDataBase(
      'project_application',
      ['user', 'project'],
      `id=${req.body.accept_id}`
    );
    const { user, project } = project_application[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['leader', 'name', 'team_list'],
      `id=${project}`
    );
    const accept_user: any = await readDataBase(
      'user',
      ['email', 'name'],
      `id=${user}`
    );
    await updateDataBase(
      'project_accept',
      {
        is_accept: 3,
      },
      `id=${req.body.accept_id}`
    );
    EmailSend(
      '프로젝트 참여 신청 열람',
      accept_user[0][0].email,
      `${project_info[0][0].leader}님이 프로젝트 참여 신청을 열람했습니다. 조금만 기다려주세요~ `,
      `<div>${accept_user[0][0].name}님, ${project_info[0][0].leader}님이 프로젝트 참여 신청을 확인하여
         ${project_info[0][0].name} 검토 중입니다. 결과가 곧 나올거에요~
        <a href="https://www.naver.com/">보러가기</a></div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트 참여 신청을 열람했습니다.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 열람에 실패했습니다.',
    });
  }
});

export default applicationRouter;
