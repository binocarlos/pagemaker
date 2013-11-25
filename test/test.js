var PageMaker = require('../src');
var fs = require('fs');

describe('PageMaker', function(){

  it('should extract data', function(done) {
    var page = new PageMaker({
    	infile:__dirname + '/test.md'
    });

    page.extract(function(error, data){
    	data.hello.should.equal('world');
    	data.html.should.equal("<p>123</p>\n");
      data.body.should.equal("\n123");
    	done();
    })
    
  })

  it('should convert pages', function(done) {
    var page = new PageMaker({
    	infile:__dirname + '/test.md',
    	outfile:'silent',
    	template:__dirname + '/template.html'
    });

    page.convert(function(error, output){
  		output.should.equal("world\n<p>123</p>\n");
      done();
    })
    
  })


})
