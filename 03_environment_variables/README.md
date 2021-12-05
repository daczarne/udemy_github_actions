# Environment variables

GitHub Actions already come with some built in environment variables, but we can define our own as well. To declare our own variables we need to use the `env` key at the start of our workflow. This key takes as its value a list of key:value pairs, where the keys are the names of the environment variables that we are declaring, and its value is the value of the variable.

``` yaml
name: Environment Variables (workflow scope)
on: push
env:
  WF_ENV: Available to all jobs
```

After that we can just write our `jobs` as we would normally do. To access the variables we just need to use the `${ VAR_NAME }` syntax.

``` yaml
name: Environment Variables (workflow scope)
on: push
env:
  WF_ENV: Available to all jobs
jobs:
  log-env:
    runs-on: ubuntu-latest
    steps:
      - name: Log ENV variables
        run: |
          echo "WF_ENV: ${WF_ENV}"
```

By default, environment variables are available to all jobs. But we can declare variables that are only available to certain jobs in our workflow. To do that, we need to include the `env` key in the specific job

``` yaml
name: Environment Variables (job scope)
on: workflow_dispatch
env:
  WF_ENV: Available to all jobs
jobs:
  log-env:
    runs-on: ubuntu-latest
    env:
      JOB_ENV: Available to steps in our log-env job
    steps:
      - name: Log ENV variables
        run: |
          echo "WF_ENV: ${WF_ENV}"
          echo "JOB_ENV: ${JOB_ENV}"
```

We can even declare environment variable that are only accessible to one step. Again, to do so, we add the `env` key in the specific `step` for which we want the variables to be available, and create a list of them using key:value pairs.

``` yaml
name: Environment Variables (step scoped)
on: workflow_dispatch
env:
  WF_ENV: Available to all jobs
jobs:
  log-env:
    runs-on: ubuntu-latest
    env:
      JOB_ENV: Available to steps in our log-env job
    steps:
      - name: Log ENV variables
        env:
          STEP_ENV: Available to only this step
        run: |
          echo "WF_ENV: ${WF_ENV}"
          echo "WF_ENV: ${JOB_ENV}"
          echo "WF_ENV: ${STEP_ENV}"
```
