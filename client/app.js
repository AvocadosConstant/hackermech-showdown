var bigText = require('./bigText.js');
var fs = require('fs');
var partsJSON = JSON.parse(fs.readFileSync('res/sample-parts.json', 'utf8'));

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
    left: '0%-1',
    top: '0%-1',
    width: '30%+1',
    height: '20%+1',
    border: 'line',
    content:    '            \n' +
                '     _       _   _  \n' +
                '  | | |  .  | | | | \n' +
                '  | |_|  .  |_| |_| \n',
    style: {
        fg: 'green',
        bg: 'gray',
        bold: true,
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});

var menuBar = blessed.listbar({
    items: {
        HELP: 'HELP',
        PARTS: 'PARTS',
        TEST1: 'TEST1',
        TEST2: 'TEST4'
    },
    top: 0,
    left: 0,
    height: 1,
    width: '100%',
    keys: true, 
    vi: true,
    mouse: true,
    autoCommandKeys: true,
    style: {
        fg: 'default',
        bg: 'default',
        selected: {
            fg: 'white',
            bg: 'gray',
            bold: true
        },
        item: {
            bg: 'default'
        }
    }
});

var info = blessed.box({
    left: 0,
    top: '20%-1',
    width: '30%',
    height: '80%+1',
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
    }
});

var partsList = blessed.list({
    items: Object.keys(partsJSON),
    left: '0%-1',
    top: '0%+1',
    width: '40%',
    height: '100%-1',
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

var partPanel = blessed.box({
    left: '40%-2',
    top: '0%+1',
    width: '60%+2',
    height: '100%-1',
    border: 'line',
    align: 'center',
    valign: 'middle',
    tags: true,
    content: '{bold}Select a part to read details.{/bold}',
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

var partPic = blessed.ANSIImage({
    // Halfway to the right minus half the image's width
    left: '50%-14',
    top: 1,
    scale: 1,
    width: 25,
    height: 10,
    //file: 'res/images/shroom.png',
    file: 'res/images/sword.png',
    //animate: true,
    //content: 'Part image goes here',
    style: {
        fg: 'default',
        bg: 'black',
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});

var partDesc = blessed.text({
    left: 0,
    top: '35%-1',
    height: '60%-1',
    width: '100%',
    padding: 1,
    tags: true,
    content: 'Part description',
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


info.append(partsList);
info.append(partPanel);
info.append(menuBar);
screen.append(info);
screen.append(timer);

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
    var text = formatTime(--time);
    var bigStrings = bigText.growText(text);
    timer.setContent(bigStrings[0] + '\n' +  bigStrings[1] + '\n' +  bigStrings[2]);
    if (time <= 0) {
        timer.setContent('                                 \n' +
                         '___    _ _   _     _         _   \n' + 
                         ' |  | | | | |_  / |_    | | |_| |\n' +
                         ' |  | | | | |_     _|   |_| |   .\n');
        clearInterval(interval);
    }
}, 1000);

cmd.focus();

partsList.on('select', function(el, selected) {
    partPanel.append(partPic);
    partPanel.append(partDesc);
    info.append(partPanel);

    var name = el.getText();
    var part = partsJSON[name];
    partPic.setImage('res/images/' + name + '.png');
    partDesc.setContent(
        '{bold}' + name + '{/bold}' + '\n\n' +
        '{bold}COST{/bold} ' + part.cost + '\n\n' +
        '{bold}EFFECT{/bold} ' + part.effect + '\n\n' +
        part.flavor
    );
});

screen.key('C-q', function() {
    cmd.kill();
    return process.exit(0);
});

screen.program.key('S-tab', function() {
    screen.focusNext();
    screen.render();
});

screen.render();
