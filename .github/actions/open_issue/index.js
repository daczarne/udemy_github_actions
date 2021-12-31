const core = require('@actions/core');
const github = require('@actions/github');

try {
  
  const token = core.getInput('token');
  const title = core.getInput('title');
  const body = core.getInput('body');
  const assignees = core.getInput('assignees');
  
  // Use the Octokit GitHub JS REST API client
  const octokit = github.GitHub(token);
  
  const response = octokit.issues.create({
    // The following can be written as
    // ...github.context.repo,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    // The following can also be written as
    // title,
    title: title,
    // The following can also be written as
    // body,
    body: body,
    // This needs to the an array.
    // If the assignees are passed in a list, then use
    // assignees: assignees ? assignees.split('\n') : undefined
    assignees: assignees ? assignees.split(',') : undefined
  });
  
  // Set the output
  core.setOutput('issue', JSON.stringify(response.data));
  
} catch (error) {
  
  core.setFailed(error.message);
  
}
