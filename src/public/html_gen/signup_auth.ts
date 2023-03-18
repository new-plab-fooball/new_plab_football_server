export const signUpAuthNumHTML = (auth_num: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>플랩풋볼 이메일 인증</title>
  </head>
  <body style="width: 100%; height: 100vh; margin: 0; padding: 0">
    <div
      style="
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        border-top: 2px solid #282B33;
        border-bottom: 2px solid #282B33;
        padding: 30px 0;
      "
    >
      <div>
        <svg width="54" height="22" viewBox="0 0 54 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.29517 8.3134H23.3255L22.7657 11.1346H1.73701L2.29517 8.3134ZM4.08462 0.83252H24.4689L23.9107 3.65371H21.6477L21.4177 4.8495H23.6739L23.1395 7.54722H2.75352L3.28799 4.8495H5.66942L5.90452 3.65371H3.52648L4.08462 0.83252ZM1.8977 11.8703H22.2837L21.0997 17.8814H4.64108L4.47194 18.7085H20.9322L20.3859 21.4688H0L1.18395 15.4577H17.6426L17.8016 14.6611H1.34124L1.8977 11.8703ZM10.1414 4.8495H16.9322L17.169 3.65371H10.3917L10.1414 4.8495Z" fill="#222836"/>
          <path d="M26.578 0.832561H38.2754L36.9325 7.60814H29.1658L28.9476 8.71261H36.7177L36.1595 11.5338H24.4621L25.8051 4.75652H33.5751L33.7883 3.68419H26.008L26.578 0.832561ZM24.523 12.7668H28.4486L28.2237 13.9017H40.667L40.892 12.7668H44.8176L43.0924 21.4756H22.8063L24.523 12.7668ZM27.3307 18.4092H39.7655L40.0564 16.9377H27.6233L27.3307 18.4092ZM42.9605 3.98695L40.6264 11.5406H37.0391L39.2192 0.531494H42.8066L41.4535 7.33753L43.6404 0.531494H47.2278L45.0476 11.5406H41.4586L42.9605 3.98695Z" fill="#222836"/>
          <path d="M49.2472 1.06082H48.5944V0.524658H50.5039V1.06082H49.8544V3.54542H49.2472V1.06082Z" fill="#222836"/>
          <path d="M50.8152 3.54542V0.524658H51.6355L52.4118 2.69298L53.1746 0.524658H54V3.54542H53.4368L53.452 1.12509L52.6063 3.54542H52.2055L51.3598 1.12509L51.3767 3.54542H50.8152Z" fill="#222836"/>
        </svg>
        <h2 style="font-weight: 100">
          <span style="color: #282B33; font-weight: 500">플랩풋볼</span> 계정 생성
          <span style="color: #282B33; font-weight: 500">이메일 인증 안내</span>
          입니다.
        </h2>
      </div>
      <div style="font-size: 15px; margin-bottom: 20px;line-height: 1.5;font-weight: 100;">
        안녕하세요.<br />
        플랩풋볼에 가입해 주셔서 진심으로 감사드립니다.<br />
        아래 인증번호를 입력하고 회원가입을 완료해주세요.<br />
        감사합니다.
      </div>
      <div style="border-top: 1px solid #727F88;border-bottom:1px solid #727F88;padding: 20px 0;display: flex;">
        <div style="line-height: 21px;font-size:15px;color: #727F88;">인증번호</div><div style="font-size: 18px;margin-left:10px;line-height:20px">${auth_num}</div>
      </div>
      <div style="margin-top: 50px; font-size: 13px">
        <div style="margin-bottom: 10px;font-size: 14px;text-align: right;font-weight: 700;">문의처</div>
        <div style="display: flex;align-items: center;justify-content: flex-end;"><span>010-9019-2172</span><img style="width: 20px;margin-left:5px;" src="https://new-plab-fooball-bucket.s3.ap-northeast-2.amazonaws.com/public/phone_icon" alt="claim phone number" /></div>
        <div style="display: flex;align-items: center;justify-content: flex-end;"><span>godboy4256@gmail.com</span><img style="width: 20px;margin-left:5px;" src="https://new-plab-fooball-bucket.s3.ap-northeast-2.amazonaws.com/public/email_icon.svg" alt="claim email address" /></div>
      </div>
    </div>
  </body>
</html>
`;
};
