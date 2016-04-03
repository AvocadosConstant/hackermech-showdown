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

var timer = blessed.bigtext({
    align: 'center',
    valign: 'middle',
    font: 'fonts/ter-u32n.json',
    fontBold: 'fonts/ter-u32b.json',
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
            fg: 'black',
            bg: 'white',
            bold: true
        }
    }
});

var info = blessed.box({
    left: 0,
    top: '30%-1',
    width: '30%',
    height: '70%',
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

var partPic = blessed.box({
    left: 0,
    top: 0,
    height: '30%',
    width: '50%',
    //file: 'res/rocket-punch.jpg',
    content: 'Part image goes here',
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

var partTitle = blessed.text({
    align: 'center',
    valign: 'middle',
    left: '50%-1',
    top: '0',
    height: '30%',
    width: '50%+1',
    content: 'Part Title!',
    style: {
        fg: 'default',
        bg: 'default',
        bold: true,
        focus: {
            border: {
                fg: 'green'
            }
        }
    }
});

var partDesc = blessed.text({
    left: 0,
    top: '30%-1',
    height: '70%-1',
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


//partPanel.append(partPic);
//partPanel.append(partTitle);
//partPanel.append(partDesc);
info.append(partsList);
info.append(partPanel);
info.append(menuBar);
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

partsList.on('select', function(el, selected) {
    partPanel.append(partPic);
    partPanel.append(partTitle);
    partPanel.append(partDesc);
    info.append(partPanel);

    var name = el.getText();
    var part = partsJSON[name];
    partTitle.setContent(name);
    partDesc.setContent(
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
