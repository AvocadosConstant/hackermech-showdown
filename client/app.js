process.title = 'multiplex.js';

var blessed = require('blessed')
    , screen;

screen = blessed.screen({
    smartCSR: true,
    log: process.env.HOME + '/blessed-terminal.log',
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true
});

var timer = blessed.box({
    left: 0,
    top: 0,
    width: '30%',
    height: '30%',
    content: 'Hello {bold}world{/bold}!',
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});
screen.append(timer);

var parts = blessed.box({
    left: 0,
    top: '30%-1',
    width: '30%',
    height: '70%+1',
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});

screen.append(parts);

var cmd = blessed.terminal({
    parent: screen,
    cursor: 'block',
    cursorBlink: true,
    screenKeys: false,
    label: ' multiplex.js ',
    left: '30%-1',
    top: 0,
    width: '70%+1',
    height: '100%',
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});

cmd.pty.on('data', function(data) {
    screen.log(JSON.stringify(data));
});

cmd.on('title', function(title) {
    screen.title = title;
    cmd.setLabel(' ' + title + ' ');
    screen.render();
});


var iFrequency = 5000; // expressed in miliseconds
var myInterval = 0;



/*
// STARTS and Resets the loop if any
function startLoop() {
    if(myInterval > 0) clearInterval(myInterval);  // stop
    myInterval = setInterval( "doSomething()", iFrequency );  // run
}

function doSomething()
{
    timer.setContent('alan plotko');
    screen.render();
}
*/



cmd.focus();

screen.key('C-b', function() {
    timer.setContent('alan plotko');
    screen.render();
});

screen.key('C-q', function() {
    cmd.kill();
    return screen.destroy();
});

screen.render();
