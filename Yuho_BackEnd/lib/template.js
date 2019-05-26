module.exports = {

  /* 메인페이지 */
  MAIN:function(title, list,control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h2><a href="/">[잉력시장]</a> <a href="/dapanda">[다판다]</a> <a href="/carpool">[카풀]</a></h2>
      <p>"내 게시글 관리"</p>
      ${list}
      ${control}
    </body>
    </html>
    <a href="/author">[저자관리]</a>
    `;
  },

  /* 글 리스트 클릭 시 포스팅 페이지 출력 */
  POSTING:function(title,body,control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <p><a href="/">< 뒤로가기</a></p>
      ${control}
      ${body}
    </body>
    </html>
    `;
  }
  ,

  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },

  authorSelect:function(authors, author_id){ // 저자 선택을 위한 select 태그 동적으로 삽입
    var tag = '';
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors[i].id === author_id) { // 데이터베이스 내 authors[i].id와, 웹 페이지의 author_id가 같다면 'selected' 삽입
        selected = ' selected';
      }
      // 'selected' 를 삽입 하면, selected된 요소가 화면에 제일 먼저 표시됨
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  },

  authorTable:function(authors){ // 저자를 나타내는 표 동적으로 삽입
    var tag = '<table>'; // table 태그를 사용하면 표 생성 가능
    var i = 0;
    while(i < authors.length){ // TIP) delete는 절대로 링크형태로 하면 안된다!! 꼭 form-post 방식으로 해야한다!!
        tag += `
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">[수정하기]</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}">
                    <input type="submit" value="삭제하기">
                  </form>
                </td>
            </tr>
            `
        i++;
    }
    tag += '</table>';
    return tag;
  }

}