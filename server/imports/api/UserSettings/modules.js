import UserSettings from "./"

export const addOrUpdateUserSettings=(userId, data={})=>{
    return new Promise((resolve, reject) => { // eslint-disable-line no-undef
        data.userId=userId;
        const userSettingsId = UserSettings.upsert({userId},{$set: data});
        if (userSettingsId) {
          resolve(userSettingsId);
        } else {
          reject(false);
        }
      });    
    // console.log("userId", userId)
    // if(userId)
    // {
    //     data.userId=userId;
    //     UserSettings.upsert({userId},{$set: data});
    // }
}
