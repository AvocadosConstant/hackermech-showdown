var blessed = require('blessed'), screen;
var bigText = require('./bigText.js');
var request = require("request");

//  Sample data for testing
var fs = require('fs');
var partsJSON = JSON.parse(fs.readFileSync('res/sample-parts.json', 'utf8'));

screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true
});

//--------------------------//
//      Timer Section       //
//--------------------------//
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

function strPadLeft(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function formatTime(time) {
    var minutes = Math.floor(time/60);
    var seconds = time % 60;
    return strPadLeft(minutes,'0',2)+':'+strPadLeft(seconds,'0',2);
}

var time = 600; //10 minutes in seconds
var elapse = 0; //Don't decrement time
var interval = setInterval(function() {
    var text = formatTime(time -= elapse);
    var bigStrings = bigText.growText(text);
    timer.setContent(bigStrings[0] + '\n' +  bigStrings[1] + '\n' +  bigStrings[2]);
    if (time <= 0) {
        /*timer.setContent('                                 \n' +
                         '___    _ _   _     _         _   \n' + 
                         ' |  | | | | |_  / |_    | | |_| |\n' +
                         ' |  | | | | |_     _|   |_| |   .\n');
        */
        clearInterval(interval);
    }
}, 1000);






//--------------------------//
//      Menubar Section     //
//--------------------------//
var menuBar = blessed.listbar({
    items: {
        HELP: 'HELP',
        PARTS: 'PARTS',
        SUBMIT: 'SUBMIT',
        CREDITS: 'CREDITS'
    },
    top: 0,
    left: 0,
    height: 1,
    width: '100%',
    keys: true, 
    vi: true,
    mouse: true,
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

menuBar.on('select', function(el, selected) {
    menuBar.focus();
    var name = el.getText().substring(2);

    info.remove(helpRoot);
    info.remove(partsRoot);
    info.remove(submitRoot);
    info.remove(creditsRoot);
    if(name === 'HELP') info.append(helpRoot);
    else if(name === 'PARTS') info.append(partsRoot);
    else if(name === 'SUBMIT') info.append(submitRoot);
    else if(name === 'CREDITS') info.append(creditsRoot);
    info.append(menuBar);
});







var info = blessed.box({
    left: 0,
    top: '20%-1',
    width: '30%',
    height: '80%',
    border: 'line',
    style: {
        fg: 'default',
        bg: 'default',
    }
});


var helpRoot = blessed.box({
    top: '0%+1',
    left: '0%-1',
    width: '100%',
    height: '100%-1',
    border: 'line',
    content: 
        'Welcome to HACKERMECH SHOWDOWN! \n\nThe object of the game is to DESTROY THE ENEMY MECH!\n\nHow do you do so? Well it\'s simple: You write code to program your mech to fight! \n\nAt the beginning of each round, 2 of mech parts are randomly chosen and provided to both players. Each player has ten minutes to write the AI that powers your mech. When time is over, your code is uploaded to the server and run against each other. \n\n<Ctrl-q> to quit'
        ,
    padding: 1,
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

var creditsRoot = blessed.box({
    top: '0%+1',
    left: '0%-1',
    width: '100%',
    height: '100%-1',
    border: 'line',
    padding: 1,
    content: 'Built by: \n\nTim Hung - Terminal frontend in Node.js with blessed.\nWilliam Jagels - Backend in Node.js\nAndrew Chellis - Game design and backend\nNik Vanderhoof - Game design and backend\nTaylor Foxhall - Backend in Node.js\nAlan Plotko - Terminal frontend with blessed\nAustin Ward - Game design',
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

var submitRoot = blessed.box({
    scrollable: true,
    top: '0%+1',
    left: '0%-1',
    width: '100%',
    height: '100% - 1',
    border: 'line',
    tags: true,
});

var submitInfo = blessed.box({
    top: '0%',
    left: '0%',
    width: '100%',
    height: 1,
    align: 'center',
    align: 'middle',
    tags: true,
    content: '{bold}Select your file for upload. Good luck!{/bold}',
    style: {
        fg: 'default',
        bg: 'default',
    }
});

var submitDir = blessed.filemanager({
    cwd: true,
    scrollable: true,
    top: 1,
    left: '0%-1',
    width: '100%',
    height: '100% - 4',
    keys: true, 
    vi: true,
    mouse: true,
    border: 'line',
    padding: 1,
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

submitDir.refresh('/~', function(file){
});

submitDir.on('file', function(el, selected){
    elapse = 0;
    //console.log(el);
    submitInfo.setContent('Submitted ' + el + '!');
    fs.readFile(el, 'utf-8', function(err, data) {
        var options = { method: 'POST',
            url: 'http://localhost:3000/api/submit',
            headers: {
                'content-type': 'application/json'
            },
            body: { 
                player: corpus.player, 
                code: data
            },
            json: true 
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            //console.log(body);



            var options = { 
                method: 'GET',
                url: 'http://localhost:3000/api/results'
            }
            request(options, function(error, response, body) {
                body = JSON.parse(body);
                var result = body.result;

                timer.setContent(result);
            });
        
        });
    });
});

submitRoot.append(submitDir);
submitRoot.append(submitInfo);





//--------------------------//
//      Parts Section       //
//--------------------------//
var partsRoot = blessed.box({
    top: '0%-1',
    left: '0%-1',
    width: '100%',
    height: '100%',
    border: 'line'
});

//  List of parts
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

//  Part info container
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

//  Image of each part
var partPic = blessed.ANSIImage({
    // Halfway to the right minus half the image's width
    left: '50%-14',
    top: 1,
    scale: 1,
    width: 25,
    height: 10,
    //animate: true,
});

//  Descriptive text of each part
var partDesc = blessed.text({
    left: 0,
    top: '35%-1',
    height: '60%-1',
    width: '100%',
    padding: 1,
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

//  Construct part section
partPanel.append(partPic);
partPanel.append(partDesc);
partsRoot.append(partPanel);

//  Current part selection
partsList.on('select', function(el, selected) {
    partsList.focus();
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




//--------------------------//
//      Cmd Section         //
//--------------------------//
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




//--------------------------//
//      Game Funcs          //
//--------------------------//
var corpus;
function init() {
    partsRoot.append(partsList);
    partsRoot.append(partPanel);

    info.append(helpRoot);
    info.append(menuBar);
    
    screen.append(info);
    screen.append(timer);
    screen.append(cmd);

    screen.render();
    cmd.focus();


    //  Trigger setup
    var options = { 
        method: 'GET',
        url: 'http://localhost:3000/api/setup'
    }
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        corpus = JSON.parse(body);

        var joinInterval = setInterval(function() {
            var options = { 
                method: 'GET',
                url: 'http://localhost:3000/api/join'
            }
            request(options, function(error, response, body) {
                body = JSON.parse(body);
                //console.log(body["status"]);
                if(body["status"]) {
                    clearInterval(joinInterval);
                    startGame(); 
                }
            });
        }, 500);
    });
}

function startGame() {
    //Start timer
    elapse = 1;
}


init();


//--------------------------//
//      Key Commands        //
//--------------------------//
screen.key('C-q', function() {
    cmd.kill();
    return process.exit(0);
});

//  Temp command to start game
screen.key('C-s', function() {
    startGame();
});

screen.program.key('S-tab', function() {
    screen.focusNext();
    screen.render();
});

cmd.on('click', function(data) {
    cmd.focus();
});

menuBar.on('click', function(data) {
    menuBar.focus();
});

partsList.on('click', function(data) {
    partsList.focus();
});
