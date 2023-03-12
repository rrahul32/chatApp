// /**
// * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
// *
// */

// "use strict";

// import { Meteor } from "meteor/meteor";
// import { _ } from "meteor/underscore";
// import { Random } from "meteor/random";
// import request from "request";
// import Cloudinary from "cloudinary";

// import { AppConstants } from "../../config";
// import { getParamJsonFromUrl } from "./utils";

// const cloudinarySettings = Meteor.settings.private.cloudinary;
// const imageSize = AppConstants.imageSize;
// const imageType = AppConstants.imageType;

// Cloudinary.config({
//   cloud_name: cloudinarySettings.cloudName, // eslint-disable-line camelcase
//   api_key: cloudinarySettings.apiKey, // eslint-disable-line camelcase
//   api_secret: cloudinarySettings.apiSecret // eslint-disable-line camelcase
// });

// const bound = Meteor.bindEnvironment((callback) => {
//   return callback();
// });

// export const cloudinaryImageUpload = (fileRef, cloudinaryPath, self) => {
//   // var self = this;
//   _.each(fileRef.versions, (vRef, version) => { // eslint-disable-line no-unused-vars
//     const randomId = Random.id();
//     // const cloudinaryPath = "categories/";
//     const fileName = randomId + "-" + version; // + "." + fileRef.extension;
//     Cloudinary.v2.uploader.upload(fileRef.path,
//       {
//         public_id: fileName, // eslint-disable-line camelcase
//         folder: cloudinaryPath,
//         timeout: 60000
//       },
//       function(error, result) { // eslint-disable-line no-unused-vars
//         bound(() => {
//           if (error) {
//             console.error(error);
//           } else {
//             // Update FilesCollection with link to the file at cloudinary
//             const upd = {
//               $set: {}
//             };
//             upd["$set"]["versions." + version + ".meta.pipePath"] = cloudinaryPath + fileName; // eslint-disable-line dot-notation
//             // upd["$set"]["versions." + version + ".meta.version"] = result.version; // eslint-disable-line dot-notation

//             self.update({
//               _id: fileRef._id
//             }, upd, (updError) => {
//               if (updError) {
//                 console.error(updError);
//               } else {
//                 // Unlink original files from FS after successful upload to cloudinary
//                 self.unlink(self.findOne(fileRef._id), version);
//               }
//             });
//           }
//         });
//       });
//   });
// };

// export const cloudinaryInterceptDownload = (http, fileRef, version) => {
//   if (fileRef && version && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath && getParamJsonFromUrl(http.request.url).size) {
//     let size;
//     switch (getParamJsonFromUrl(http.request.url).size) {
//       case "ldpi":
//         size = imageSize.ldpi;
//         break;
//       case "mdpi":
//         size = imageSize.mdpi;
//         break;
//       case "hdpi":
//         size = imageSize.hdpi;
//         break;
//       case "special":
//         size = imageSize.special;
//         break;
//       case "specialWeb":
//         size = imageSize.specialWeb;
//         break;
//     }
//     let type;
//     switch (getParamJsonFromUrl(http.request.url).type) {
//       case "offline":
//         type = imageType.grayScale;
//         break;
//       default:
//         type = null;
//         break;
//     }
//     if (size) {
//       let cloudinaryImageURL = Cloudinary.url(fileRef.versions[version].meta.pipePath);
//       cloudinaryImageURL = cloudinaryImageURL.replace("/upload/", "/upload/" + size + "/");
//       cloudinaryImageURL = type ? cloudinaryImageURL.replace("/upload/", "/upload/" + type + ",") : cloudinaryImageURL;
//       request({
//         url: cloudinaryImageURL,
//         headers: _.pick(http.request.headers, "range", "accept-language", "accept", "cache-control", "pragma", "connection", "upgrade-insecure-requests", "user-agent")
//       }, function(error) {
//         if (error) {
//           console.log("image request failed:", error);
//         }
//       }).pipe(http.response);
//       return true;
//     }
//   }
//   return false;
// };

// export const cloudinaryRemoveImage = (pipePath) => {
//   return Cloudinary.v2.api.delete_resources([pipePath],
//     function(error, result) {
//       if (error) {
//         console.log(error);
//         return false;
//       }
//       return result;
//     }
//   );
// };
