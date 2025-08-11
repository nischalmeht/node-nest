console.log('process.env.APP_NAME', process.env.APP_NAME)
export default () => ({
    appName: process.env.APP_NAME || 'MYNESTAPP',
  });
  