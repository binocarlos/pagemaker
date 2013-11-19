pagemaker
=========

merge together markdown with front-matter and a mustache template

the one-liner for simple node.js projects

```
pagemaker convert -i README.md -d package.json -o index.html
```

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

## help

```
  Usage: pagemaker [options] [command]

  Commands:

    convert [infile] [outfile] create a HTML page from a markdown input
    *

  Options:

    -h, --help                  output usage information
    -t, --template <path|name>  the template to use
    -d, --datafile <path>       use a json file (e.g. package.json) as the base data
    -i, --infile <path>         the input markdown file - stdin is default
    -o, --outfile <path>        the output HTML file - stdout is default
    -V, --version               output the version number

```

## licence
MIT

