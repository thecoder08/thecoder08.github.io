function refresh() {
  $('#viewer').src = '/refreshView?questionData=' + encodeURI($('#question').value).replace(/#/ig, '%23');
}
function submit() {
  request('/submitQuestion?name=' + prompt('Enter your email so Lennon can give a response.') + '&questionData=' + encodeURI($('#question').value).replace(/#/ig, '%23'), function(data) {});
  alert('Thanks! your report has been sent to Lennon. Check for a reponse within 24 hours.');
}
