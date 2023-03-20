import UserSettings from "./";

export const addOrUpdateUserSettings = (userId, data = {}) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-line no-undef
    data.userId = userId;
    const userSettingsId = UserSettings.upsert({ userId }, { $set: data });
    if (userSettingsId) {
      resolve(userSettingsId);
    } else {
      reject(false);
    }
  });
};
export const addOrUpdateChatSettings = (userId, chatId, data = {}) => {
  // eslint-disable-line no-undef
  let value = {};
  data.id = chatId;
  value.chatSettings = [data];
  addOrUpdateUserSettings(userId, value).then(
    (result) => {
      console.log("resultC: ", result);
    },
    (error) => {
      console.log("errorC:  ", error);
    }
  );
};
