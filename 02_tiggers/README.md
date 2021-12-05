# Triggers

## Triggering a workflow

Workflows can be triggered with different events. These events can be any GitHub event: push, pull-requests opened or closed, comments, etc. Triggers must be specified in the `on` key of the `yaml`. We can pass a single value:

``` yaml
name: Actions workflow
on: push
```

We can also pass an array of values to the `on` key. The workflow will trigger whenever one of the events occurs.

``` yaml
name: Actions workflow
on: [push, pull_request]
```

Some events have *activity types*. We can specify the activity types of a trigger by passing an array to each element of the `on` key object. Events that have activity types will have some of those set by default. For example, if we trigger a workflow `on: pull_request`, the workflow will be triggered on `opened`, `synchronized`, or `reopened` by default.

``` yaml
name: Actions workflow
on:
  push:
  pull_request:
    types: [assigned, opened, synchronized, reopened]
```

The complete events documentation can be found [here](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows).

## Scheduling a trigger

To trigger workflows on a certain schedule, we can use cron jobs scheduling. Scheduling needs to be added by passing the `schedule` value to the `on` key. This should be an array. Each element of the array needs to contain an object with a key of `cron`. The value of this key needs to be a string representing a cron expression. Cron expressions contain 5 elements:

1. minutes
2. hours
3. day of month
4. month
5. day of the week (0 - Sunday, ..., 6 - Saturday)

Each of the elements of a cron expression need to be a valid number or symbol. The `*` means *any value*. For example, the expression `"* * * * *"` means any minute, of any hour, of any day of the month, of any month, of any day of the week. Basically, the workflow will re-run at the start of every minute. If we change it to `"1 * * * *"` then the workflow will run at the start of the first minute of every hour (or, in more simple terms, once per hour). You can use [crontab guru](https://crontab.guru/) to build cron job expressions.

All times generated in cron expressions are measured in UTC time. And we can have more than one in each workflow. The minimum time interval for GitHub action workflows is every 5 minutes.

``` yaml
name: Actions workflow
on:
  schedule:
    - cron: "0/5 * * * *"
    - cron: "0/6 * * * *"
  pull_request:
    types: [assigned, opened, synchronized, reopened]
```

## Triggering on external events

To trigger workflows manually we pass the `workflow_dispatch` to the `on` key. We can also trigger workflows on external events. To do so we need to use the `repository_dispatch` value, and specify which activity types

``` yaml
name: Actions workflow
on:
  workflow_dispatch:
  repository_dispatch:
    types: [build]
```

These dispatch requests need to come to the API endpoint `http://api.github/repos/user_name/repo_name/dispatches`. They need to be `POST` requests with the HEADERS `Accept: application/vmd.github.everest-preview+json`, and `Content-Type: application/json`. The body of the request needs to be a JSON object with an `event_type` that matches at least one activity type for that trigger.

``` json
{
  "event_type": "build"
}
```

Additionally, these requests need to be authenticated. This requires that the request has some authorization header with a valid PAT. The PAT must have a repo scope.

We can also add some `client_payload` for the workflow. This payload could, for example, be inputs needed during the jobs.

``` json
{
  "event_type": "build",
  "client_payload": {
    "env": "production"
  }
}
```

This payload will be available in the `github` object on the workflow. To access it, we use the `event.client_payload.key` attribute.

``` yaml
name: Actions workflow
on:
  workflow_dispatch:
  repository_dispatch:
    types: [build]
jobs:
  run-github-actions:
    runs-on: ubuntu-latest
    steps:
      - name: Payload
        run: echo ${{ github.event.client_payload.env }}
```

This can be very useful when we want to trigger workflows in one repository, based on workflows from another repository.

## Filtering workflow triggers

Workflow triggers can be filtered so that they only run when certain branches, files (paths), tags, etc are affected. To achieve this we need to add more key:value pairs to the `on` key. For example, if we want a workflow to only run when there are pushes to the main branch we use:

``` yaml
name: Workflow name
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

Likewise, of we want a workflow to only trigger when the branch is asking to merge onto the main branch we use:

``` yaml
name: Workflow name
on:
  pull_request:
    branches:
      - main
```

Branches don't necessarily need to be specified by names. They can also be patterns. Patterns of the form `'something/*'` will only match branches that start with `something`, followed by a slash, `/`, followed by some other text, but not by additional slashes. So, for example, the pattern `'feature/*'` will match with branches `'feature/feature-A'` and `'feature/feature-B'`, but not with `'feature/feature-A/task-1'`. To match this branches we need to use `'something/**'`. To summarize, `/*` matches any string except the forward slash, while `/**` matches all strings, including the forward slash.

``` yaml
name: Workflow name
on:
  pull_request:
    branches:
      - main
      - 'feature/**'
```

You can find all possible patters [here](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet).

We can also set the trigger to ignore branches by using the `branches-ignore` key.

``` yaml
name: Workflow name
on:
  pull_request:
    branches-ignore:
      - main
```

We cannot have `branches` and `branches-ignore` at the same time. But we can ignore specific branches by adding an exclamation mark in the `branches` key.

``` yaml
name: Workflow name
on:
  pull_request:
    branches:
      - main
      - '!feature/feature-C'
```

We can also target specific tags in the same way as we do with branches. We can use the `tags` and `tags-ignore` keys to specify tags or patterns of tags to include or ignore, and we can use the exclamation sign to exclude specific tags.

``` yaml
name: Workflow name
on:
  push:
    tags:
      - v1
      - v1.*
      - '!v2'
```

Finally, we can filter the triggers by paths (files). For example, if we want our workflow to trigger whenever a JavaScript file is changed we would use:

``` yaml
name: Workflow name
on:
  push:
    paths:
      - '**.js'
      - '!file/path.js'
```

There's also a `paths-ignore` option. We cannot use both `paths` and `paths-ignore` in the same workflow.
