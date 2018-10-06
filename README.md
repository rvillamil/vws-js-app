# VWS: Video WebSite Scraper - JS Version

JavaScript version for [VWS](https://github.com/rvillamil/vws) project. Another pet project more...

Mainly uses my module called [wvs-js-lib](https://github.com/rvillamil/vws-js-lib) for web-scraping purposes.

Packed for Desktop with [Electron](https://electronjs.org/) support

## Using

You can [download the latest release](https://github.com/rvillamil/vws-js-app/releases) for your operating system or build it yourself (see below).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

You'll need [Node.js](https://nodejs.org/es/) installed on your computer in order to build this library.

First step

```sh
$git clone https://github.com/rvillamil/vws-js-app
```

Second step

You'll need install [wvs-js-lib](https://github.com/rvillamil/vws-js-lib) at same level folder. e.g.

```sh
-- vws-js
    -- vws-js-lib
    -- vws-js-app
```

Third step: [Link npm module](https://goo.gl/fppRvN)

```sh
$cd vws-js-app
$npm link ../vws-js-lib
```

and finally...

```sh
$npm install && npm start
```

### Electron packager

We will look at how to create MacOS, Windows and Linux executables with an app icon. Maybe you need read [official documentation](https://github.com/electron-userland/electron-packager) on packaging problems

#### OSX

```sh
$npm run package-mac
```

#### Windows

```sh
$npm run package-win
```

#### Linux

```sh
$npm run package-linux
```

#### All platforms

```sh
$npm run package-all
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rvillamil/vws-js-app/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments 
* [Christian Engvall](https://github.com/crilleengvall) and his [electron-tutorial-app]( https://github.com/crilleengvall/electron-tutorial-app)