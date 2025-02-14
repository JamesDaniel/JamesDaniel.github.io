
$( document ).ready(function() {
  $('.menu_btn_container')    .height( $('.menu_btn_container').width()     );
  $('.menu_btn_img_container').height( $('.menu_btn_container').height()*.9 );
  $('.menu_btn_footer')       .height( $('.menu_btn_container').height()*.1 );
  $('.menu_btn_img_container').css('padding',($('.menu_btn_img_container').width()*0.1)+'px');

  window.addEventListener("resize", () => {
    $('.menu_btn_container')    .height( $('.menu_btn_container').width()     );
    $('.menu_btn_img_container').height( $('.menu_btn_container').height()*.9 );
    $('.menu_btn_footer')       .height( $('.menu_btn_container').height()*.1 );
    $('.menu_btn_img_container').css('padding',($('.menu_btn_img_container').width()*0.1)+'px');
  });
});