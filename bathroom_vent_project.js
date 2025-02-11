
$( document ).ready(function() {
  $('#iframePresentationId').width(document.body.clientWidth);
  $('#iframePresentationId').height(window.innerHeight-8);

  window.addEventListener("resize", () => {
    $('#iframePresentationId').width( document.body.clientWidth);
    $('#iframePresentationId').height(window.innerHeight-8);
  });
});