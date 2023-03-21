import SimpleSchema from "simpl-schema";
import { Mongo } from "meteor/mongo";

const UserSettings = new Mongo.Collection("userSettings");

export default UserSettings;

UserSettings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

UserSettings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
export const chatSettingsSchema = new SimpleSchema({
    "id": {
        type: String,
        label: "Chat ID"
    },
    "translationEnabled": {
        type: Boolean,
        label: "Translation Enabled",
        defaultValue: false
    },
    "translationLanguage": {
        type: String,
        label: "Translation Language",
        optional: true,
        defaultValue: 'ml'
    },
    "emotionDetection": {
        type: Boolean,
        label: "Emotion Detection",
        defaultValue: false
    }
})

const userSettingsSchema = new SimpleSchema({
    "userId": {
        type: String,
        label: "User ID"
    },
    "chatSettings": {
        type: Array,
        optional: true,
        label: "Chat Settings",
        defaultValue: []
    },
    "chatSettings.$": {
        type: chatSettingsSchema,
        label: "Chat Settings",
        optional: true,
    },
}
);

UserSettings.attachSchema(userSettingsSchema);