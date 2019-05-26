var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js'); //lib폴더의 template.js파일을 모듈로 사용
var db = require('./lib/db'); //lib폴더의 db.js파일을 모듈로 사용
var author = require('./lib/author'); //lib폴더의 author.js파일을 모듈로 사용

// Tip) topic.js 파일을 만들어서 코드 정리정돈이 가능하지만,
//      일단은 한 눈에 코드 확인 하려고 코드 정리정돈 하지 않았음 
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query; // query string
  var pathname = url.parse(_url, true).pathname; // pathname
  /* [1. 글 읽기] pathname: 없음 */
  if (pathname === '/') {
    /* [1-1] querystring_id : 없음 (홈 페이지) */
    if (queryData.id === undefined) {
      db.query(`SELECT * FROM topic`, function (error, topics) {
        var title = '글 작성하기';
        var list = template.list(topics);
        var html = template.MAIN(title, list,
          `<a href="/create">[글생성]</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    }
    /* [1-2] querystring_id : 있음 (리스트 클릭시) */
    else {
      db.query(`SELECT * FROM topic`, function (error1, topics) {
        if (error1) { // Error:console에 error표현 후 애플리케이션 중지
          throw error1;
        }
        // Tip) `SELECT * FROM topic WHERE id=${queryData.id}` : 공격당할 여지가 있음
        // Tip) `SELECT * FROM topic WHERE id=?`,[queryData.id] : 공격당할 내용을 세탁해 줌
        // MySQL의 SELECT + JOIN구문 실행, JOIN구문을 통해 저자에 대한 데이터 전달
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (error2, topic) {
          if (error2) { // Error:console에 error표현 후 애플리케이션 중지
            throw error2;
          }
          // topic 데이터는 '[topic{title:...}]' 이런 식으로 배열에 담기기 때문에 topic[0]으로 사용
          // ${topic[0].name}을 통해 저자 표시
          var title = topic[0].title;
          var description = topic[0].description;
          var html = template.POSTING(title,
            `
              <h2>${title}</h2>
              ${description}
              <p>by ${topic[0].name}</p>
            `,
            ` 
              <a href="/update?id=${queryData.id}">[글수정]</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="글삭제">
                </form>
            `
          );
          response.writeHead(200);
          response.end(html);
        })
      });
    }
  }

  /* [2. 글 생성] pathname: create */
  else if (pathname === '/create') {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      db.query('SELECT * FROM author', function (error2, authors) {
        var title = 'Create';
        // ${template.authorSelect(authors)}: select태그를 동적으로 생성하는 tamplate.js 내 함수
        var html = template.POSTING(title, // HTML코드를 post형태로 create_process로 전송
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="제목"></p>
            <p>
              <textarea name="description" placeholder="내용"></textarea>
            </p>
            <p>
              ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          ``
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  }

  /* [2. 글 생성] pathname: create_process */
  /* creat_process: creat-submit한 정보가 전달되는 공간 */
  else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body); // 포스팅 내용 분석
      db.query(`
          INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author], // MySQL의 INSERT구문 실행 (WHERE 필수!)
        function (error, result) { // 콜백함수
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` }); // 추가된 페이지로 Redirection
          response.end();
        }
      )
    });
  }

  /* [3. 글 수정] pathname: update */
  else if (pathname === '/update') {
    db.query('SELECT * FROM topic', function (error, topics) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
        if (error2) {
          throw error2;
        }
        // topic 데이터는 '[topic{title:...}]' 이런 식으로 배열에 담기기 때문에 topic[0]으로 사용
        db.query('SELECT * FROM author', function (error2, authors) {
          var html = template.POSTING(topic[0].title, // HTML코드를 post형태로 update_process로 전송

            `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
            ``
          );
          response.writeHead(200);
          response.end(html);
        });

      });
    });
  }

  /* [3. 글 수정] pathname: update_process */
  /* update_process: update-submit한 정보가 전달되는 공간 */
  else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body); // 포스팅 내용 분석
      db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
        [post.title, post.description, post.author, post.id], // MySQL의 UPDATE구문 실행 (WHERE 필수!)
        function (error, result) { // 콜백함수
          response.writeHead(302, { Location: `/?id=${post.id}` }); // 수정된 페이지로 Redirection
          response.end();
        })
    });
  }

  /* [4. 글 삭제] pathname: delete_process */
  else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body); // 포스팅 내용 분석
      db.query('DELETE FROM topic WHERE id = ?',
        [post.id], // MySQL의 DELETE구문 실행 (WHERE 필수!)
        function (error, result) { // 콜백함수
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/` }); // 홈 페이지로 Redirection
          response.end();
        });
    });
  }

  /* [5. 저자 관리] pathname: author */
  else if(pathname === '/author'){
    author.home(request, response);
  }

  /* [6. 저자 생성] pathname: author/creat_process */
  /* author/creat_process: author-create-submit한 정보가 전달되는 공간 */
  else if(pathname === '/author/create_process'){
    author.create_process(request, response);
  }

  /* [7. 저자 수정] pathname: author/update */
  else if(pathname === '/author/update'){
    author.update(request, response);
  } 
  
  /* [7. 저자 수정] pathname: author/update_process */
  /* author/update_process: author-update-submit한 정보가 전달되는 공간 */
  else if(pathname === '/author/update_process'){
    author.update_process(request, response);
  }

  /* [8. 저자 삭제] pathname: author/delete_process */
  /* author/delete_process: delete누른 정보가 전달되는 공간 */
  else if(pathname === '/author/delete_process'){
    author.delete_process(request, response);
  } 

  /* [9. 아직 구현 안 한 페이지] pathname: dapanda || carpool */
  else if(pathname === '/dapanda' || pathname === '/carpool'){
    var comment = (pathname==='/dapanda')? 
      `데이터베이스를 하나 더 만들어야 해서 아직 안 했습니다...` : `카풀페이지는 아직은 구현 할 필요가 없어서...`;
    var html =
      `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - Not found</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h2><a href="/">[잉력시장]</a> <a href="/dapanda">[다판다]</a> <a href="/carpool">[카풀]</a></h2>
        <p>"아직 구현하지 않은 페이지입니다"</p> <br>
        <p>*Cause: ${comment}</p>
        <p>*Pathname: ${pathname}</p>
      </body>
      </html>
      `
    ;
    response.writeHead(200);
    response.end(html);
  }


  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);