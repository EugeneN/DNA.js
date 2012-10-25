
%lex
%%

\s+                   /* skip whitespace */
[A-Za-z0-9_]+\b       return 'IDENT'
":"                   return 'BIND'
"@"                   return 'AT'
"|"                   return 'COMPOSE'
","                   return 'ALSO'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%start directive

%%

directive
    :
    | event_expr BIND handler_expr EOF
        %{ console.log({events: $1, handlers: $3}); $$ = {events: $1, handlers: $3}; %}
    ;

event_expr
    : single_event_expr
        %{ $$ = $1; %}
    | event_expr ALSO single_event_expr
        %{ $$ = ($1).concat($3); %}
    ;

single_event_expr
    : expr
        %{ $$ = [{event: $1}]; %}
    | expr AT expr
        %{ $$ = [{event: $1, ns: $3}]; %}
    ;


handler_expr    
    : composed_handler_expr
        %{ $$ = [$1]; %}
    | handler_expr ALSO composed_handler_expr
        %{ $$ = ($1).concat($3); %}
    ;

composed_handler_expr
    : method
        {{ $$ = $1; }}
    | composed_handler_expr COMPOSE method
        {{ $$ = {compose: [$1, $3]}; }}
    ;

method
    : expr
        {{ $$ = {method: $1, ns: undefined}; }}
    | expr AT expr
        {{ $$ = {method: $1, ns: $3}; }}
    ;

expr
    : IDENT
        { $$ = $1; }
    ;
