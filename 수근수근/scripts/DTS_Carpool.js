var Calendar = new Date();

var day_of_week = ['일', '월', '화', '수', '목', '금', '토'];

var month_of_year = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

var year = Calendar.getFullYear();
var month = Calendar.getMonth();
var today = Calendar.getDate();
var weekday = Calendar.getDay();

Calendar.setDate(1);

const DAYS_OF_WEEK = 7;
const DAYS_OF_MONTH = 31;
var str;

var TR_start = "<tr>";
var TR_end = "</tr>";

var TD_week_start = "<td class='week'>";
var TD_blank_start = "<td class='blank'>";
var TD_today_start = "<td class='today'>";
var TD_day_start = "<td class='day'>";
var TD_saturday_start = "<td class='saturday'>";
var TD_sunday_start = "<td class='sunday'>";
var TD_end = "</td>";

str = "<table width = 500px border=1 cellspacing=0 cellpadding=0 bordercolor=bbbbbb><tr><td style='text-align: center'>";
str += "<strong>" + year + "." + month_of_year[month] + "</strong>";
str += "<table class = 'calendar' border = 0 cellspacing=0 cellpadding=2>";

str += TR_start;

for(var i = 0; i < DAYS_OF_WEEK; i++){
    str += TD_week_start + day_of_week[i] + TD_end;
}

str += TR_end;

for(var i = 0; i < Calendar.getDate(); ++i){
    str += TD_blank_start + TD_end;
}

for(var i = 0; i < DAYS_OF_MONTH; ++i) {
    if(Calendar.getDate() > i) {
        var day = Calendar.getDate();
        var week_day = Calendar.getDay();

        if(week_day === 0){
            str += TR_start;
        }

        if(day == today){
            str += TD_today_start + day + TD_end;
        }
        else {
            switch(week_day){
                case 0:
                    str += TD_sunday_start + day + TD_end;
                    break;
                case 6:
                    str += TD_saturday_start + day + TD_end;
                    str += TR_end;
                    break;
                default:
                    str += TD_day_start + day + TD_end;
                    break;
            }
        }
    }

    Calendar.setDate(Calendar.getDate() + 1);
}

str += "</table></td></tr></table>";

document.write(str);