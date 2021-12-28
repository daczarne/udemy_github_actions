const core = require('@actions/core');
const github = require('@actions/github');

try {
  
  /* Logging messages */
  core.debug('Some debugging message.');
  core.warning('Some warning message.');
  core.error('Some error message.');
  
  /* Setting secrets */
  const name = 'Secret to mask in the logs';
  core.setSecret(name);
  
  /* Log the github object */
  core.startGroup('Logging github object');
  console.log(JSON.stringify(github, null, '\t'));
  core.endGroup();
  
  /* Set environment variables */
  core.exportVariable('HELLO', 'hello');
  
} catch (error) {
  
  core.setFailed(error.message);
  
}
