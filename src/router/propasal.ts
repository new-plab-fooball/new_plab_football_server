import express, { Response } from 'express';
import { EmailSend } from '../../src/utils/send_email';
import { userInfo } from '../../src/utils/user_info';
import { acceptAuth, userAuth } from '../middleware/authority';
import {
  createDataBase,
  readDataBase,
  readDataBaseJoin,
  updateDataBase,
} from '../data/database';
const proposalRouter = express.Router();

proposalRouter.post('/', userAuth(), async (req: any, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    project: req.body.project,
    leader: user_info.id,
    content: req.body.content,
    user: req.body.user,
    is_accept: 0,
  };
  try {
    const proposal_user_info: any = await readDataBase(
      'user',
      ['name', 'email'],
      `id=${to_db.user}`
    );
    const proposal_project_info: any = await readDataBase(
      'project',
      ['name'],
      `id=${to_db.project}`
    );
    const check_record: any = await readDataBase(
      'project_proposal',
      ['user', 'project'],
      `user=${user_info.id} AND project=${to_db.user}`
    );
    if (check_record[0].length === 0) {
      await createDataBase('project_proposal', to_db);
      EmailSend(
        '프로젝트 참여 제안이 왔어요!',
        proposal_user_info[0][0].email,
        '프로젝트의 정보를 확인하고 참여 제안에 대한 수락과 거절을 선택해주세요.',
        `<div>${user_info.name} 님이 ${proposal_project_info[0][0].name} 프로젝트에 팀원으로 ${proposal_user_info[0][0].name}님이 참여하길 제안했습니다.<br/><hr/>${to_db.content}</div>`
      );
      return res.status(200).json({
        result: true,
        message: `${proposal_user_info[0][0].name}님에게 프로젝트에 참여 제안했습니다.`,
      });
    } else {
      res.status(401).json({
        result: false,
        message: `이전에 ${proposal_user_info[0][0].name} 님에게 이미 해당 프로젝트에 참여 제안한 이력이 있습니다.`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message:
        '프로젝트 참여 제안에 실패했습니다. 서버 내부 문제 잠시 후 다시 시도해주세요. ㅠㅠ ',
    });
  }
});

proposalRouter.post('/ok', async (req: any, res: Response) => {
  const user_info: any = userInfo(req);
  try {
    const project_proposal: any = await readDataBase(
      'project_proposal',
      ['user', 'project', 'leader'],
      `id=${req.body.record_id}`
    );
    const { user, project } = project_proposal[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['name', 'team_list'],
      `id=${project}`
    );
    const proposal_user: any = await readDataBase(
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
      'project_proposal',
      {
        is_accept: 3,
      },
      `id=${req.body.record_id}`
    );
    EmailSend(
      '프로젝트 참여 수락',
      user_info.email,
      `축하합니다!! ${proposal_user[0][0].name}님이 프로젝트 참여 제안을 수락하였습니다.`,
      `<div>${proposal_user[0][0].name} 님이 ${project_info[0][0].name} 프로젝트의 팀원이 되었습니다.</div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트 참여 제안을 수락했습니다.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 참여 제안 수락에 실패했습니다.',
    });
  }
});

proposalRouter.post('/no', async (req: any, res: Response) => {
  const user_info: any = userInfo(req);
  try {
    const project_proposal: any = await readDataBase(
      'project_proposal',
      ['user', 'project'],
      `id=${req.body.record_id}`
    );
    const { user, project } = project_proposal[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['leader', 'name', 'team_list'],
      `id=${project}`
    );
    const proposal_user: any = await readDataBase(
      'user',
      ['email', 'name'],
      `id=${user}`
    );
    await updateDataBase(
      'project_proposal',
      {
        is_accept: 4,
      },
      `id=${req.body.record_id}`
    );
    EmailSend(
      '프로젝트 참여 제안 거절',
      user_info.email,
      `${project_info[0][0].leader}님이 프로젝트 참여 제안을 거절하였습니다. ㅠㅠ 다른 유저에게도 참여 제안을 해보세요. `,
      `<div>${proposal_user[0][0].name}님, ${project_info[0][0].leader}님이 프로젝트 참여 제안을 거절하여
         ${project_info[0][0].name} 프로젝트으로 팀원으로 합류되지 못했습니다. ㅠㅠ
        <a href="https://www.naver.com/">보러가기</a></div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트 참여 제안을 거절했습니다.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 참여 제안 거절에 실패했습니다.',
    });
  }
});

proposalRouter.post('/check', async (req: any, res: Response) => {
  const user_info: any = userInfo(req);
  try {
    const project_accept: any = await readDataBase(
      'project_proposal',
      ['user', 'project'],
      `id=${req.body.record_id}`
    );
    const { user, project } = project_accept[0][0];
    const project_info: any = await readDataBase(
      'project',
      ['leader', 'name', 'team_list'],
      `id=${project}`
    );
    const proposal_user: any = await readDataBase(
      'user',
      ['email', 'name'],
      `id=${user}`
    );
    await updateDataBase(
      'project_proposal',
      {
        is_accept: 2,
      },
      `id=${req.body.record_id}`
    );
    EmailSend(
      '프로젝트 참여 신청 열람',
      proposal_user[0][0].email,
      `${proposal_user[0][0].name}님이 프로젝트 참여 제안을 열람했습니다. 조금만 기다려주세요~ `,
      `<div>${user_info.name} 님, ${proposal_user[0][0].name}님이 프로젝트 참여 제안을 확인하여
         ${project_info[0][0].name} 검토 중입니다.
       </div>`
    );
    return res.status(200).json({
      result: true,
      message: `프로젝트 참여 제안을 열람했습니다.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      result: false,
      message: '프로젝트 제안 열람에 실패했습니다.',
    });
  }
});

export default proposalRouter;
