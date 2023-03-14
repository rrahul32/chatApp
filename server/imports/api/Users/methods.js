/**
 * Copyright (c) 2017-present, PotluckHub. All rights reserved.
 *
 */

"use strict";

import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { Meteor } from "meteor/meteor";

import rateLimit from "../../lib/rate-limit";
import { errorMessages } from "../../config/strings.js";
import ProfileImages from "./ProfileImages";

let contactSchema = new SimpleSchema({
  formattedPhoneNumber: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
});

const countrySchema = new SimpleSchema({
  key: {
    type: Number,
    optional: true,
  },
  name: {
    type: String,
  },
  dial_code: {
    type: String,
  },
  code: {
    type: String,
  },
});

export const updateProfileDetails = new ValidatedMethod({
  name: "updateProfileDetails",
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    // profilePic: {
    //   type: String,
    // },
    // country: {
    //   type: countrySchema,
    //   optional: true
    // }
  }).validator(),
  run(data) {
    console.log(data);
    const thisUser = Meteor.user();
    if (thisUser) {
      let query;
      if (data.name) {
        query = {
          "profile.name": data.name,
        };
      }
      // if (data.profilePic) {
      //   Object.assign(query, {
      //     "profile.pic": data.profilePic
      //   });
      // }
      Meteor.users.update(
        {
          _id: thisUser._id,
        },
        {
          $set: query,
        }
      );
      return true;
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

export const getContactList = new ValidatedMethod({
  name: "getContactList",
  validate: new SimpleSchema({
    contacts: {
      type: Array,
    },
    "contacts.$": {
      type: contactSchema,
    },
  }).validator(),
  run(contactData) {
    const thisUser = Meteor.user();
    if (thisUser) {
      let contactList = [];
      contactData.contacts.forEach((contact) => {
        let orQuery = [];
        if (contact && contact.formattedPhoneNumber) {
          orQuery.push({
            phone: {
              $elemMatch: {
                number: contact.formattedPhoneNumber,
                verified: true,
              },
            },
          });
        }
        if (contact && contact.email) {
          orQuery.push({
            emails: {
              $elemMatch: {
                address: contact.email,
                verified: true,
              },
            },
          });
        }
        // const contactUserData = Meteor.users.findOne({
        //   $or: [{
        //     "phone.number": contact.formattedPhoneNumber,
        //     "phone.verified": true
        //   },{
        //     "emails.address": contact.email,
        //     "emails.verified": true
        //   }]
        // });
        // const contactUserData = Meteor.users.findOne({
        //   $or: [{
        //     phone: {
        //       $elemMatch: {
        //         number: contact.formattedPhoneNumber,
        //         verified: true
        //       }
        //     }
        //   }, {
        //     emails: {
        //       $elemMatch: {
        //         address: contact.email,
        //         verified: true
        //       }
        //     }
        //   }]
        // });

        const query = {
          $or: orQuery,
        };
        const contactUserData = Meteor.users.findOne(query);
        if (contactUserData && contactUserData._id !== thisUser._id) {
          const existingContactListUser = contactList.find(
            (item) => item.user === contactUserData._id
          );
          let picture = null;
          if (
            contactUserData.profile &&
            contactUserData.profile.image &&
            contactUserData.profile.image.id
          ) {
            picture = ProfileImages.findOne({
              _id: contactUserData.profile.image.id,
            }).link();
          }
          if (existingContactListUser && contact.formattedPhoneNumber) {
            const index = contactList.findIndex(
              (eachItem) => eachItem.user === existingContactListUser.user
            );
            contactList[index].formattedPhoneNumber =
              contact.formattedPhoneNumber;
          } else if (existingContactListUser && contact.email) {
            const index = contactList.findIndex(
              (eachItem) => eachItem.user === existingContactListUser.user
            );
            contactList[index].email = contact.email;
          } else {
            contactList.push({
              user: contactUserData._id,
              name: contactUserData.profile.name,
              picture: picture,
              formattedPhoneNumber: contact.formattedPhoneNumber
                ? contact.formattedPhoneNumber
                : null,
              email: contact.email ? contact.email : null,
            });
          }
        }
      });
      return contactList;
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

function removeProfileImageData(imageId) {
  if (imageId) {
    return ProfileImages.remove({
      _id: imageId,
    });
  }
  return false;
}

function deleteProfileImage(user) {
  if (user.profile && user.profile.image && user.profile.image.id) {
    removeProfileImageData(user.profile.image.id);
    return Meteor.users.update(
      {
        _id: user._id,
      },
      {
        $set: {
          "profile.image": {},
        },
      }
    );
  }
  return false;
}

function updateProfileImageId(userId, profileImageId) {
  return Meteor.users.update(
    {
      _id: userId,
    },
    {
      $set: {
        "profile.image": {
          id: profileImageId,
          url: ProfileImages.findOne({
            _id: profileImageId,
          }).link(),
        },
      },
    }
  );
}

function updateProfileImage(user, image, type) {
  deleteProfileImage(user);
  ProfileImages.write(
    new Buffer(image, "base64"),
    {
      fileName: user._id + ".jpg",
      type: type,
      userId: user._id,
    },
    function (error, fileRef) {
      if (error) {
        throw error;
      } else {
        updateProfileImageId(user._id, fileRef._id);
      }
    }
  );
}

export const uploadProfileImage = new ValidatedMethod({
  name: "uploadProfileImage",
  validate: new SimpleSchema({
    image: {
      type: String,
    },
    type: {
      type: String,
    },
  }).validator(),
  run(data) {
    const thisUser = Meteor.user();
    if (thisUser) {
      if (data.image) {
        updateProfileImage(thisUser, data.image, data.type);
      }
      return true;
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

export const removeProfileImage = new ValidatedMethod({
  name: "removeProfileImage",
  validate: new SimpleSchema({}).validator(),
  run() {
    const thisUser = Meteor.user();
    if (thisUser) {
      deleteProfileImage(thisUser);
      return true;
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

export const updateDeviceInfo = new ValidatedMethod({
  name: "updateDeviceInfo",
  validate: new SimpleSchema({
    deviceInfo: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ deviceInfo }) {
    const thisUser = Meteor.user();
    if (thisUser) {
      deviceInfo.updatedAt = new Date();
      if (deviceInfo.oneSignalId) {
        Meteor.users.update(
          {},
          {
            $pull: {
              deviceInfo: {
                os: deviceInfo.os,
                oneSignalId: deviceInfo.oneSignalId,
              },
            },
          },
          {
            multi: true,
          }
        );
      }
      return Meteor.users.update(
        {
          _id: thisUser._id,
        },
        {
          $set: {
            deviceInfo: [deviceInfo],
          },
        }
      );
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

export const removePushSubscription = new ValidatedMethod({
  name: "removePushSubscription",
  validate: new SimpleSchema({}).validator(),
  run() {
    const thisUser = Meteor.user();
    if (thisUser) {
      return Meteor.users.update(
        {
          _id: thisUser._id,
        },
        {
          $set: {
            deviceInfo: [],
          },
        }
      );
    } else {
      throw new Meteor.Error(
        errorMessages.forbidden,
        errorMessages.nullUserMessage
      );
    }
  },
});

export const findUsers = new ValidatedMethod({
  name: "findUsers",
  validate: new SimpleSchema({
    number: {
      type: String,
    },
  }).validator(),
  run(data) {

      // const regex = new RegExp("+91" + data, "i"); // create a regular expression to match the search query

      const results = Meteor.users.find(
        {
          _id: { $ne: Meteor.user()._id },
          "profile.number": { $eq: '+91'+data.number }, // search for phone numbers that match the search query
        },
        {
          fields: {
            // specify the fields to include in the result
            _id: 1,
            "profile.name": 1,
            "profile.number": 1,
          },
        }
      ).fetch();
      console.log(results);
      return results;
  },
});

rateLimit({
  methods: [
    updateProfileDetails,
    uploadProfileImage,
    removeProfileImage,
    updateDeviceInfo,
    getContactList,
    findUsers,
  ],
  limit: 100,
  timeRange: 1000,
});
