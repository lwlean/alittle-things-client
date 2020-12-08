#!node
const fs = require('fs');
const path = require('path');
const config = require('./config');
const http = require('http');

// "use strict"
/*
 * author: llw
 * change: 更改为可以提交文件，也可以提交一个字符串, 增加便利性
 */
(() =>{
	const param = process.argv[2];	
	let content = fs.existsSync(param) ? fs.readFileSync(path.resolve(param)) : param;
	uploadThings(content);
})();

function uploadThings(content) {
	try {
		content += '\n';
		const contentOfBase64 = Buffer.from(content.toString()).toString('base64');	
		const url = getUrl() + 'filename=' + createFileName() + '&content=' + contentOfBase64;
		console.log('final url:', url);
		const req = http.request(url, (res) => {
			res.on('data', (chunk) => {
				console.log('chunk: ', chunk);
			});
			res.on('end', () => {
				console.log('upthings over');
			});
		});

		req.on('error', function(e) {
			console.log('request cat error:', e);
		});
		
		req.end();
	} catch(e) {
		console.error('upload things error:', e);
	}
}


function createFileName() {
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = addZero(date.getMonth() + 1);
	const day = addZero(date.getDate());
	return year + month + day + '.md';	
}

function addZero(num) {
	const len = num.toString().length;
	if (len === 2) {
		return num.toString();
	}
	return '0' + num.toString()
}

function getUrl() {
	//const ip = config.localIp;
	const ip = config.yunIp; 
	return 'http://' + ip + ':' + config.port + '/' + config.domain + '/'; 
}
