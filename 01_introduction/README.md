# Introduction

GitHub Actions is a tool that allows you to automate development workflows. Each task is called an **action**. A combination of tasks is called a **workflow**. Workflows can be triggered in different ways: push, pull requests (opened and/or merged), issues (created, closed, etc), on a specific schedule, or due to external events.

The workflows will be run in a virtual machine on the GitHub servers. A workflow can contain one or more **jobs**, and each job will run in its own virtual machine. These virtual machines can use Linux, Windows, MacOS with different tools installed, and even run Docker Containers. Jobs can be run in parallel, or we can specify dependencies between them.

A **runner** is any virtual machine with the GitHub actions application installed. The runner is responsible for running the job whenever the triggering conditions are met, and for displaying back the results. You can use GitHub's runners, or host your own ones. GitHub hosted runners are maintained by GitHub, but we cannot customize the hardware configurations. They also come with some pre-installed tools like `curl`, `git`, `npm`, `yarn`, `pip`, etc, and languages like Python, Ruby, node.JS, etc.

## YAML

GitHub actions need to be written in YAML. This is a data serialization language. Just like JSON, YAML uses key:value paris. Keys must be followed by a colon, `:`. Values can be in different data types (strings, numbers, booleans, arrays, etc). Strings in YAML do not need quotations around them, unless there's a reserve character in the string, like a colon `:`.

``` yaml
name: Peter
age: 123
address: "Peter's street 235 apartment 1:23"
active: true
```

To create objects inside of objects in YAML we just need to indent the child object keys with 2 or 4 spaces with respect to its parent object. Keep in mind that, in YAML, tab indentations are not allowed, only spaces can be used. We can nest as many levels of objects as needed. We can also add JSON objects (with `{}`) as the value to a key. The keys in the objects don't need to be surrounded by quotes either.

``` yaml
key1: Peter
age: 123
address: "Peter's street 235 apartment 1:23"
active: true
food:
  favorite: pizza
  less-favorite: veggies
  other: { monday: soup, tuesday: ice cream, sundays: bread }
```

To declare arrays we start with the key in one line. In the subsequent lines we'll include the array elements. Each element must start with a dash, `-`, indented with 2 (or 4) spaces relative to the array key. Members of the array can be other objects too. Arrays can also be declared in JSON format (using `[]`).

``` yaml
friends:
  - Fiona
  - Roberta
  - Joe:
      like: false
```

Elements in the array can be objects. But these objects can have multiple key:value pairs. To declare them we just indent sub-sequent key:value pairs at the same level of indentation as the first element (the one preceded by the dash, `-`).

``` yaml
cake:
  - ingredients:
      - floor: "3 cups"
        water: "0.5 liters"
        salt: "just a pinch"
  - cook:
      - appliance: oven
        time: 145 hours
        temperature: 1000000 degrees
      - appliance: microwave oven
        time: 3 minutes
        temperature: who cares!
```

If we need to enter a long text that we want to break into multiple lines in the YAML file (for better readability), but in reality it should all be a single line, we can start the line with a single greater-than sign, `>`.

``` yaml
longText: >
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, vitae!
  Aspernatur esse ex eaque obcaecati fuga aperiam voluptatem nobis similique
  earum, pariatur praesentium? Voluptatibus ex recusandae facilis. Eos, veniam
  unde.
```

If we do want to preserve the new lines, then we add a pipe, `|`, instead of a greater-than sign.

``` yaml
longText: |
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, vitae!
  Aspernatur esse ex eaque obcaecati fuga aperiam voluptatem nobis similique
  earum, pariatur praesentium? Voluptatibus ex recusandae facilis. Eos, veniam
  unde.
```
