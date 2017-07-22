
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var intermediateLoading;
function showLoading(){
  intermediateLoading = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Loading',
    textAlign: 'center'
  });
  var windSize = intermediateLoading.size();
  // Center the radial in the window
  var radialPos = radial.position()
      .addSelf(windSize)
      .subSelf(radial.size())
      .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  intermediateLoading.add(radial);
  intermediateLoading.add(textfield);
  intermediateLoading.show();
}


var loadingScreen = new UI.Card({
  title: 'Messenger for Pebble',
  icon: 'images/menu_icon.png',
  subtitle: 'Loading Chats',
  body: 'Please Wait....',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
loadingScreen.show();

function showChat(threadID){
  showLoading();
  ajax({ url: 'https://test.mukulhase.com/thread?threadID='+threadID, type: 'json' },
    function(data, status, req) {
      var items = data.map(function(obj){
        return {
          title: obj.name,
          subtitle: obj.body,
        };
      });
      var menu = new UI.Menu({
        sections: [{
          items: items
        }]
      });
      menu.on('select', function(e) {
        //do voice here
      });
      menu.on('click','back', function(e) {
        showList();
      });
      menu.show();
      intermediateLoading.hide();
    });
}

function showList(){
  ajax({ url: 'https://test.mukulhase.com/list', type: 'json' },
  function(data, status, req) {
    var items = data.map(function(obj){
      return {
        title: obj.name,
        subtitle: obj.snippet,
        threadID: obj.threadID
      };
    });
    var menu = new UI.Menu({
      sections: [{
        items: items
      }]
    });
    menu.on('select', function(e) {
      showChat(e.item.threadID);
    });
    menu.show();
    loadingScreen.hide();
  });
}

showList();

