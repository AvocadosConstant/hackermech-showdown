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
    align: 'center',
    valign: 'middle',
    left: 0,
    top: 0,
    width: '30%',
    height: '30%',
    content: '10:00',
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

var info = blessed.box({
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

var partsList = blessed.list({
    left: '0%-1',
    top: '0%-1',
    width: '40%',
    height: '100%',
    keys: true,
    vi: true,
    mouse: true,
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
        focus: {
            border: {
                fg: 'green'
            }
        },
        selected: {
            fg: 'black',
            bg: 'white',
            bold: true
        }
    }
});

var description = blessed.box({
    left: '40%-2',
    top: '0%-1',
    width: '60%+2',
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

partsList.addItem('item 1');
partsList.addItem('item 2');
partsList.addItem('item 3');



info.append(partsList);
info.append(description);
screen.append(timer);
screen.append(info);

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


function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function formatTime(time) {
    var minutes = Math.floor(time/60);
    var seconds = time % 60;
    return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
}

var time = 600;
var interval = setInterval(function() {
    timer.setContent(formatTime(--time));
    if (time <= 0) {
        timer.setContent('Time\'s up!');
        clearInterval(interval);
    }
}, 1000);

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
