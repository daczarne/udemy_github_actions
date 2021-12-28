const core = require('@actions/core');
const github = require('@actions/github');

try {
  
  console.log(JSON.stringify(github, null, '\t'));
  
} catch (error) {
  
  core.setFailed(error.message);
  
}
