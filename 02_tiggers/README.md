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
