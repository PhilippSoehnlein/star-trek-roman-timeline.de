# star-trek-roman-timeline.de

[![Build Status](https://travis-ci.org/PhilippSoehnlein/star-trek-roman-timeline.de.svg?branch=master)](https://travis-ci.org/PhilippSoehnlein/star-trek-roman-timeline.de)

A website presenting an overview of german Star Trek novels.

## Sources for plot times and reading orders
* Memory Alpha: [german](http://de.memory-alpha.org/wiki/Hauptseite), [english](http://en.memory-alpha.org/wiki/Portal:Main)
* [Memory Beta](http://memory-beta.wikia.com/wiki/Main_Page)
* [Star Trek post-Nemesis reading order](http://www.shastrix.com/books/star-trek-reading-order.php)
* [Post-Nemesis: Year By Year](http://startreklitverse.yolasite.com/post-nemesis-year-by-year.php)
* [Relaunch novels timeline in Memory Beta](http://memory-beta.wikia.com/wiki/Relaunch_novels_timeline)
* [The Almighty Star Trek Lit-verse Reading Order Flow Chart](http://www.thetrekcollective.com/p/trek-lit-reading-order.html)
* [John Smith](https://www.facebook.com/profile.php?id=100004745084854&sk=photos)
* The actual books ;-)

## Stardate calculators

Calculating stardates is also often necessary (and confusing).
* [Trekguide offers some good calculators.](http://trekguide.com/Stardates.htm)
* [Trekzone](http://www.trekzone.de/sfrs/stardate.php)

## TODO

- Replace H5BP (fav)icons with real icons.
- Test font stack on various OSes and consider alternatives (see ``src/scss/01_globals/_fonts.scss``).
- WebP version of background image including [modernizr test](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/webp.js).
- After launch: Revisit H5BP's original .htaccess to check if there are topics I forgot along the way.
- Maybe integrate [grunt-protactor-coverage](https://www.npmjs.com/package/grunt-protractor-coverage)?
- Figure out what dependencies in package.json are real dependencies to make the app run and which are just devDependencies.
- Stuff from the JSON file should also get ``<span lang="en">`` if strings contain english texts.
- All the other TODOs stated in the source code.

## Environment installation

Most of the installation can be done by npm (just do ``npm install``), but there are some manual things to do.

### Test Environment
#### Install Selenium Server
``node_modules/protractor/bin/webdriver-manager update``
This downloads Selenium and the Chrome webdriver. On OSX I was prompted to install Java RE by the OS X Software Center.

#### Install Safari WebDriver Extension manually
See [Selenium Issue 7933: Since updating to Safari 6.2 or 7.1 unable to establish a connection with the SafariDriver extension (comment 23)](https://code.google.com/p/selenium/issues/detail?id=7933#c23).

#### Initialize environment for Appium / iOS
``node_modules/appium/bin/appium-doctor.js --ios``
``sudo node_modules/appium/bin/authorize-ios.js``
Having a look at https://github.com/appium/appium/blob/master/docs/en/appium-setup/running-on-osx.md doesn't hurt either.

#### Install environment for Appium / Android
See http://angular.github.io/protractor/#/mobile-setup#setting-up-protractor-with-appium-android-chrome

#### IE
- Set Network Mode to Bridge mode in Virtual Box
- Install Java on Windows VM: https://www.java.com/de/download/
- Download Selenium Standalone Server on Windows VM http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar
- Download IEDriver http://selenium-release.storage.googleapis.com/2.44/IEDriverServer_Win32_2.44.0.zip and move to C:\WINDOWS\SYSTEM32
- Start IEDriver Server once (this is only needed for unlocking Windows Firewall stuff).
- Set all the IE- and Registry-options stated here: https://code.google.com/p/selenium/wiki/InternetExplorerDriver#Required_Configuration
- Start Selenium Grid on OS X: ``java -jar ./node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar -role hub``
- Register Selenium Node at the Grid on Windows VM: ``java -jar selenium-server-standalone-2.44.0.jar -role node -hub "http://your-ip.4444/grid/register" -port 4444 -maxSession 1 -browser "maxInstances=1,browserName=internet explorer,version=11"``
- ``cd ~/path/to/working/copy && grunt build:test && cd build && serve -p 8001``
- Run tests like this: ``/path/to/working/copy/node_modules/protractor/bin/protractor /path/to/working/copy/test/e2e/etc/protractor-desktop-browser.js --seleniumAddress http://localhost:4444/wd/hub --specs "/path/to/working/copy/test/e2e/*.js" --browser "internet explorer"``

#### Code Coverage
Code coverage reports for all unit tests can be generated like this (no grunt task yet):
``node_modules/istanbul/lib/cli.js cover node_modules/grunt-jasmine-node/node_modules/jasmine-node/bin/jasmine-node test/spec/``
