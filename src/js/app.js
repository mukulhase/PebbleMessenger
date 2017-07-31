
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Accel = require('ui/accel');		
var Voice = require('ui/voice');
var Settings = require('settings');
var url = 'pebblemessenger.mukulhase.com';
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

function sectionize(items){
  var sections = [];
  var currentTitle = "";
  items.forEach(function(item){
    if(item.title != currentTitle){
      sections.push({
        title:item.title,
        items:[]
      });
      currentTitle = item.title;
    }
    sections[sections.length-1].items.push({title:item.subtitle});
  });
  return sections;
}

function forceWrap(sentence){
  return sentence.trim().replace(/(\S(.{0,20}\S)?)\s+/g, '$1\n');
}

function hackedView(sections){
  var hackedSections = [{items:[]}];
  sections.forEach(function(section){
    hackedSections[hackedSections.length-1].items.push({title:section.title});
    section.items.forEach(function(item){
      var body = forceWrap(item.title);
      var lines = body.split('\n');
      lines.forEach(function(line){
        hackedSections.push({title:line,items:[]});
      });
    });
  });
  hackedSections[hackedSections.length-1].items.push({title:'Shake to Reply'});
  return hackedSections;
}

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
        sections: hackedView(sectionize(items))
      });
      menu.on('select', function(e) {
        //do voice here
      });
      menu.on('accelTap', function(e){
        console.log("Tap log!");
        Voice.dictate('start', false, function(e) {
          if (e.err) {
            console.log('Error: ' + e.err);
            return;
          }
          ajax({url: 'https://test.mukulhase.com/send?threadID='+threadID+'&message='+e.transcription});
          showChat(threadID);
        });
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

function showTokenScreen(callback){
  var tokenScreen = new UI.Card({
      title: Settings.data('token'),
      subtitle: 'Pebble Token',
      body: 'Log into FB at test.mukulhase.com',
      subtitleColor: 'indigo', // Named colors
      bodyColor: '#9a0036' // Hex colors
    });
  tokenScreen.on('select', function(e) {
      ajax({ url: 'https://test.mukulhase.com/tokenStatus?token='+Settings.data('token'), type: 'json' }, function(res){
        if(!res.error){
          callback()
        }
      })
    });
  tokenScreen.show();
}

Settings.data('token',null);
if(!Settings.data('token')){
  ajax({ url: 'https://test.mukulhase.com/getToken', type: 'json' },
  function(data, status, req) {
    Settings.data('token', data.token);
    showTokenScreen(showList);
    
  });
} else {
  showList();
}



