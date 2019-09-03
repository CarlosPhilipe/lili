'use strict';

const AWS = require('aws-sdk');
var s3 = new AWS.S3();
const fileType = require('file-type');

const getFile = (fileMime, buffer) => {
  let fileExt = fileMime.ext;
  let hash = sha1(new Buffer(new Date().toString()));
  let now = moment().format('yyyy-MM-DD HH:mm:ss');

  let filePath = hash + '/';
  let fileName = unixTime(now) + '.' + fileExt;
  let fileFullName = filePath + fileName;
  let fileFullPath = 'static.lili.com.br/' + fileFullName;

  let params = {
    Bucket: "static.lili.com.br",
    Key: fileFullName,
    Body: buffer,
  };

  let uploadFile = {
    size: buffer.toString('ascii').length,
    type: fileMime.mime,
    name: fileName,
    full_path: fileFullPath,
  }

  return {
    params: params,
    uploadFile: uploadFile,
  };
}

module.exports.hello = async (event, context) => {
  try {
    let request = event.body;
    // restore image sent by request
    let encodedImage = JSON.parse(request).user_avatar;
    // trnsated image to b64 fom data
    let decodedImage = Buffer.from(encodedImage, 'base64');

    let fileMime = fileType(decodedImage);

    let file = getFile(fileMime, decodedImage);

    let params = file.params;

    s3.putObject(params, (err, data) => {
      if (err) {
        return {
          statusCode: 500,
          body: JSON.stringify(
            {
              message: 'deu ruim!',
              JSON.stringify(err),
            },
          ),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: 'successfully!',
          },
        ),
      };
    });

  } catch (err) {
    return JSON.stringify(err);
  }
};
