var configXmlReader = require('./lib/configXmlReader.js');

function logStart() {
    console.log('XinGe Push plugin after prepare hook:');
}

function printLog(msg) {
    var formattedMsg = '    ' + msg;
    console.log(formattedMsg);
}


function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
}

module.exports = function (ctx) {

    logStart();

    var configContent = configXmlReader.getConfigContent(ctx);
    printLog(JSON.stringify(configContent));
    var idStr = configContent['id'];
    var splits = idStr.split(".");
    var name = splits[splits.length - 1];
    var preferences = configContent['preference'];
    var xgId = '';
    var xgKey = '';
    var hwId = '';
    for (var i in preferences) {
        if (preferences[i].name == 'XG_ACCESS_ID') {
            xgId = preferences[i].value;
        } else if (preferences[i].name == 'XG_ACCESS_KEY') {
            xgKey = preferences[i].value;
        } else if (preferences[i].name == 'HW_APP_ID') {
            hwId = preferences[i].value;
        }
    }

    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path');

    var filename = name + '-xinge.gradle';
    var gradleFile = path.join(ctx.opts.projectRoot, 'platforms/android/cordova-plugin-xgpush/' + filename);
    fs.readFile(gradleFile, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }

        var xgIdReg = /XG_ACCESS_ID\s*:\s*"([A-Za-z0-9]*)"/g;
        var xgKeyReg = /XG_ACCESS_KEY\s*:\s*"([A-Za-z0-9]*)"/g;
        var hwIdReg = /HW_APP_ID\s*:\s*"([A-Za-z0-9]*)"/g;
        var result =
            data.replace(xgIdReg, 'XG_ACCESS_ID:"' + xgId + '"')
                .replace(xgKeyReg, 'XG_ACCESS_KEY:"' + xgKey + '"')
                .replace(hwIdReg, 'HW_APP_ID:"' + hwId + '"');
        printLog(result);
        fs.writeFile(gradleFile, result, 'utf8', function (err) {
            if (err) throw err;
            printLog("替换pushid 完成")
        });

    });

};
