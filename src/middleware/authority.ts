import { readDataBase } from '../data/database';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'BUCWEXFYH2J3K5N6P7R9SATCVD';

export const userAuth = (
  table_name?: string | undefined,
  auth_target?: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookieToken = req.headers.cookie?.split('=')[1];
    if (!cookieToken) {
      return res.status(403).json({
        message: '로그인 후 이용하세요.',
      });
    } else {
      jwt.verify(cookieToken, SECRET_KEY, async (error, decoded: any) => {
        if (error) {
          return res.status(403).json({
            result: false,
            message: '잘못된 접근입니다.',
          });
        } else if (decoded) {
          if (req.method === 'POST') {
            next();
          }
          if (req.method === 'PUT' || req.method === 'DELETE') {
            if (table_name && auth_target) {
              const content_user: any = await readDataBase(
                table_name,
                [auth_target],
                `id=${req.method === 'PUT' ? req.body.id : req.params.id}`
              );
              if (decoded.id !== content_user[0][0][auth_target]) {
                return res.status(403).json({
                  result: false,
                  message: '해당 컨텐츠에 대한 권한이 없습니다.',
                });
              } else {
                next();
              }
            }
          }
        }
      });
    }
  };
};

export const acceptAuth = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.headers.cookie?.split('=')[1];
  if (!cookieToken) {
    return res.status(403).json({
      message: '로그인 후 이용하세요.',
    });
  }
  jwt.verify(cookieToken, SECRET_KEY, async (error, decoded: any) => {
    if (error) {
      return res.status(403).json({
        result: false,
        message: '잘못된 접근입니다.',
      });
    } else if (decoded) {
      const project_application: any = await readDataBase(
        'project_application',
        ['project'],
        `id=${req.body.accept_id}`
      );
      const project_info: any = await readDataBase(
        'project',
        ['leader'],
        `id=${project_application[0][0].project}`
      );
      if (decoded.id === project_info[0][0].leader) {
        next();
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.',
        });
      }
    }
  });
};
