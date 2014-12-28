# BetterContent Server and Web Client

![Demo](invalidate_BetterContentDemo.gif)

__Work in progress.__

Dead simple webpage to edit in runtime any iOS application:
 - install the [BetterContent cocoa pod](https://github.com/gardenofwine/better-content-client-ios) in your native app.
 - run this node server locally or in Heroku
 - edit the server host in your xcode project by editing  `BTCConstants.h` 
 - launch your app and browser.
 - play with the apps content to you satisfaction.

## Implementation details

This repository contains the code for:
 1. The server coordinating between an iOS BetterContent enabled application to the BetterContent web application. (Communication is done via [einaros/ws](http://einaros.github.io/ws/) WebSockets implementation.)
 1. The BetterContent web application.

## Running locally

 1. install node.js
 1. from the project directory
 
     `npm install`
 1. to run the server
 
 		`gulp`

## Running on Heroku

``` bash
heroku create
git push heroku master
heroku open
```

## TODOS

 1. Support text areas (refactor UIView handling)
 1. Refactor web client code
 1. Support multiple dimesion iOS (iPads, iPhone5, iPhone6)
 1. Create an Heroku template for easy cloning.
