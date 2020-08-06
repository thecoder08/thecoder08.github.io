function addServer() {
  request('/addserver?name=' + prompt('What is the name of your server?') + '&address=' + prompt('What is the address of your server?') + '&owner=' + prompt('Who owns this server?'), function(data) {});
  refreshServers();
}
function refreshServers() {
  $('#servers').innerHTML = '<tr><td><b>Name</b></td><td><b>Address</b></td><td><b>Owner</b></td></tr>';
  request('/serverdb.json', function(data) {
    var servers = JSON.parse(data);
    for (var i = 0; i < servers.length; i++) {
      var tr = document.createElement('TR');
      var nameElement = document.createElement('TD');
      var addressElement = document.createElement('TD');
      var ownerElement = document.createElement('TD');
      var nameText = document.createTextNode(servers[i].name);
      var addressText = document.createTextNode(servers[i].address);
      var ownerText = document.createTextNode(servers[i].owner);
      nameElement.appendChild(nameText);
      addressElement.appendChild(addressText);
      ownerElement.appendChild(ownerText);
      tr.appendChild(nameElement);
      tr.appendChild(addressElement);
      tr.appendChild(ownerElement);
      $('#servers').appendChild(tr);
    }
  });
}
refreshServers();
