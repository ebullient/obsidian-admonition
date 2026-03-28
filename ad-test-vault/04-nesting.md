# Nesting

## Nested admonitions

Increase the backtick count for each nesting level. The outer block needs more backticks than the inner block.

`````ad-note
title: Outer admonition
collapse: open

This is in the outer admonition.

````ad-warning
title: Nested warning
This is nested one level deep.

```ad-danger
title: Double-nested danger
collapse: closed
This is nested two levels deep (collapsed).
```

````

Back in the outer admonition.
`````

---

## Code blocks inside admonitions

### Using extra backticks

Increase the outer admonition's backtick count to accommodate an inner code block.

````ad-info
title: Code block with extra backticks

```javascript
console.log("Hello from inside an admonition!");
```

````

### Using `~~~` tilde fences

For a single nesting level, use tilde fences for the inner code block — no backtick counting needed.

```ad-tip
title: Code block with tilde fences

~~~python
def hello():
    return "Hello from inside an admonition!"
~~~

```

---

## Embedded notes

An embed (`![[note]]`) inside an admonition renders the target note's content inline, including any admonition blocks it contains.

```ad-note
title: Embed of plain content
![[embedded-content#Plain text section]]
```

Embedded content that itself contains admonition blocks renders correctly:

```ad-note
title: Embed of admonition-containing content
![[00-index#Quick Syntax Reference]]
```

---

## Mixed: nested admonitions with code blocks

`````ad-example
title: Mixed nesting
collapse: open

Introductory text.

````ad-bug
title: Bug with code
Here is the offending code:

~~~javascript
throw new Error("Oops!");
~~~

````

```javascript
// This code block is in the outer admonition
console.log("Outer level code");
```

`````
