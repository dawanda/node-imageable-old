On-demand image manipulation server in node.js

    # on the fly resize (fit image to given size)
    http://localhost:3000/fit?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x200

    # if secret is provided config/config.json only works for hashed params
    http://localhost:3000/fit/-hash-?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x200

    # magic hash code that is valid for all requests, e.g. for testing
    http://localhost:3000/fit/-magic-hash-?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x200

    # append any fancy name for nice looking urls and image downloads
    http://localhost:3000/fit/-hash-/Fancy-Ignored-Name.gif?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x200

    # crop
    http://localhost:3000/crop?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&crop=200x200

    # crop + resize(fit) cropped section
    http://localhost:3000/crop?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&crop=200x200&size=100x50

# Start
    NODE_ENV=development node app.js

# Hashing
To make sure nobody missuses your image-server you can enable hashing in the config.config.json and all requests must be hashed.

    # Node
    var MD5 = require('crypto/md5')
    var query = {
      url: 'http://www.google.com/intl/en_ALL/images/logo.gif',
      size: '200x400'
    }.toQuery()
    var hash = MD5.digest(query).first(8)
    var url = "http://localhost:3000/resize/" + hash + "/Very-Nice-Image.gif?" + query

    # RUBY
    TODO

# Running the tests
    
    node_modules/vows/bin/vows test/*.test.js

# TODO

 - add 'crop'
 - add 'expand' which would add whitespace to fill missing image areas
 - test cannot write response body in correct encoding for identify

# Authors

DaWanda Gmbh
