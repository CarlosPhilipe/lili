'use strict';
const AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports.hello = async event => {
  // restore image sent by request
  let encodedImage = JSON.parse(event.body).user_avatar;
  // trnsated image to b64 fom data
  let decodedImage = Buffer.from(encodedImage, 'base64');

  var filePath = "avatars/name.jpg";

  var params = {
      Body: decodedImage,
      Bucket: "static.lili.com.br",
      Key: filePath,
   };

   s3.upload(params, function(err, data) {
       if(err) {
           return {
             statusCode: 400,
             body: JSON.stringify(
               {
                 message: 'error!',
                 err,
               },
             ),
           };
       } else {
         return {
           statusCode: 200,
           body: JSON.stringify(
             {
               message: 'successfully!',
             },
           ),
         };
      }
  });


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
