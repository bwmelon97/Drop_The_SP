var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
 
exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error,topics){
        db.query(`SELECT * FROM author`, function(error2,authors){
            var title = 'author';
            var html =
            `
            <!doctype html>
            <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <p><a href="/">< 홈으로</a></p>
                    <p>"현재 등록된 저자 목록입니다"</p>
                    ${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse: collapse;
                        }
                        td{
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p>
                            <input type="text" name="name" placeholder="저자이름">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="소개"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                </body>
            </html>
            `
            ;
            response.writeHead(200);
            response.end(html);
        });
    });
}
 
exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            INSERT INTO author (name, profile) 
              VALUES(?, ?)`,
            [post.name, post.profile], // MySQL의 INSERT구문 실행
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
          )
      });
}

exports.update = function(request, response){
    db.query(`SELECT * FROM topic`, function(error,topics){
        db.query(`SELECT * FROM author`, function(error2,authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error3,author){
                var title = 'author';
                var list = template.list(topics);
                var html =
                `
                <!doctype html>
                <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <p><a href="/">< 홈으로</a></p>
                        <p>"현재 등록된 저자 목록입니다"</p>
                        ${template.authorTable(authors)}
                        <style>
                            table{
                                border-collapse: collapse;
                            }
                            td{
                                border:1px solid black;
                            }
                        </style>
                        <form action="/author/update_process" method="post">
                            <p>
                                <input type="hidden" name="id" value="${queryData.id}">
                            </p>
                            <p>
                                <input type="text" name="name" value="${author[0].name}" placeholder="저자이름">
                            </p>
                            <p>
                                <textarea name="profile" placeholder="소개">${author[0].profile}</textarea>
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                    </body>
                </html>
                `;
                response.writeHead(200);
                response.end(html);
            });
             
        });
    });
}
 
exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id], // MySQL의 UPDATE구문 실행 (WHERE 필수!)
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
          )
      });
}

exports.delete_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          /* 저자 삭제 */
          db.query(
            `DELETE FROM topic WHERE author_id=?`,
            [post.id], // MySQL의 DELETE구문 실행 (WHERE 필수!)
            function(error1, result1){
                if(error1){
                    throw error1;
                }
                /* 저자가 쓴 topic도 삭제 */
                db.query(`
                    DELETE FROM author WHERE id=?`,
                    [post.id], // MySQL의 DELETE구문 실행 (WHERE 필수!)
                    function(error2, result2){
                        if(error2){
                            throw error2;
                        }
                        response.writeHead(302, {Location: `/author`});
                        response.end();
                    }
                )
            }
        );
      });
}