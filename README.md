# BetterContent Server and Web Client

Coordinating between an iOS BetterContent enabled application to the BetterContent web application. Communication is done via [einaros/ws](http://einaros.github.io/ws/) WebSockets implementation.

# Running on Heroku

``` bash
heroku create
heroku labs:enable websockets
git push heroku master
heroku open
```