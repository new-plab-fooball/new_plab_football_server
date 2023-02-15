export const signUpAuthNumHTML = (auth_num: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>토이 스쿼드 이메일 인증</title>
  </head>
  <body style="width: 100%; height: 100vh; margin: 0; padding: 0">
    <div
      style="
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        border-top: 2px solid #00dd6d;
        border-bottom: 2px solid #00dd6d;
        padding: 30px 0;
      "
    >
      <div>
        <img src="https://toy-squad-project-bucket.s3.ap-northeast-2.amazonaws.com/common_static_img/logo.svg" alt="logo" />
        <h2 style="font-weight: 100">
          토이스쿼드 계정 생성
          <span style="color: #00dd6d; font-weight: 500">이메일 인증 안내</span>
          입니다.
        </h2>
      </div>
      <div style="font-size: 15px; margin-bottom: 20px">
        안녕하세요.<br />
        토이스쿼드에 가입해 주셔서 진심으로 감사드립니다.<br />
        아래 인증번호를 입력하고 회원가입을 완료해주세요.<br />
        감사합니다.
      </div>
      <div style="border-top: 1px solid #ccc;border-bottom:1px solid #ccc;padding: 20px 0;display: flex;">
        <div style="line-height: 21px;font-size:15px;color: #ccc;">인증번호</div><div style="font-size: 18px;margin-left:10px;line-height:20px">${auth_num}</div>
      </div>
      <div style="margin-top: 30px; font-size: 13px">
        <div style="margin-bottom: 10px">이용자 문의</div>
        <div>전화번호 : 010-9019-2172</div>
        <div>이메일 : godboy4256@gmail.com</div>
      </div>
    </div?>
  </body>
</html>

`;
};
