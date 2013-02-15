{spawn, exec} = require 'child_process'
path = require 'path'
stitch = new require('../../../dna/stitch')
Package = new stitch.Package {}

exec "cake cafebuild", (error, stdout, stderr) ->
    unless error
        files = JSON.parse stdout

        sources = {}

        for [fn, source] in files
            ext_length = (path.extname fn).length
            filename = fn.slice 0, -ext_length
            sources[filename] = {filename: fn, source: source}

        result = Package.get_result_bundle sources
        console.log result
    else
        console.log error
