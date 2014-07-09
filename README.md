pagemaker
=========

A module to combine the following modules into a 3d animating book created from [bookmaker](https://github.com/binocarlos/bookmaker) data.

 * [pageturner](https://github.com/binocarlos/pageturner) for the 3d turning pages
 * [bookbinding](https://github.com/binocarlos/bookbinding) for the book image background
 * [pagehammer](https://github.com/binocarlos/pagehammer) for touch even page turning

## installation

```
$ component install binocarlos/pagemaker
```

## example

Create a new book passing in [bookmaker](https://github.com/binocarlos/bookmaker) data:

```js
var PageMaker = require('pagemaker')
var data = {
	title:"My Cool Book",
	pages:[{
		title:"Intro",
		html:"<p>This is the first page</p>"
	},
	...]
}
var opts = {

}
var book = PageMaker(data, opts)
book.appendTo('#mybook')
```

## licence
MIT