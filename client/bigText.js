var big = [
    [
        ' _ ',
        '| |',
        '|_|',
    ],
    [
        '   ',
        '  |',
        '  |',
    ],
    [
        ' _ ',
        ' _|',
        '|_ ',
    ],
    [
        ' _ ',
        ' _|',
        ' _|',
    ],
    [
        '   ',
        '|_|',
        '  |',
    ],
    [
        ' _ ',
        '|_ ',
        ' _|',
    ],
    [
        ' _ ',
        '|_ ',
        '|_|',
    ],
    [
        ' _ ',
        '| |',
        '  |',
    ],
    [
        ' _ ',
        '|_|',
        '|_|',
    ],
    [
        ' _ ',
        '|_|',
        ' _|',
    ],
    [
        '   ',
        ' . ',
        ' . ',
    ]
];

exports.growText = function(text) {
    var retStrings = ['', '', ''];
    for(i = 0; i < text.length; i++) {
        val = text.charCodeAt(i) - 48;
        for(j = 0; j < 3; j++) {
            retStrings[j] += big[val][j] + ' ';
        }
    }
    return retStrings;
};
