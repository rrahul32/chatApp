/**
 * Copyright (c) 2017-present, PotluckHub. All rights reserved.
 *
 */

"use strict";

import { FilesCollection } from "meteor/ostrio:files";

const ProfileImages = new FilesCollection({
  storagePath: process.env.PWD + "/uploads/profileImages",
  collectionName: "profileImages"
});

ProfileImages.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ProfileImages.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

export default ProfileImages;

