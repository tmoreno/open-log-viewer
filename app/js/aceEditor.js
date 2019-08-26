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
            
            let currentToken = "info";
            const rules = {
                start: [
                    {
                        token: function() {
                            currentToken = "debug";
                            return currentToken;
                        },
                        regex: ".*" + Utils.escapeRegExp(globalSettings.debug.pattern) + ".*"
                    },
                    {
                        token: function() {
                            currentToken = "info";
                            return currentToken;
                        },
                        regex: ".*" + Utils.escapeRegExp(globalSettings.info.pattern) + ".*"
                    },
                    {
                        token: function() {
                            currentToken = "warning";
                            return currentToken;
                        },
                        regex: ".*" + Utils.escapeRegExp(globalSettings.warning.pattern) + ".*"
                    },
                    {
                        token: function() {
                            currentToken = "error";
                            return currentToken;
                        },
                        regex: ".*" + Utils.escapeRegExp(globalSettings.error.pattern) + ".*"
                    },
                    {
                        token: function() {
                            currentToken = "fatal";
                            return currentToken;
                        },
                        regex: ".*" + Utils.escapeRegExp(globalSettings.fatal.pattern) + ".*"
                    },
                    {
                        token: function() {
                            return currentToken;
                        },
                        regex: "^.*$"
                    }
                ]
            };

            const LogFileHighlightRules = function() {
                this.$rules = rules;
            }

            oop.inherits(LogFileHighlightRules, TextHighlightRules);

            exports.LogFileHighlightRules = LogFileHighlightRules;
        });
    }

    static createViewer(DOMElement) {
        const viewer = ace.edit(DOMElement);

        viewer.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            showPrintMargin: false,
            mode: "ace/mode/log_file",
            fontFamily: "Consolas, monaco, 'Courier New', Courier, monospace",
            fontSize: "15px"
        });

        return viewer;
    }
}