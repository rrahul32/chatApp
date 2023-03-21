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
  data.id=chatId;
  const userSettings = UserSettings.findOne({userId});
  console.log('userSettings: ', userSettings);
  const chatSettingsIndex = userSettings.chatSettings.findIndex(cs => cs.id === chatId);
  console.log('chatSettingsIndex: ', chatSettingsIndex);
  console.log('data: ', data);
    if (chatSettingsIndex === -1) {
      // If the chatSettings entry does not exist, add it to the user's chatSettings array
      UserSettings.update({userId}, {
        $push: {
          'chatSettings': data
        }
      });
    } else {
      // If the chatSettings entry already exists, update its settings
      const setModifier = {};
      setModifier[`chatSettings.${chatSettingsIndex}`] = data;
      console.log('setModifier: ', setModifier);
      const result =UserSettings.update({userId}, {
        $set: setModifier
      });
      console.log('result: ', result);
    }
};
