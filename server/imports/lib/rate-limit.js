/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { _ } from "meteor/underscore";

// import { getConfigurationValue } from "../api/Configurations/modules";

const fetchMethodNames = methods => _.pluck(methods, "name");

const assignLimits = ({methods, limit, timeRange}) => {
  const methodNames = fetchMethodNames(methods);

  if (Meteor.isServer) {
    DDPRateLimiter.addRule({
      name(name) {
        return _.contains(methodNames, name);
      },
      connectionId() {
        return true;
      }
    }, limit, timeRange);
  }
};

export default function rateLimit(options) {
  return assignLimits(options);
}

// export const secureRateLimitSocket = (name) => {
//   const secureRateLimit = getConfigurationValue("secureRateLimit");
//   let numRequests = secureRateLimit && secureRateLimit.socket && secureRateLimit.socket.numRequests ? secureRateLimit.socket.numRequests : 10;
//   let timeInterval = secureRateLimit && secureRateLimit.socket && secureRateLimit.socket.timeInterval ? secureRateLimit.socket.timeInterval : 300000;
//   console.log("secureRateLimitSocket", name, numRequests, timeInterval);
//   DDPRateLimiter.addRule({
//     type: "method",
//     name: name,
//     connectionId() {
//       return true;
//     }
//   }, numRequests, timeInterval,
//     (result) => {
//       if (result && result.allowed === false) {
//         console.log(result);
//       }
//     });
// };

// export const secureRateLimitIp = (name) => {
//   const secureRateLimit = getConfigurationValue("secureRateLimit");
//   let numRequests = secureRateLimit && secureRateLimit.ip && secureRateLimit.ip.numRequests ? secureRateLimit.ip.numRequests : 100;
//   let timeInterval = secureRateLimit && secureRateLimit.ip && secureRateLimit.ip.timeInterval ? secureRateLimit.ip.timeInterval : 3600000;
//   console.log("secureRateLimitIp", name, numRequests, timeInterval);
//   DDPRateLimiter.addRule({
//     type: "method",
//     name: name,
//     clientAddress() {
//       return true;
//     }
//   }, numRequests, timeInterval,
//     (result) => {
//       if (result && result.allowed === false) {
//         console.log(result);
//       }
//     });
// };
