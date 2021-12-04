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
