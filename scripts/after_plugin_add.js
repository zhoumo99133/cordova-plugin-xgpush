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

    var pushConfig = configContent['push-config'];
    var idStr = configContent['id'];
    var splits = idStr.split(".");
    var name = splits[splits.length - 1];
    if (!pushConfig) {
        return printLog('push-config 未定义');
    }
//    printLog(JSON.stringify(pushConfig));
    printLog(name);

    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path');

    var filename = name + '-xinge.gradle';
    var gradleFile = path.join(ctx.opts.projectRoot, 'platforms/android/cordova-plugin-xgpush/'+filename);
    fs.readFile(gradleFile, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }
        var result = data.replace("$XG_ACCESS_ID", pushConfig.xg.id)
            .replace("$XG_ACCESS_KEY", pushConfig.xg.key)
            .replace("$MI_PUSH_ID", pushConfig.xm.id)
            .replace("$MI_PUSH_KEY", pushConfig.xm.key)
            .replace("$MZ_PUSH_ID", pushConfig.mz.id)
            .replace("$MZ_PUSH_KEY", pushConfig.mz.key)
            .replace("$HW_APPID", pushConfig.hw.id);
        printLog(result);
        fs.writeFile(gradleFile, result, 'utf8', function (err) {
            if (err) throw err;
            printLog("替换pushid 完成")
        });

    });

};
