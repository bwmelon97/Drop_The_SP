
// Calendar 객체 생성 (현재 날짜 기준)
var TodayCalendar = new Date();

// get_메서드를 통해 받은 값을 사람이 쓰는 표현으로 바꿈
var day_of_week = ['일', '월', '화', '수', '목', '금', '토'];
var month_of_year = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// var year = TodayCalendar.getFullYear();  // YYYY
// var month = TodayCalendar.getMonth();    // 월 (0 ~ 11)
// var today = TodayCalendar.getDate();     // 현재 날짜
// var weekday = TodayCalendar.getDay();    // 요일 (0 ~ 6)

// TodayCalendar.setDate(1);    // 1일부터 표시할 것

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
var TD_saturday_start = "<td class=saturday>";
var TD_sunday_start = "<td class=sunday>";
var TD_end = "</td>";
////////////////////////////

var CalendarData = { // 캘린더 정보를 담는 객체
    year : TodayCalendar.getFullYear(),
    month : TodayCalendar.getMonth(),
    date : 1,
    day : 0,

    SetDate1 : function() { // Date를 1로 설정하는 메서드
        var DateOneCal = new Date(this.year, this.month, 1);
        this.date = 1;
        this.day = DateOneCal.getDay();
    },

    UpdateData : function() { // Date 객체를 이용해 date와 day 값 업데이트
        var tempCal = new Date(this.year, this.month, this.date);
        this.date = tempCal.getDate();
        this.day = tempCal.getDay();
    }
}
CalendarData.SetDate1();

var SelectedDate = {
    year : TodayCalendar.getFullYear(),
    month : TodayCalendar.getMonth(),
    date : TodayCalendar.getDate()
}


function CreateCalendarTable () {
    // 캘린더 + 년월 정보 까지 감싸는 테이블
    str = "<table width = 500px border=1 cellspacing=0 cellpadding=0 bordercolor=bbbbbb><tr><td style='text-align: center'>";
    str += "<strong>" + CalendarData.year + "년 " + month_of_year[CalendarData.month] + "</strong>"; // YYYY.MM

    // 캘린더 테이블 (요일, 날짜 테이블)
    str += "<table class = 'calendar' border = 0 cellspacing=0 cellpadding=2>";

    // 요일을 담은 행
    str += TR_start;
    for(var i = 0; i < DAYS_OF_WEEK; i++){
        str += TD_week_start + day_of_week[i] + TD_end;
    }
    str += TR_end;
}
CreateCalendarTable();


// 다음달, 이전달을 클릭했을 때 변화를 줌. 
function CreateDateCell(){

    // 1일 전까지는 blank 처리
    for(var i = 0; i < CalendarData.day; ++i){
        str += TD_blank_start + TD_end;
    }

    // table cell 만들어서 채우기
    for(var i = 0; i < DAYS_OF_MONTH; ++i) {
        // i는 0부터 31까지 증가하고, getDate는 1부터 증가하다가 다음달이 되면 다시 1이 된다.
        // 따라서 i > getDate() 가 되면 다음달이 된 것이다. 
        CalendarData.UpdateData();
        if ( i < CalendarData.date ) { 
            if(CalendarData.day === 0){ // 일요일에는 새로운 행 시작
                str += TR_start;
            }

            switch(CalendarData.day){
                case 0: // 일요일
                    str += TD_sunday_start + CalendarData.date + TD_end;
                    break;
                case 6: // 토요일
                    str += TD_saturday_start + CalendarData.date + TD_end;
                    str += TR_end; // 행을 마무리
                    break;
                default: // 평일
                    str += TD_day_start + CalendarData.date + TD_end;
                    break;
            }
            
        } // if문 끝

        CalendarData.date++; // Date 1 증가
    } // for문 끝

    str += "</table></td></tr></table>"; // 테이블 마감처리
    str += '<button id="prev" onclick="ClickPrev()">prev</button>';
    str += '<button id="next" onclick="ClickNext()">next</button>';
    document.write(str); // html 파일에다가 작성
}
CreateDateCell();

function ClickPrev() { // prev 버튼 클릭 이벤트
    CalendarData.month -= 1;
    if (CalendarData.month < 0) {
        CalendarData.month += 12;
        CalendarData.year -= 1;
    }
    CalendarData.SetDate1();
    
    CreateCalendarTable();
    CreateDateCell();

}

function ClickNext() { // next 버튼 클릭 이벤트
    CalendarData.month += 1;
    if (CalendarData.month >= 12) {
        CalendarData.month -= 12;
        CalendarData.year += 1;
    }
    CalendarData.SetDate1();

    CreateCalendarTable();
    CreateDateCell();
}