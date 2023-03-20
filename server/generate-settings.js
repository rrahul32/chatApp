const { networkInterfaces } = require('os');
const { writeFileSync } = require('fs');

const ip = Object.values(networkInterfaces())
  .flat()
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address)
  .shift();

const settings = {
  public: {
    ROOT_URL: `http://${ip}:3000`,
  },
  // Add any other settings you need here
};

writeFileSync('settings.json', JSON.stringify(settings));