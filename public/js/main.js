const socket = io();
socket.on('connect', () => {
  console.log(socket.id);
  const aurl = $('#apiurl').text();
  $('#apiurl').text(`${aurl}/${socket.id}`);
});
socket.on('result', data => {
  $('#resultbox').val(data);
});
