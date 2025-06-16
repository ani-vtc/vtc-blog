---
tags:
  - SID
---

## Architecture

[[SID Database Diagram]]

```mermaid
graph TD

A[React Frontend]
B[Express Backend]
C[Internal Backend]
D[Database]

A --> B
B --> C
C --> D

class A,B,C,D internal-link;
```




[[SID Database/React Frontend|React Frontend]]
[[Vancouver School Space Finder/Express Backend]]
[[Internal Backend]]
[[Database]]