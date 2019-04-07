
$('.Menu').on('click', function(){
    var checkId = $(this).attr('id');
    console.log(checkId);
});

//$('.Menu').on('click', Change_HighLight);

function Change_HighLight ( Menu_id ) {
    $('#Menu-container').removeClass('HighLight');
    $(Menu_id).addClass('HighLight');
}


//OnClick="location.href ='#'" style="cursor:pointer;"