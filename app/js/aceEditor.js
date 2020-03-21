const Utils = require("./utils");
const ace = require("ace-builds/src-noconflict/ace.js");
require("ace-builds/src-noconflict/ext-searchbox.js");

module.exports = class AceEditor {
    static init(globalSettings) {
        ace.define('ace/mode/log_file', (require, exports, module) => {
            const oop = require("ace/lib/oop");
            const TextMode = require("ace/mode/text").Mode;
            const LogFileHighlightRules = require("ace/mode/log_file_highlight_rules").LogFileHighlightRules;

            const Mode = function() {
                this.HighlightRules = LogFileHighlightRules;
            };

            oop.inherits(Mode, TextMode);

            (function() {
                // Extra logic goes here. (see below)
            }).call(Mode.prototype);

            exports.Mode = Mode;
        });

        ace.define('ace/mode/log_file_highlight_rules', (require, exports, module) => {
            const oop = require("ace/lib/oop");
            const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
            
            const debugRule = {
                token: "debug",
                regex: ".*" + globalSettings.debug.pattern + ".*",
                next: "debug"
            };

            const infoRule = {
                token: "info",
                regex: ".*" + globalSettings.info.pattern + ".*",
                next: "info"
            };

            const warningRule = {
                token: "warning",
                regex: ".*" + globalSettings.warning.pattern + ".*",
                next: "warning"
            };

            const errorRule = {
                token: "error",
                regex: ".*" + globalSettings.error.pattern + ".*",
                next: "error"
            };

            const fatalRule = {
                token: "fatal",
                regex: ".*" + globalSettings.fatal.pattern + ".*",
                next: "fatal"
            };

            function noMatchRule(severity) {
                return {
                    token: severity,
                    regex: "^.*$",
                    next: severity
                };
            }
            
            const LogFileHighlightRules = function() {
                this.$rules = {
                    start: [debugRule, infoRule, warningRule, errorRule, fatalRule],
                    debug: [debugRule, infoRule, warningRule, errorRule, fatalRule, noMatchRule("debug")],
                    info: [debugRule, infoRule, warningRule, errorRule, fatalRule, noMatchRule("info")],
                    warning: [debugRule, infoRule, warningRule, errorRule, fatalRule, noMatchRule("warning")],
                    error: [debugRule, infoRule, warningRule, errorRule, fatalRule, noMatchRule("error")],
                    fatal: [debugRule, infoRule, warningRule, errorRule, fatalRule, noMatchRule("fatal")]
                };
            }

            oop.inherits(LogFileHighlightRules, TextHighlightRules);

            exports.LogFileHighlightRules = LogFileHighlightRules;
        });
    }

    static createViewer(DOMElement, globalSettings) {
        const viewer = ace.edit(DOMElement);

        viewer.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            showPrintMargin: false,
            mode: "ace/mode/log_file",
            fontFamily: "Consolas, monaco, 'Courier New', Courier, monospace",
            fontSize: globalSettings.fontSize + "px"
        });

        return viewer;
    }
}