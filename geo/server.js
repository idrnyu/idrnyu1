// const http = require('http'); //引入HTTP
// // 创建一个服务器
// // 回调匿名函数： request 请求体 response 响应体
// http.createServer((request, response) => {
//     //返回请求成功 200 返回请求头类型
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end('Hello World\n');
// }).listen(8124);
// // 监听服务器端口和地址

// console.log('Server running at http://192.168.1.103:8124/');



const PORT = 8888; //访问端口号8888  //端口号最好为6000以上
var http = require('http'); //引入http模块
var fs = require('fs'); //引入fs模块
var url = require('url'); //引入url模块
var path = require('path'); //引入path模块

// req : 从浏览器带来的请求信息
// res : 从服务器返回给浏览器的信息
var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    //客户端输入的url，例如如果输入localhost:8888/index.html，那么这里的url == /index.html 
    //url.parse()方法将一个URL字符串转换成对象并返回，通过pathname来访问此url的地址。

    var realPath = path.join('C:/Users/idrnyu/Desktop/geo/GD_Geo.html', pathname);

    //完整的url路径
    console.log(realPath);
    // F:/nodejs/nodetest/index.html

    fs.readFile(realPath, function(err, data) {
        /*
        realPath为文件路径
        第二个参数为回调函数
          回调函数的一参为读取错误返回的信息，返回空就没有错误
          二参为读取成功返回的文本内容
        */
        if (err) {
            //未找到文件
            res.writeHead(404, {
                'content-type': 'text/plain'
            });
            res.write('404,页面不在');
            res.end();
        } else {
            //成功读取文件
            res.writeHead(200, {
                'content-type': 'text/html;charset="utf-8'
            });
            res.write(data);
            res.end();
        }
    });
});
server.listen(PORT); //监听端口

// 获取本机IPv4地址
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
var IPv4Add = getIPAdress();
console.log('服务成功开启');
console.log('Server running at http://'+IPv4Add+':'+PORT+'/');
console.log(IPv4Add);