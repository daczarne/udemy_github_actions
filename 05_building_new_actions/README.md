# Building GitHub actions

We can create our own actions to automate our steps. Public actions require their own dedicated repository. Private actions can be built in our repository. Actions must be written using JavaScript. If we need to write the Action in a different language, we need to run them in Docker containers. They have the benefit of being consistent (since they run in a controlled environment defined in the Docker image), but they have the draw side of being slower (since the image needs to be deployed to the virtual machine).

## JavaScript action

We place actions in the `.github/actions` directory. Each action should have its own sub-directory.

``` txt
udemy_github_actions
  |
  |_ .github
  |   |
  |   |_ actions
  |   |   |
  |   |   |_hello
  |   |       |_ action.yml
  |   |
  |   |_ workflows
  |   |   |_ ...
  |   |
  |   |_ ...
  |
  |_ ...
```

Each action requires an `action.yml`file. In this file we'll declare the `name`, `author`, and `description` of the action. Next we can add objects of `inputs` and `outputs`. Each elements of the `inputs` object is itself an object too, with a `description`, `required` flag, and a `default` value. Each element of the `outputs` object takes a description.

Below that we need to include the `runs` keyword. In it we specify the version of `node` in the `using` keyword, and the location of the file with the action in the `main` keyword.

``` yaml
name: Hello World
author: Mr Smith
description: An action that greets
inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'Mr Smith'
outputs:
  time:
    description: Greeting time
runs:
  using: 'node12'
  main: 'index.js'
```
