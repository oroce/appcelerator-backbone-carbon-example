// open a single window
var C = Carbon = require('appersonlabs.carbon');

var result = Carbon.UI.load('ui/test1.json');
result.open();

var button = Carbon.UI.create({"Button": {
  id: "testButton2",
  title: "red button is red",
  top: 0,
  backgroundColor: "red",
  width: 300,
  height: 100
}});

var win1 = C.UI.find('#win1');
if (win1) {
  win1.add(button);
}
else {
  Ti.API.info('could not find win1 by id');
}

// basic test
var testButton = C.UI.find('#testButton');

// var testButton = C.UI.find('#testButton');
// testButton.addEventListener('click', function(e) {
//     alert('hello!');
// });
setTimeout(function() {
    testButton.title = 'Click me now!';
    
    testButton.addEventListener('click', function(e) {
      alert('hello!');
    });
}, 10000);


/*
var result = UI.build('ui/nonexistant.json');
var result = UI.build('ui/syntax_error.json');
*/