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

PageMaker.prototype.build = function () {
  var self = this;

  this._book = PageTurner()
  this._binding = BookBinding()
  this._hammer = PageHammer()
  this._shadows = PageShadow()

  this.buildArrows()
  this.buildNav()
  
  this._book.on('render:book', function(elem){
    self._hammer.setup(elem)
  })
  this._hammer.on('swipe', function(side, direction){
    self._book.turnDirection(direction)
  })

  this._book.loadData(this._data)
  this._binding.appendChild(this._book.render())
  this._book.loadPage(0)
}

PageMaker.prototype.book = function () {
  return this._book
}

PageMaker.prototype.buildArrows = function () {
  this.arrows = this._arrows = PageArrows()
  this._arrows.on('render', function(elem, index){
    self.emit('arrows:render', elem, index)
  })
  this._arrows.on('click', function(side, direction){
    self.book.turnDirection(direction)
  })
  this._book.on('view:index', function(index, pageCount){
    self._arrows.setPage(index, pageCount)
  })
}

PageMaker.prototype.buildNav = function () {
  var self = this;
  this.nav = this._nav = PageNav()
  this._nav.setPages(this._data)
  this._nav.on('page', function(elem, index){
    self.emit('nav:page', elem, index)
  })
  this._nav.on('click', function(index){
    self._book.turnToPage(index)
  })
  this._book.on('view:index', function(index, pageCount){
    self._nav.setPage(index, pageCount)
  })
  this._nav.setPage(0)
}

PageMaker.prototype.render = function () {
  return this._binding.element
}

PageMaker.prototype.appendTo = function (target) {
  if (typeof target === 'string') target = document.querySelector(target)
  target.appendChild(this.render())
}