---
title: Hello
---

pagemaker
=========

merge together markdown with front-matter and a mustache template

## example

Convert a markdown page into a HTML page using the standard template

The markdown (index.md):

```markdown
---
title: my page
var: 10
---

This is the content of the page
```

The Template (template.html):

```html
<html>
<title>{{ title }}
<body data-var="{{ var }}">
{{ body }}
</body>
</html>
```

Output a HTML page based on the 2:

First by piping via the shell:

```
$ cat input.md | pagemaker convert -t template.html > index.html
```

Or by explicitly naming the input and output:

```
$ pagemaker convert -t template.html index.md index.html
```

## installation

```
$ sudo npm install pagemaker -g
```

## Commands

### convert

```
convert [infile] [outfile]
```

Takes a markdown with front matter and a mustache template and outputs HTML of the two rendered together

If the infile is unspecified then stdin is used.
If the outfile is unspecified then stdout is used.

## licence
MIT

