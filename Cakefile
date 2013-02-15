fs = require 'fs'
path = require 'path'
CS = require 'coffee-script'

ENC = 'utf8'

SRC_DIR = path.resolve __dirname, './src'
DEPS_DIR = path.resolve __dirname, './deps'


build = ->
    compile_cs_file = (fn) ->
        file = fs.readFileSync(path.resolve SRC_DIR, fn).toString()

        {filename: (if fn is 'dna.coffee' then 'index.coffee' else fn), source: (CS.compile file), type:"commonjs"}

    deps_map = (file) ->
        filename: file
        source: fs.readFileSync(path.join DEPS_DIR, file).toString()
        type:"plainjs"

    deps = (fs.readdirSync DEPS_DIR).map deps_map
    sources = (fs.readdirSync SRC_DIR).map compile_cs_file
    deps.concat sources


task 'cafebuild', 'build with cafe', ->
    process.send JSON.stringify build()

task 'build', 'simple build', ->
    fs.writeFileSync "out/dna.js", build()

task 'show_build', 'show build output', ->
    console.log JSON.stringify build()



