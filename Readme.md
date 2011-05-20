On-demand image manipulation server in node.js

    # on the fly resize
    http://localhost:3000/resize?url=http://www.google.com/intl/en_ALL/images/logo.gif&size=200x200

    # if secret is provided config/config.json only works for hashed params
    http://localhost:3000/resize/-hash-?url=http://www.google.com/intl/en_ALL/images/logo.gif&size=200x200

    # magic hash code that is valid for all requests, e.g. for testing
    http://localhost:3000/resize/-magic-hash-?url=http://www.google.com/intl/en_ALL/images/logo.gif&size=200x200

    # append any fancy name for nice looking urls and image downloads
    http://localhost:3000/resize/-hash-/Fancy-Ignored-Name.jpg?url=http://www.google.com/intl/en_ALL/images/logo.gif&size=200x200


# Start
    PORT=3000 node app.js
