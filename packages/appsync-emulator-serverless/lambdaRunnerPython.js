const {
  log,
  sendErr,
  installStdIOHandlers,
  installExceptionHandlers,
} = require('./lambda/util');

process.once(
  'message',
  async ({ serverlessDirectory, handlerMethod, cliOptions, payload }) => {
    try {
      log.info('load', handlerMethod);

      const { spawn } = require('child_process');
      let args;
      if (cliOptions.stage) {
        args = ['invoke', 'local', '-f', handlerMethod, '-s', cliOptions.stage];
      } else {
        args = ['invoke', 'local', '-f', handlerMethod];
      }

      const sls = spawn('sls', args, {
        env: process.env,
        shell: '/bin/bash',
        cwd: serverlessDirectory,
      });

      installStdIOHandlers('python', sls, payload);
    } catch (err) {
      sendErr(err);
    }
  },
);

installExceptionHandlers();
