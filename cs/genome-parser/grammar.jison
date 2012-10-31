
%lex
%%

\s+                   /* skip whitespace */
[A-Za-z0-9_]+\b       return 'IDENT'
"^"                   return 'MACRO'
":"                   return 'BIND'
"@"                   return 'AT'
"|"                   return 'COMPOSE'
","                   return 'ALSO'
\"                    return 'QUOTE'
"/"                   return 'NS_SEP'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%start directive

%%

directive
    :
    | event_expr BIND handler_expr EOF
        %{ $$ = {events: $1, handlers: $3};
           console.log($$);
           return $$; %}
    ;

event_expr
    : single_event_expr
        %{ $$ = $1; %}
    | event_expr ALSO single_event_expr
        %{ $$ = ($1).concat($3); %}
    ;

single_event_expr
    : expr
        %{ $$ = [{ns: undefined, event: $1, scope: undefined}]; %}
    | expr AT expr
        %{ $$ = [{ns: undefined, event: $1, scope: $3}]; %}
    | expr NS_SEP expr
        {{ $$ = [{ns: $1, event: $3, scope: undefined}]; }}
    | expr NS_SEP expr AT expr
        {{ $$ = [{ns: $1, event: $3, scope: $5}]; }}
    ;


handler_expr
    : composed_handler_expr
        %{ $$ = [$1]; %}
    | handler_expr ALSO composed_handler_expr
        %{ $$ = ($1).concat([$3]); %}
    ;

composed_handler_expr
    : method
        {{ $$ = $1; }}
    | composed_handler_expr COMPOSE method
        {{ $$ = Array.isArray($1) ? ($1).concat([$3]) : [$1, $3]; }}
    ;

method
    : expr
        {{ $$ = {ns: undefined, method: $1, scope: undefined}; }}
    | expr NS_SEP expr
        {{ $$ = {ns: $1, method: $3, scope: undefined} }}
    | expr AT expr
        {{ $$ = {ns: undefined, method: $1, scope: $3}; }}
    | expr NS_SEP expr AT expr
        {{ $$ = {ns: $1, method: $3, scope: $5}; }}
    ;

expr
    : IDENT
        {{ $$ = { name: $1 }; }}
    | MACRO IDENT
        {{ $$ = { name: $2, macro: true} }}
    | QUOTE IDENT QUOTE
        {{ $$ = { type: "string", value: $2 } }}
    ;
