{spawn} = require 'child_process'


build = ->
    coffee = spawn 'coffee', ['-c', '-o', 'lib-js', 'src']
    coffee.stderr.on 'data', (data) ->console.log data.toString()
    coffee.stdout.on 'data', (data) -> console.log data.toString()
    coffee.on 'exit', (code) ->
        console.log "dna build done, rc=", code
    
task 'build', 'simple build', ->
    build()




