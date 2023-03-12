/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { FilesCollection } from "meteor/ostrio:files";

const Images = new FilesCollection({
  storagePath: process.env.PWD + "/uploads/chatImages",
  collectionName: "chatImages"
});

Images.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Images.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

export default Images;
