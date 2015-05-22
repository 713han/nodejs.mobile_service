var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile('/home/nodejs/testService/log1.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
        for(var key in result.testsuites.testsuite){
        	console.log(result.testsuites.testsuite[key]);
        	for(var casekey in result.testsuites.testsuite[key].testcase){
        		if(result.testsuites.testsuite[key].testcase[casekey].failure){
        			console.log(result.testsuites.testsuite[key].testcase[casekey].failure);
        		}
        	}
        }
    });
});