# Mermaid Diagrams

## All collapse states

### No collapse

````ad-note
title: Mermaid (non-collapsed)
No `collapse:` parameter.

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Check the collapse setting]
```

````

---

### collapse: open

````ad-note
title: Mermaid (collapse: open)
collapse: open

```mermaid
sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi there!
```

````

---

### collapse: closed

The diagram renders after expanding the admonition.

````ad-warning
title: Mermaid (collapse: closed)
collapse: closed

```mermaid
graph LR
    A --> B --> C
```

````

---

### collapse: none

````ad-info
title: Mermaid (collapse: none)
collapse: none

```mermaid
pie title Languages
    "TypeScript" : 80
    "Svelte" : 15
    "CSS" : 5
```
````

---

## Mermaid + embeds

### Embed alone (baseline)

```ad-note
title: Embed without mermaid
![[embedded-content#Plain text section]]
```

---

### Mermaid and embed in the same admonition

````ad-note
title: Mermaid and embed together

![[embedded-content#Plain text section]]

```mermaid
graph LR
    A --> B
```

````
