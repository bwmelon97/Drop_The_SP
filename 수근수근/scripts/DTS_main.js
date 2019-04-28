
$('.Menu').on('click', function(){
    var checkId = $(this).attr('id');
    console.log(checkId);
});

//$('.Menu').on('click', Change_HighLight);

function Change_HighLight ( Menu_id ) {
    $('#Dapanda').removeClass('HighLight');
    $('#Carpool').removeClass('HighLight');
    $('#Ymarket').removeClass('HighLight');
    $(Menu_id).addClass('HighLight');
}


//OnClick="location.href ='#'" style="cursor:pointer;"

$('#button1').on('click', function(){
    alert("버튼 1을 눌렀습니다.");
});

function button1_click(){
    alert("버튼 1을 눌렀습니다.");
}