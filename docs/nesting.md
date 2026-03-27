# Nesting Admonitions

You can nest admonitions by increasing the number of backticks. A nested admonition is created by enclosing a new set of backticks inside an existing admonition.

For example:

``````md
`````ad-note
title: Nested Admonitions
collapse: open

Hello!

````ad-note
title: This admonition is nested.
This is a nested admonition!

```ad-warning
title: This admonition is closed.
collapse: close
```

````

This is in the original admonition.
`````
``````

## Rendering Code Blocks

To nest code blocks inside admonitions, increase the number of backticks similarly. Alternatively, for a single layer, you can use the `~~~` markdown code block syntax.

`````md
````ad-info

```ad-bug
title: I'm Nested!
~~~javascript
throw new Error("Oops, I'm a bug.");
~~~
```

```javascript
console.log("Hello!");
```

````
`````

![Nested Code](https://github.com/javalent/admonitions/blob/main/publish/images/nested-code.png?raw=true)
