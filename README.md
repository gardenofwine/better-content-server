# BetterContent Server and Web Client

Coordinating between an iOS BetterContent enabled application to the BetterContent web application. Communication is done via [einaros/ws](http://einaros.github.io/ws/) WebSockets implementation.

# Running on Heroku

``` bash
heroku create
heroku labs:enable websockets
git push heroku master
heroku open
```

# TODO

 1. When server connects after the client, hook them together
 1. When client disconnects and another connects, hook server
 1. Support text areas (refactor UIView handling)
 1. read server from plist or some config file in hosting app
 1. only send to client modified labels
 1. refactor
