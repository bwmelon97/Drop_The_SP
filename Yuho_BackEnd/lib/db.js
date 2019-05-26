var mysql = require('mysql');
/* MySQL method 가져오기 */
var db = mysql.createConnection({
    host: 'localhost',       // 서버위치
    user: 'newUser',         // 유저 
    password: '111111',      // 비밀번호
    database: 'opentutorials'// 사용하려는 데이터베이스
});
/* 실제 접속 */
db.connect();
module.exports = db;