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
    + vws-js-lib
    + vws-js-app
```

Third step: [Link npm module](https://goo.gl/fppRvN)

```sh
$cd vws-js-app
$npm install && npm link ../vws-js-lib # npm install breaks the link ..
```

and finally...

```sh
$npm start
```

### Electron builder

We will look at how to create MacOS, Windows and Linux executables with an app icon. Maybe you need read [official documentation](https://www.electron.build/) on packaging problems

#### Package on platform

##### OSX

```sh
$npm run package-mac
```

##### Windows

```sh
$npm run package-win
```

##### Linux

```sh
$npm run package-linux
```

##### All platforms

```sh
$npm run package-all
```

### Development tools

#### http-server

For testing the UI, whithout Electron, you can use http server, like [http-server](https://www.npmjs.com/package/http-server) and run on local

- Install http-server
  
```sh
$npm install -g http-server
```

- Run on directory /app
  
```sh
$http-server .
```

#### How-to publish on GitHub: Draft Release

First update text files:

- Update CHANGELOG.md
- Update package.json with the new version

Draft on GitHub

```sh
$npm run release
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rvillamil/vws-js-app/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Christian Engvall](https://github.com/crilleengvall) and his [electron-tutorial-app](https://github.com/crilleengvall/electron-tutorial-app)