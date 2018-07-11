// 能够开启http服务 引入http模块
let http = require("http");

// 生成路径 path
let path = require("path");

// 引入文件系统
let fs = require("fs");

// require mime模块 第三方模块
let mime = require("mime");

// 引入 querystring 模块 
let querystring = require('querystring');

// 配置网站的根目录
let rootPath = path.join(__dirname, "www");
// console.log('根目录是:',rootPath);

// 开启服务
http
  .createServer((request, response) => {
    // 根据请求的url 生成静态资源服务器中的绝对路径 c:no
    // C:\Users\51772\Desktop\深圳前端就业19期\02-Node{}\04-源代码\03.Apache_plus\www\index.html
    // C:\Users\51772\Desktop\深圳前端就业19期\02-Node{}\04-源代码\03.Apache_plus\www\css\
    let filePath = path.join(rootPath, querystring.unescape(request.url));
    console.log(filePath);

    // 判断访问的这个目录(文件)是否存在
    let isExist = fs.existsSync(filePath);
    // 如果存在(文件还是文件夹?)
    if (isExist) {
      // 只有存在才需要继续走
      // 生成文件列表
      fs.readdir(filePath, (err, files) => {
        // 不是文件夹 就回出错 只能是文件了
        if (err) {
          // console.log(err);
          // console.log('不是文件夹');
          // 能够进到这里 说明是文件
          // 读取文件 返回读取的文件
          fs.readFile(filePath, (err, data) => {
            if (err) {
              // console.log(err);
            } else {
              // 直接返回
              // console.log(filePath);
              // if(filePath.indexOf('jpg')!=-1){
              //   response.writeHead(200,{
              //     'content-type':'image/jpeg'
              //   })
              // }else if(filePath.indexOf('js')!=-1){
              //   response.writeHead(200,{
              //     'content-type':'application/x-javascript'
              //   })
              // }
              // console.log(mime.getType(filePath));
              response.writeHead(200, {
                "content-type": mime.getType(filePath)
              });

              // 判断文件类型是什么 设置不同的mime类型返回给浏览器

              response.end(data);
            }
          });
        }
        // 如果是文件夹
        else {
          console.log(files);
          // 直接判断是否存在首页
          if (files.indexOf("index.html") != -1) {
            console.log("有首页");
            // 读取首页即可
            fs.readFile(path.join(filePath, "index.html"), (err, data) => {
              if (err) {
                console.log(err);
              } else {
                response.end(data);
              }
            });
          }
          // 如果没有首页
          else {
            // 没有首页
            let backData = "";
            for (let i = 0; i < files.length; i++) {
              // 根目录 request.url => /
              // 默认拼接的都是 ./ 只能访问根目录
              // 根据请求的url 进行判断 拼接上一级目录的地址 进行即可进行访问
              backData += `<h2><a href="${
                request.url == "/" ? "" : request.url
              }/${files[i]}">${files[i]}</a></h2>`;
            }
            response.writeHead(200, {
              "content-type": "text/html;charset=utf-8"
            });
            response.end(backData);
          }
        }
      });
    }
    // 如果不存在 返回404
    else {
      // 不存在 返回 404
      response.writeHead(404, {
        "content-type": "text/html;charset=utf-8"
      });
      // 响应跟 Apache一样的错误信息 并返回
      response.end(`
                <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                <html><head>
                <title>404 Not Found</title>
                </head><body>
                <h1>Not Found</h1>
                <p>The requested URL /index.hththt was not found on this server.</p>
                </body></html>
        `);
    }
  })
  .listen(80, "127.0.0.1", () => {
    console.log("开始监听 127.0.0.1:80");
  });

/*
  mime类型
*/
