# Tabber

Scrollable navigation tabs.

> Created with [generator-ui-component](https://github.com/fknussel/generator-ui-component).

## Prerequisites

1. Setup [npm](https://nodejs.org/) properly for your development environment.
2. Run `npm install -g grunt-cli` to to install Grunt's command line interface (CLI) globally (you might as well use `npm start`, `npm build` and `npm test` if you don't want to install `grunt-cli` globally since it comes shipped as a dev dependency).

## Setup

```
npm install
```

## Run tests

```
grunt test
```

## Build assets

```
grunt build
```

## Build, run and watch for changes

```
grunt
```

## Creating your module

1. Edit mustache, Sass and JavaScript files in `./src` (e.g. `./src/tabber.mustache`, `./src/tabber.scss`, and `./src/tabber.js`).
2. Add mock JSON data model to `./model/usecases.json`.
4. Build and run the app, and visit [http://localhost:4567](http://localhost:4567) in your browser.

## Release versions

This repo uses [grunt-bump](https://github.com/gruntjs/grunt-bump) and Semantic Versioning to version and tag releases. To release a new version, run the appropriate command:

```
grunt release:major       # bump major version, eg. 1.0.2 -> 2.0.0
grunt release:minor       # bump minor version, eg. 0.1.3 -> 0.2.0
grunt release:patch       # bump patch version, eg. 0.0.1 -> 0.0.2
grunt release:prerelease  # bump pre-release version, eg. 1.0.0 -> 1.0.0-1
```

Make sure to push tags:

```
git push --tags origin master
```

Publish the package to [npm's public registry](https://www.npmjs.com/):

```
npm publish
```

**Heads up!** To publish, you must have a user on the npm registry. If you don't have one, create it with `npm adduser`. If you created one on the site, use `npm login` to store the credentials on the client. You can use `npm config ls` to ensure that the credentials are stored on your client. Check that it has been added to the registry by going to [http://npmjs.com/~](http://npmjs.com/~).

## Semantic versioning

Given a version number `MAJOR.MINOR.PATCH`, increment the:

1. `MAJOR` version when you make incompatible API changes,
2. `MINOR` version when you add functionality in a backwards-compatible manner, and
3. `PATCH` version when you make backwards-compatible bug fixes.

See the [Semantic Versioning](http://semver.org/) specification for more information.

## Release history

See the [CHANGELOG](CHANGELOG.md).
