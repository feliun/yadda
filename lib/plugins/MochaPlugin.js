var fs = require('fs');
var English = require('../localisation/English');
var FeatureParser = require('../parsers/FeatureParser');
var $ = require('../Array');

module.exports = function(options) {

    var options = options || {};
    var language = options.language || English;
    var parser = options.parser || new FeatureParser(language);
    var mode = options.mode || 'async';

    function feature(filenames, next) {
        $(filenames).each(function(filename) {
            var text = fs.readFileSync(filename, 'utf8');
            parser.parse(text, function(feature) {
                var _describe = feature.annotations[language.localise('pending')] ? xdescribe : describe;
                _describe(feature.title || filename, function() {
                    next(feature)
                });
            });
        });
    };

    function async_scenarios(scenarios, next) {
        $(scenarios).each(function(scenario) {
            var _it = scenario.annotations[language.localise('pending')] ? xit : it;
            _it(scenario.title, function(done) {
                next(scenario, done)
            });
        });
    };

    function sync_scenarios(scenarios, next) {
        $(scenarios).each(function(scenario) {
            var _it = scenario.annotations[language.localise('pending')] ? xit : it;
            _it(scenario.title, function() {
                next(scenario)
            });
        });
    };

    GLOBAL.features = GLOBAL.feature = feature;
    GLOBAL.scenarios = mode == 'async' ? async_scenarios : sync_scenarios;
};