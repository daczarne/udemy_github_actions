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
