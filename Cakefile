{spawn} = require 'child_process'


build = ->
    coffee = spawn 'coffee', ['-c', '-o', 'lib-js', 'src']
    coffee.stderr.on 'data', (data) ->console.log data
    coffee.stdout.on 'data', (data) -> console.log data
    coffee.on 'exit', (code) ->
        (console.log "dna build is done") if code is 0
    
task 'build', 'simple build', ->
    build()




