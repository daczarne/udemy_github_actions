# Matrix, Strategy, and Docker containers

## Continue on error and Timeout minutes

The `if: failure()` option was good to force a downstream step to run even if the previous one had failed. But and step coming after that immediate failed one will still not run. If we need to make sure that all downstream steps do run, we can add the `continue-on-error: true` key:value pair to the job that might fail. By default this key's value is set to `false`.

``` yaml
name: Continue on error
on: workflow_dispatch
jobs:
  run-shell-command:
    runs-on: ubuntu-latest
    steps:
      - name: echo a string
        run: echo "Hello world!"
        continue-on-error: true
      - name: multiline script
        run: |
          node -v
          npm -v
```

Another key that we can use is the `timeout-minutes`. It can be added either to a job or to a step. This key controls the maximum number of minutes that the job or step can take. By default this key's value is set to `360`. After the alloted time, GitHub will cancel the job.

``` yaml
name: Timeout minutes (job)
on: workflow_dispatch
jobs:
  run-shell-command:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: echo a string
        run: echo "Hello world!"
        continue-on-error: true
      - name: multiline script
        run: |
          node -v
          npm -v
```

``` yaml
name: Timeout minutes (step)
on: workflow_dispatch
jobs:
  run-shell-command:
    runs-on: ubuntu-latest
    steps:
      - name: echo a string
        timeout-minutes: 30
        run: echo "Hello world!"
        continue-on-error: true
      - name: multiline script
        run: |
          node -v
          npm -v
```

## Strategy

The `strategy` key will allow us to set up an environment matrix. GitHub will then run the job in every possible combination of environments set ups specified on our matrix. To set up a strategy we need to include the `strategy` key in our job. Inside this key we also need to add the `matrix` key. The value of the `matrix` key needs to be an object. The keys of this object can be whatever we like (we'll use them later). This keys basically act as parameters. Each value is an array of the different values that we want to pass to our job for that parameter.

Under the `strategy` key we can also add the `fail-fast` key. By default this key has a value of `true`. This means that under this job, if one step fails, all other steps of the job will be stopped.

We can also add the `max-parallel`. This key takes as its value an integer that specifies how many values of the matrix can run in parallel. By default, GitHub will try to maximize the number of jobs running in parallel.

To reference the values of our `matrix` we need to use an expression that invokes the `matrix` context. Using dot notation, we pass the context and the parameter key that we defined in our matrix. GitHub will run the job once with each possible combination of parameter values.

``` yaml
name: Strategy
on: workflow_dispatch
jobs:
  node-version:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
        node_version: [6, 8, 10]
      fail-fast: true
      max-parallel: 3
    runs-on: ${{ matrix.os }}
    steps:
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node_version }}
      - name: Log node version
        run: node -v
```

If we want to exclude a particular combination in our matrix, we can use the `exclude` key to specify an array of values (one per key) to exclude.

``` yaml
name: Exclude
on: workflow_dispatch
jobs:
  node-version:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
        node_version: [6, 8, 10]
        exclude:
          - os: ubuntu-latest
            node_version: 6
          - os: macos-latest
            node_version: 8
      fail-fast: true
      max-parallel: 3
    runs-on: ${{ matrix.os }}
    steps:
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node_version }}
      - name: Log node version
        run: node -v
```

There's also an `include` key, but it's not the opposite of the `exclude` key. This key also takes an array of objects with all the parameters of the matrix, but we use it to specify additional configurations or variables that are needed for that combination only.

``` yaml
name: Include
on: workflow_dispatch
jobs:
  node-version:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
        node_version: [6, 8, 10]
        include:
          - os: ubuntu-latest
            node_version: 8
            is_ubuntu_8: "true"
        exclude:
          - os: ubuntu-latest
            node_version: 6
          - os: macos-latest
            node_version: 8
      fail-fast: true
      max-parallel: 3
    runs-on: ${{ matrix.os }}
    env:
      IS_UBUNTU_8: ${{ matrix.is_ubuntu_8 }}
    steps:
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node_version }}
      - name: Log node version
        run: |
          node -v
          echo $IS_UBUNTU_8
```

## Docker

We can specify Docker containers for our jobs to run by using the `container` key. To it we pass an object with an `image` key, its value being the image that we will be using. Additionally, we can specify the `env` (for environment variables that need to be available in the container), `ports` (to specify ports to be exposed in the container), `volumes`, `options` (to be used in the Docker create command).

``` yaml
name: Docker
on: workflow_dispatch
jobs:
  node-docker:
    runs-on: ubuntu-latest
    container:
      image: node:13.5.0-alpine3.10
    steps:
      - name: Log node version
        run: |
          node -v
          cat /etc/os-release
```

All steps in the job will run in de container, and not on the virtual machine.

We can also specify multiple containers. To specify multiple containers we pass an object to the `services` key. Each element of that object is the key that identifies each one of our services. In this example, we have two services: an `app` and a `mongo` DB. In order to communicate between the two containers we can use the service key (name) as a host name.

``` yaml
name: application
on: push
jobs:
  node-docker:
    runs-on: ubuntu-latest
    services:
      app:
        image: <name_of_the_image_we_published>
        ports:
          - 3001:3000
      mongo:
        image: mongo
        ports:
          - "27017:27017"
    steps:
      - name: POST a user
        run: "curl -X POST http://mongo:3001/api/user -H 'Content-Type: application/json' -d '{\"username\": \"hello\",\"address\": \"world\"}'"
      - name: GET users
        run: curl http://mongo:3001/api/users
```

Lastly, we can specify different containers for different steps

``` yaml
name: Docker
on: workflow_dispatch
jobs:
  docker-steps:
    runs-on: ubuntu-latest
    container:
      image: node:10.18.0-jessie
    steps:
      - name: Log node version
        run: node -v
      - name: Step with Docker
        uses: docker://node:12.14.1-alpine3.10
        with:
          entrypoint: /bin/echo
          args: Hello, World!
      - name: Log node version (with executable)
        uses: docker://node:12.14.1-alpine3.10
        with:
          entrypoint: /usr/local/bin/node
          args: -v
```
