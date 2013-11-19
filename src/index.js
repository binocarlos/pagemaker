/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var Mustache = require('Mustache');
var async = require('async');
var path = require('path');

/*

	template | 'simple'
	infile | stdin
	outfile | stdout
	
*/
function PageMaker(options){
	EventEmitter.call(this);
	this.options = options || {};
}

util.inherits(PageMaker, EventEmitter);

module.exports = PageMaker;

PageMaker.prototype.convert = function(done){
	var self = this;
	async.parallel({
		template:function(next){
			self.read_template(next);
		},
		infile:function(next){
			self.read_infile(next);
		}
	}, function(error, files){

		if(error){
			console.error(error);
			process.exit();
		}
		
		if(!files.template){
			console.error('no template found');
			process.exit();
		}

		if(!files.infile){
			console.error('no content found');
			process.exit();
		}

		self.write_output(files.infile, function(){
			process.exit();
		})
	})
}

PageMaker.prototype.read_template = function(done){
	var template = this.options.template || 'simple';

  if(template.charAt(0)=='.'){
    template = path.normalize(process.cwd() + '/' + template);
  }
  else if(template.charAt(0)!='/'){
    template = path.normalize(__dirname + '/../templates/' + template + '/index.html');
  }

  fs.readFile(template, 'utf8', done);
}

PageMaker.prototype.read_infile = function(done){
	if(this.options.infile){
		fs.readFile(this.options.infile, 'utf8', done);
	}
	else{
		var infile = '';
  
    process.stdin.on('data', function(data){
      infile += data;
    })

    process.stdin.on('close', function(){
    	done(null, infile);
    })
	}
}

PageMaker.prototype.write_output = function(content, done){
	if(this.options.outfile){
		fs.writeFile(this.options.outfile, content, 'utf8', done);
	}
	else{
		process.stdout.write(content);
	}
}