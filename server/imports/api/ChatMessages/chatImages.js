// /**
//  * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
//  *
//  */

// "use strict";

// import { _ } from "meteor/underscore";
// import { FilesCollection } from "meteor/ostrio:files";

// import { cloudinaryImageUpload, cloudinaryInterceptDownload, cloudinaryRemoveImage } from "../../lib/cloudinary";

// const Images = new FilesCollection({
//   debug: false, // Change to `true` for debugging
//   storagePath: process.env.PWD + "/uploads/chatImages",
//   collectionName: "chatImages",
//   // Disallow Client to execute remove, use the Meteor.method
//   allowClientCode: false,
//   onAfterUpload: function(fileRef) {
//     return cloudinaryImageUpload(fileRef, "chats/", this);
//   },
//   // Intercept access to the file
//   // And redirect request to cloudinary
//   interceptDownload(http, fileRef, version) { // eslint-disable-line no-unused-vars
//     return cloudinaryInterceptDownload(http, fileRef, version);
//   }
// });

// // Intercept FilesCollection's remove method to remove file from cloudinary
// const _origRemove = Images.remove;
// Images.remove = function(search) {
//   const cursor = this.collection.find(search);
//   cursor.forEach((fileRef) => {
//     _.each(fileRef.versions, (vRef) => {
//       if (vRef && vRef.meta && vRef.meta.pipePath) {
//         // Remove the object from cloudinary first, then we will call the original FilesCollection remove
//         cloudinaryRemoveImage(vRef.meta.pipePath);
//       }
//     });
//   });

//   // remove original file from database
//   _origRemove.call(this, search);
// };

// Images.allow({
//   insert: () => false,
//   update: () => false,
//   remove: () => false
// });

// Images.deny({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

// export default Images;
