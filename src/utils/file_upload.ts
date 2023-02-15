import AWS from 'aws-sdk';

const uuidv4Gen = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const fileUpload = (files: any, type: string, leader?: number) => {
  const ACCESS_KEY = 'AKIA2HNIUULRRFQANLWF';
  const SECRET_ACCESS_KEY = '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';
  const REGION = 'ap-northeast-2';
  const S3_BUCKET = 'toy-squad-project-bucket';
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });
  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });
  const uuid = uuidv4Gen();
  const front_use_paths: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const folderPath = `service_img/${type}/${leader}/`; //  S3 버킷 폴더 경로
    const filePathKey = `${folderPath}${type}_${leader}_${uuid}_${i}`;
    const params = {
      ACL: 'public-read',
      Body: JSON.stringify(files[i]),
      Bucket: S3_BUCKET,
      Key: filePathKey,
    };
    front_use_paths.push(filePathKey);

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt: any) => {
        console.log('SUCCESS');
      })
      .send((err: any) => {
        if (err) console.log(err);
      });
  }
  return front_use_paths;
};
