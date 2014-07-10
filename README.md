pagemaker
=========

A module to combine the following modules into a 3d animating book created from [bookmaker](https://github.com/binocarlos/bookmaker) data.

 * [pageturner](https://github.com/binocarlos/pageturner) for the 3d turning pages
 * [bookbinding](https://github.com/binocarlos/bookbinding) for the book image background
 * [pagehammer](https://github.com/binocarlos/pagehammer) for touch event page turning
 * [pagenav](https://github.com/binocarlos/pagenav) for the navbar
 * [pagearrows](https://github.com/binocarlos/pagearrows) for back/next arrows
 * [pageshadow](https://github.com/binocarlos/pageshadow) for page shadows

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

// the book, nav and arrows are seperate elements you can append to your gui
book.appendTo('#mybook')
book.nav.appendTo('#navholder')
book.arrows.appendTo('#mybook')
```

## licence
MIT