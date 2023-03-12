/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

const errorMessages = {
  badRequest: {
    code: 400,
    message: "Bad request"
  },
  unauthorized: {
    code: 401,
    message: "Permission denied"
  },
  paymentRequired: {
    code: 402,
    message: "Payment required"
  },
  forbidden: {
    code: 403,
    message: "Forbidden"
  },
  someThingWentWrong: {
    code: 500,
    message: "Something went wrong"
  },
  subscriptionNotActive: {
    code: 404,
    message: "Subscription is not active"
  },
  notAcceptable: {
    code: 406,
    message: "Not acceptable"
  },
  updateRequired: {
    code: 426,
    message: "Update required"
  }
};


const constants = {
  errorMessages
};

export default constants;
