%lex
%%

\s+                    /* skip whitespace */
[0-9]+                 return 'NUMBER'
\"(\\.|[^\\"]*?)\"     return 'STRING'
[A-Za-z_][A-Za-z0-9_]* return 'IDENTIFIER'
\"                     return 'DBLQUOTE'
"("                    return '('
")"                    return ')'
"["                    return '['
"]"                    return ']'
"^"                    return '^'
":"                    return ':'
"@"                    return '@'
"|"                    return '|'
","                    return ','
"/"                    return '/'
";"                    return ';'
<<EOF>>                return 'EOF'
.                      return 'INVALID'

/lex

/* operator associations and precedence */
%left ',' '|' ';' '/'
%right ':'

%start program

%%

program
    :
    | text EOF
        {{
           console.log($1);
           return $1;
        }}
    ;

text
    : statement
        %{ $$ = [$1]; %}
    | text ';' statement
        %{
           $$ = ($1).concat($3);
        %}
    ;

statement
    : ';'
    | event_binding_def
        {{ $$ = $1; }}
    ;

event_binding_def
    : events ':' handlers
        %{ $$ = {events: $1, handlers: $3}; %}
    ;

events
    : event
        %{ $$ = [$1]; %}
    | events ',' event
        %{ $$ = ($1).concat([$3]); %}
    ;

event
    : symbol
        %{ $$ = {ns: undefined, event: $1, scope: undefined}; %}
    | symbol '/' symbol
        %{ $$ = {ns: $1, event: $2, scope: undefined}; %}
    | symbol '@' symbol
        %{ $$ = {ns: undefined, event: $1, scope: $3}; %}
    | symbol '/' symbol '@' symbol
        %{ $$ = {ns: $1, event: $3, scope: $5}; %}
    ;

handlers
    : handler
        %{ $$ = [$1]; %}
    | handlers ',' handler
        %{ $$ = ($1).concat([$3]); %}
    ;

handler
    : handler_expression
        {{ $$ = $1; }}
    | handler '|' handler_expression
        {{ $$ = Array.isArray($1) ? ($1).concat([$3]) : [$1, $3]; }}
    ;

handler_expression
    : partially_applied_handler
        {{ $$ = [$1]; }}
    | handler_expression partially_applied_handler
        {{ $$ = Array.isArray($1) ? ($1).concat([$2]) : [$1, $2]; }}
    ;

partially_applied_handler
    : symbol
        {{ $$ = {ns: undefined, method: $1, scope: undefined}; }}
    | symbol '/' symbol
        {{ $$ = {ns: $1, method: $3, scope: undefined}; }}
    | symbol '@' symbol
        {{ $$ = {ns: undefined, method: $1, scope: $3}; }}
    | symbol '/' symbol '@' symbol
        {{ $$ = {ns: $1, method: $3, scope: $5}; }}
    ;

symbol
    : IDENTIFIER
        {{ $$ = { type: "symbol", name: $1 }; }}
    | NUMBER
        {{ $$ = { type: "number", value: parseInt($1, 10)}; }}
    | STRING
        {{ $$ = { type: "string", value: ($1).match('\"(\\.|[^\\"]*?)\"')[1] }; }}
    | '[' item_list ']'
        {{ $$ = { type: "vector", value: $2}; }}
    ;

item_list
    :
        {{ $$ = []; }}
    | symbol
        {{ $$ = [$1]; }}
    | item_list symbol
        {{ $$ = $1.concat($2); }}
    ;
