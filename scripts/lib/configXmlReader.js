var fs = require('fs');
var path = require('path');
var xmlHelper = require('./xmlHelper.js');
var cordovaContext;
var projectRoot;

module.exports = {
    getConfigContent: getConfigContent,
};


function getConfigContent(ctx) {
    var configFilePath = path.join(ctx.opts.projectRoot, 'config.xml');
    return xmlHelper.readXmlAsJson(configFilePath, true);
}
