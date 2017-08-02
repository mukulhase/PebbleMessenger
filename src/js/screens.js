var UI = require('ui');
var Vector2 = require('vector2');

// No internet screen

var noInternet = new UI.Card({
  title: 'No connection :(',
  subtitle: 'Check your phone\'s internet',
  subtitleColor: 'indigo',
  bodyColor: '#9a0036'
});
// Loading Intermediate
var intermediateLoading = new UI.Window({
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
// Loading Screen Beginning
var loadingScreen = new UI.Card({
  title: 'Messenger for Pebble',
  icon: 'images/menu_icon.png',
  subtitle: 'Loading Chats',
  body: 'Please Wait....',
  subtitleColor: 'indigo',
  bodyColor: '#9a0036'
});

module.exports = {
  noInternet: noInternet,
  loadingScreen: loadingScreen,
  intermediateLoading: intermediateLoading,
}