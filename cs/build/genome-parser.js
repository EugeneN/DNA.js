
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"genome-parser": function(exports, require, module) {/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"text":4,"EOF":5,"statement":6,";":7,"event_binding_def":8,"events":9,":":10,"handlers":11,"event":12,",":13,"symbol":14,"/":15,"@":16,"handler":17,"handler_expression":18,"|":19,"partially_applied_handler":20,"IDENTIFIER":21,"NUMBER":22,"STRING":23,"[":24,"item_list":25,"]":26,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:";",10:":",13:",",15:"/",16:"@",19:"|",21:"IDENTIFIER",22:"NUMBER",23:"STRING",24:"[",26:"]"},
productions_: [0,[3,0],[3,2],[4,1],[4,3],[6,1],[6,1],[8,3],[9,1],[9,3],[12,1],[12,3],[12,3],[12,5],[11,1],[11,3],[17,1],[17,3],[18,1],[18,2],[20,1],[20,3],[20,3],[20,5],[14,1],[14,1],[14,1],[14,3],[25,0],[25,1],[25,2]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 2:
           console.log($$[$0-1]);
           return $$[$0-1];
        
break;
case 3: this.$ = [$$[$0]]; 
break;
case 4:
           this.$ = ($$[$0-2]).concat($$[$0]);
        
break;
case 6: this.$ = $$[$0]; 
break;
case 7: this.$ = {events: $$[$0-2], handlers: $$[$0]}; 
break;
case 8: this.$ = [$$[$0]]; 
break;
case 9: this.$ = ($$[$0-2]).concat([$$[$0]]); 
break;
case 10: this.$ = {ns: undefined, event: $$[$0], scope: undefined}; 
break;
case 11: this.$ = {ns: $$[$0-2], event: $$[$0-1], scope: undefined}; 
break;
case 12: this.$ = {ns: undefined, event: $$[$0-2], scope: $$[$0]}; 
break;
case 13: this.$ = {ns: $$[$0-4], event: $$[$0-2], scope: $$[$0]}; 
break;
case 14: this.$ = [$$[$0]]; 
break;
case 15: this.$ = ($$[$0-2]).concat([$$[$0]]); 
break;
case 16: this.$ = $$[$0]; 
break;
case 17: this.$ = Array.isArray($$[$0-2]) ? ($$[$0-2]).concat([$$[$0]]) : [$$[$0-2], $$[$0]]; 
break;
case 18: this.$ = [$$[$0]]; 
break;
case 19: this.$ = Array.isArray($$[$0-1]) ? ($$[$0-1]).concat([$$[$0]]) : [$$[$0-1], $$[$0]]; 
break;
case 20: this.$ = {ns: undefined, method: $$[$0], scope: undefined}; 
break;
case 21: this.$ = {ns: $$[$0-2], method: $$[$0], scope: undefined}; 
break;
case 22: this.$ = {ns: undefined, method: $$[$0-2], scope: $$[$0]}; 
break;
case 23: this.$ = {ns: $$[$0-4], method: $$[$0-2], scope: $$[$0]}; 
break;
case 24: this.$ = { type: "symbol", name: $$[$0] }; 
break;
case 25: this.$ = { type: "number", value: parseInt($$[$0], 10)}; 
break;
case 26: this.$ = { type: "string", value: ($$[$0]).match('\"(\\.|[^\\"]*?)\"')[1] }; 
break;
case 27: this.$ = { type: "vector", value: $$[$0-1]}; 
break;
case 28: this.$ = []; 
break;
case 29: this.$ = [$$[$0]]; 
break;
case 30: this.$ = $$[$0-1].concat($$[$0]); 
break;
}
},
table: [{1:[2,1],3:1,4:2,6:3,7:[1,4],8:5,9:6,12:7,14:8,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{1:[3]},{5:[1,13],7:[1,14]},{5:[2,3],7:[2,3]},{5:[2,5],7:[2,5]},{5:[2,6],7:[2,6]},{10:[1,15],13:[1,16]},{10:[2,8],13:[2,8]},{10:[2,10],13:[2,10],15:[1,17],16:[1,18]},{5:[2,24],7:[2,24],10:[2,24],13:[2,24],15:[2,24],16:[2,24],19:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],26:[2,24]},{5:[2,25],7:[2,25],10:[2,25],13:[2,25],15:[2,25],16:[2,25],19:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],26:[2,25]},{5:[2,26],7:[2,26],10:[2,26],13:[2,26],15:[2,26],16:[2,26],19:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[2,26],26:[2,26]},{14:20,21:[1,9],22:[1,10],23:[1,11],24:[1,12],25:19,26:[2,28]},{1:[2,2]},{6:21,7:[1,4],8:5,9:6,12:7,14:8,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{11:22,14:26,17:23,18:24,20:25,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{12:27,14:8,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:28,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:29,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:31,21:[1,9],22:[1,10],23:[1,11],24:[1,12],26:[1,30]},{21:[2,29],22:[2,29],23:[2,29],24:[2,29],26:[2,29]},{5:[2,4],7:[2,4]},{5:[2,7],7:[2,7],13:[1,32]},{5:[2,14],7:[2,14],13:[2,14],19:[1,33]},{5:[2,16],7:[2,16],13:[2,16],14:26,19:[2,16],20:34,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{5:[2,18],7:[2,18],13:[2,18],19:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18]},{5:[2,20],7:[2,20],13:[2,20],15:[1,35],16:[1,36],19:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20]},{10:[2,9],13:[2,9]},{10:[2,11],13:[2,11],16:[1,37]},{10:[2,12],13:[2,12]},{5:[2,27],7:[2,27],10:[2,27],13:[2,27],15:[2,27],16:[2,27],19:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],26:[2,27]},{21:[2,30],22:[2,30],23:[2,30],24:[2,30],26:[2,30]},{14:26,17:38,18:24,20:25,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:26,18:39,20:25,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{5:[2,19],7:[2,19],13:[2,19],19:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19]},{14:40,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:41,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{14:42,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{5:[2,15],7:[2,15],13:[2,15],19:[1,33]},{5:[2,17],7:[2,17],13:[2,17],14:26,19:[2,17],20:34,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{5:[2,21],7:[2,21],13:[2,21],16:[1,43],19:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21]},{5:[2,22],7:[2,22],13:[2,22],19:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22]},{10:[2,13],13:[2,13]},{14:44,21:[1,9],22:[1,10],23:[1,11],24:[1,12]},{5:[2,23],7:[2,23],13:[2,23],19:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23]}],
defaultActions: {13:[2,2]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
undefined/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 22
break;
case 2:return 23
break;
case 3:return 21
break;
case 4:return 'DBLQUOTE'
break;
case 5:return '('
break;
case 6:return ')'
break;
case 7:return 24
break;
case 8:return 26
break;
case 9:return '^'
break;
case 10:return 10
break;
case 11:return 16
break;
case 12:return 19
break;
case 13:return 13
break;
case 14:return 15
break;
case 15:return 7
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:[0-9]+)/,/^(?:"(\\.|[^\\"]*?)")/,/^(?:[A-Za-z_][A-Za-z0-9_]*)/,/^(?:")/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\^)/,/^(?::)/,/^(?:@)/,/^(?:\|)/,/^(?:,)/,/^(?:\/)/,/^(?:;)/,/^(?:$)/,/^(?:.)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}}});
