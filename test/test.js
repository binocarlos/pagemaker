var PageMaker = require('../src');
var fs = require('fs');

describe('PageMaker', function(){

  it('should extract data', function(done) {
    var page = new PageMaker({
    	infile:__dirname + '/test.md'
    });

    page.extract(function(error, data){
    	data.hello.should.equal('world');
    	data.body.should.equal("<p>123</p>\n");
    	done();
    })
    
  })

  it('should convert pages', function(done) {
    var page = new PageMaker({
    	infile:__dirname + '/test.md',
    	outfile:__dirname + '/test.html',
    	template:__dirname + '/template.html'
    });

    page.convert(function(error, output){
  		output.should.equal("world\n<p>123</p>\n");
      fs.unlink(__dirname + '/test.html', done);
    })
    
  })


})
