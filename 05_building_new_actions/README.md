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

GitHub provides a [toolkit](https://github.com/actions/toolkit) that we can use in actions. This is useful when we need to get user input.

To include this action in a workflow, first we'll need to checkout the repository and then pass the action path to the `uses` keyword.

``` yaml
name: My JS action
on: workflow_dispatch
jobs:
  test-hello:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
      - name: Say hello
        id: hello
        uses: ./.github/actions/hello
        with:
          who-to-greet: 'World'
      - name: Verify action run
        run: |
          echo "Time: ${{ steps.hello.outputs.time }}"
```

When our actions use external packages we need to compile our code so that the packages are available in the virtual machine. To do this, we can use the `vercel/ncc` package. To install it locally we run `npm i -D @vercel/ncc`. Once installed we can use it by running `npx ncc build path/to/file.js -o path/to/output/dist`. Now we need to change the `main` in our action:

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
  main: 'dist/index.js'
```
