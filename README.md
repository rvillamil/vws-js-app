# VWS: Video WebSite Scraper - JS Version

JavaScript version for [VWS](https://github.com/rvillamil/vws) project. Another pet project more...

Mainly uses my module called [wvs-js-lib](https://github.com/rvillamil/vws-js-lib) for web-scraping purposes.

Packed for Desktop with [Electron](https://electronjs.org/) support

## Using

You can [download the latest release](https://github.com/rvillamil/vws-js-app/releases) for your operating system or build it yourself (see below).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Run local

You'll need [Node.js](https://nodejs.org/es/) installed on your computer in order to build this library.

```sh
$git clone https://github.com/rvillamil/vws-js-app
```

then ..

```sh
$npm install
```

and finally ..

```sh
$npm start
```

### Development

Maybe you'll need install [wvs-js-lib](https://github.com/rvillamil/vws-js-lib) at same level folder. e.g.

```sh
vws-js
 + vws-js-lib
 + vws-js-app
```

..then [Link npm module](https://goo.gl/fppRvN) before 'start'

```sh
$npm install && npm link ../vws-js-lib && electron .
```

#### Development tools: http-server

For testing the UI, whithout Electron, you can use http server, like [http-server](https://www.npmjs.com/package/http-server) and run on local

- Install http-server
  
```sh
$npm install -g http-server
```

- Run on directory /app
  
```sh
$http-server .
```

### Release on Github

We will look at how to create MacOS, Windows and Linux executables with an app icon. Maybe you need read [official documentation](https://www.electron.build/) on packaging problems

First update text files:

- Update CHANGELOG.md
- Update package.json with the new version
- Export Github Token
  
```sh
$export GH_TOKEN="{{Github Token}}"
```

- Publish release
  
```sh
$npm run release
```

### How-to create package on several platforms

Maybe need create a package for :

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

- [Christian Engvall](https://github.com/crilleengvall) and his [electron-tutorial-app](https://github.com/crilleengvall/electron-tutorial-app)