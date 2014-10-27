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

 1. Support text areas (refactor UIView handling)
 1. only send to client modified labels
 1. refactor
