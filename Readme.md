# star-trek-roman-timeline.de

A website presenting an overview of german Star Trek novels.

## TODO

- All the implementing stuff…
- Replace H5BP (fav)icons with real icons.
- Test font stack on various OSes and consider alternatives (see ``src/scss/01_globals/_fonts.scss``).
- WebP version of background image including [modernizr test](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/webp.js).
- After launch: Revisit H5BP's original .htaccess to check if there are topics I forgot along the way.
- Maybe integrate [grunt-protactor-coverage](https://www.npmjs.com/package/grunt-protractor-coverage)?


## Environment installation

Most of the installation can be done by npm (just do ``npm install``), but there are some manual things to do.

### Test Environment
#### Install Selenium Server
``node_modules/protractor/bin/webdriver-manager update``
This downloads Selenium and the Chrome webdriver. On OSX I was prompted to install Java RE by the OS X Software Center.

#### Install Safari WebDriver Extension manually
See [Selenium Issue 7933: Since updating to Safari 6.2 or 7.1 unable to establish a connection with the SafariDriver extension (comment 23)](https://code.google.com/p/selenium/issues/detail?id=7933#c23).

#### Initialize environment for Appium
``node_modules/appium/bin/appium-doctor.js --ios``
``sudo node_modules/appium/bin/authorize-ios.js``
Having a look at https://github.com/appium/appium/blob/master/docs/en/appium-setup/running-on-osx.md doesn't hurt either.
