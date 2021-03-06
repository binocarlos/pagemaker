var Emitter = require('emitter')
var BookBinding = require('bookbinding')
var PageTurner = require('pageturner')
var PageHammer = require('pagehammer')
var PageArrows = require('pagearrows')
var PageNav = require('pagenav')
var PageShadow = require('pageshadow')

module.exports = PageMaker;

var defaults = {
  
}

function PageMaker (data, opts) {
  if (!(this instanceof PageMaker)) return new PageMaker(data, opts);
  opts = opts || {}
  Object.keys(defaults || {}).forEach(function(key){
    if(!opts[key]){
      opts[key] = defaults[key]
    }
  })
  this._data = data || []
  this._opts = opts
  this.build()
}

Emitter(PageMaker.prototype)

function sortArgs(a){
  var args = Array.prototype.slice.call(a, 0);
  return args.sort();
}

PageMaker.prototype.build = function () {
  var self = this;

  this._book = PageTurner()
  this._binding = BookBinding()
  this._hammer = PageHammer()
  this._shadows = PageShadow(this._book)
  this.buildArrows()
  this.buildNav()

  this._book.on('render:book', function(elem){
    self._hammer.setup(elem)
  })

  this._hammer.on('swipe', function(side, direction){
    self._book.turnDirection(direction)
  })

  var evnames = [
    'render:leaf',
    'data',
    'view:index',
    'view:leaf',
    'turn:start',
    'turn:end'
  ]
  evnames.forEach(function(name){
    self._book.on(name, function(){
      var args = sortArgs(arguments)
      self.emit.apply(self, [name].concat(args))
    })
  })
}

PageMaker.prototype.load = function (data) {
  var self = this;

  this._data = data

  this._nav.buildPages(this._data)
  this._nav.setPage(0)
  this._book.loadData(this._data)
  this._binding.appendChild(this._book.render())
  this._book.loadPage(0)
}

PageMaker.prototype.book = function () {
  return this._book
}

PageMaker.prototype.buildArrows = function () {
  var self = this;
  this.arrows = this._arrows = PageArrows(this._opts.arrows || {})
  this._arrows.on('render', function(elem, side){
    self.emit('arrows:render', elem, side)
  })
  this._arrows.on('click', function(side, direction){
    self._book.turnDirection(direction)
  })
  this._book.on('view:index', function(index, pageCount){
    self._arrows.setPage(index, pageCount)
  })
}

PageMaker.prototype.buildNav = function () {
  var self = this;
  this.nav = this._nav = PageNav(this._opts.nav || {})
  
  this._nav.on('page', function(elem, index){
    self.emit('nav:page', elem, index)
  })
  this._nav.on('click', function(index){
    self._book.turnToPage(index)
  })
  this._book.on('view:index', function(index, pageCount){
    self._nav.setPage(index, pageCount)
  })

}

PageMaker.prototype.render = function () {
  return this._binding.element
}

PageMaker.prototype.appendTo = function (target) {
  if (typeof target === 'string') target = document.querySelector(target)
  target.appendChild(this.render())
}

PageMaker.prototype.remove = function () {
  this._binding.element.parentNode.removeChild(this._binding.element)
  this.arrows.remove()
  this.nav.remove()
}