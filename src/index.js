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
var fm = require('front-matter');
var marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: ''
})


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
		data:function(next){
			self.extract(next);
		}
	}, function(error, values){
		if(error){
			console.error(error);
			process.exit();
		}
		
		if(!values.template){
			console.error('no template found');
			process.exit();
		}

		var output = Mustache.render(values.template, values.data);

		self.write_output(output, done);
	})
}

PageMaker.prototype.extract = function(done){
	var self = this;
	async.parallel({
		infile:function(next){
			self.read_infile(next);
		},
		datafile:function(next){
			self.read_data(next);
		}
	}, function(error, files){

		if(error){
			console.error(error);
			process.exit();
		}

		if(!files.infile){
			console.error('no content found');
			process.exit();
		}

		if(!files.datafile){
			console.error('no data found');
			process.exit();
		}

		var frontmatter = fm(files.infile);
		var matterdata = frontmatter.attributes;

		marked(frontmatter.body, function (err, html){
			if(err){
				console.error(error);
				process.exit();
			}

			var view = files.datafile;

			Object.keys(matterdata || {}).forEach(function(key){
				view[key] = matterdata[key];
			})

			view.body = html;

			done(null, view);
		})		
	})
}

PageMaker.prototype.read_data = function(done){
	var file = this.options.datafile;

	if(!file){
		done(null, {});
		return;
	}

  if(file.charAt(0)!='/'){
    file = path.normalize(process.cwd() + '/' + file);
  }

  fs.readFile(file, 'utf8', function(error, data){
  	data = JSON.parse(data);
  	done(error, data);
  });
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