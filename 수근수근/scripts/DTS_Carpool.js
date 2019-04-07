
// Calendar 객체 생성 (현재 날짜 기준)
var Calendar = new Date();

// get_메서드를 통해 받은 값을 사람이 쓰는 표현으로 바꿈
var day_of_week = ['일', '월', '화', '수', '목', '금', '토'];
var month_of_year = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

var year = Calendar.getFullYear();  // YYYY
var month = Calendar.getMonth();    // 월 (0 ~ 11)
var today = Calendar.getDate();     // 현재 날짜
var weekday = Calendar.getDay();    // 요일 (0 ~ 6)

Calendar.setDate(1);    // 1일부터 표시할 것

const DAYS_OF_WEEK = 7;
const DAYS_OF_MONTH = 31;
var str;    // html 코드를 담을 string

// 사용할 html 태그들
var TR_start = "<tr>";
var TR_end = "</tr>";

var TD_week_start = "<td class='week'>";
var TD_blank_start = "<td class='blank'>";
var TD_today_start = "<td class='today'>";
var TD_day_start = "<td class='day'>";
var TD_saturday_start = "<td class='saturday'>";
var TD_sunday_start = "<td class='sunday'>";
var TD_end = "</td>";
////////////////////////////

// 캘린더 + 년월 정보 까지 감싸는 테이블
str = "<table width = 500px border=1 cellspacing=0 cellpadding=0 bordercolor=bbbbbb><tr><td style='text-align: center'>";
str += "<strong>" + year + "." + month_of_year[month] + "</strong>"; // YYYY.MM

// 캘린더 테이블 (요일, 날짜 테이블)
str += "<table class = 'calendar' border = 0 cellspacing=0 cellpadding=2>";

// 요일을 담은 행
str += TR_start;
for(var i = 0; i < DAYS_OF_WEEK; i++){
    str += TD_week_start + day_of_week[i] + TD_end;
}
str += TR_end;

// 1일 전까지는 blank 처리
for(var i = 0; i < Calendar.getDay(); ++i){
    str += TD_blank_start + TD_end;
}

// table cell 만들어서 채우기
for(var i = 0; i < DAYS_OF_MONTH; ++i) {
    // i는 0부터 31까지 증가하고, getDate는 1부터 증가하다가 다음달이 되면 다시 1이 된다.
    // 따라서 i > getDate() 가 되면 다음달이 된 것이다. 
    if(i < Calendar.getDate()) { 
        let day = Calendar.getDate();
        let week_day = Calendar.getDay();

        if(week_day === 0){ // 일요일에는 새로운 행 시작
            str += TR_start;
        }

        if(day == today){ // 오늘 날짜는 특별히 !
            str += TD_today_start + day + TD_end;
        }
        else {
            switch(week_day){
                case 0: // 일요일
                    str += TD_sunday_start + day + TD_end;
                    break;
                case 6: // 토요일
                    str += TD_saturday_start + day + TD_end;
                    str += TR_end; // 행을 마무리
                    break;
                default: // 평일
                    str += TD_day_start + day + TD_end;
                    break;
            }
        }
    } // if문 끝

    Calendar.setDate(Calendar.getDate() + 1); // Date 1 증가
} // for문 끝

str += "</table></td></tr></table>"; // 테이블 마감처리

document.write(str); // html 파일에다가 작성