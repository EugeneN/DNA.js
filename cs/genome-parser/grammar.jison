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
           /* console.log($1); */
           return $1;
        }}
    ;

text
    : expression
        %{ $$ = [$1]; %}
    | text ';' expression
        %{
           $$ = ($1).concat($3);
        %}
    ;

expression
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
    : literal
        %{ $$ = {ns: undefined, event: $1, scope: undefined}; %}
    | literal '/' literal
        %{ $$ = {ns: $1, event: $2, scope: undefined}; %}
    | literal '@' literal
        %{ $$ = {ns: undefined, event: $1, scope: $3}; %}
    | literal '/' literal '@' literal
        %{ $$ = {ns: $1, event: $3, scope: $5}; %}
    ;

handlers
    : handler
        %{ $$ = [$1]; %}
    | handlers ',' handler
        %{ $$ = ($1).concat([$3]); %}
    ;

handler
    : single_handler
        {{ $$ = $1; }}
    | handler '|' single_handler
        {{ $$ = Array.isArray($1) ? ($1).concat([$3]) : [$1, $3]; }}
    ;

single_handler
    : literal
        {{ $$ = {ns: undefined, method: $1, scope: undefined}; }}
    | literal '/' literal
        {{ $$ = {ns: $1, method: $3, scope: undefined}; }}
    | literal '@' literal
        {{ $$ = {ns: undefined, method: $1, scope: $3}; }}
    | literal '/' literal '@' literal
        {{ $$ = {ns: $1, method: $3, scope: $5}; }}
    ;

literal
    : IDENTIFIER
        {{ $$ = { name: $1 }; }}
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
    | literal
        {{ $$ = [$1]; }}
    | item_list literal
        {{ $$ = $1.concat($2); }}
    ;
