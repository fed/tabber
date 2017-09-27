# Tabber

Scrollable navigation tabs ui-component.

> Created with [generator-ui-component](https://github.com/fknussel/generator-ui-component).

## Prerequisites

1. Setup [npm](https://nodejs.org/) properly for your development environment.
2. Run `npm install -g grunt-cli` to to install Grunt's command line interface (CLI) globally (you might as well use `npm start`, `npm build` and `npm test` if you don't want to install `grunt-cli` globally since it comes shipped as a dev dependency).

## Setup

```
yarn install
```

## Run tests

```
yarn test
```

## Build assets

```
yarn build
```

## Build, run and watch for changes

```
yarn start
```

## Creating your module

1. Edit mustache, Sass and JavaScript files in `./src` (e.g. `./src/tabber.mustache`, `./src/tabber.scss`, and `./src/tabber.js`).

## Styleguide

Further use cases for the styleguide can be added to the data model file on `./model/usecases.json`.

4. Build and run the app, and visit [http://localhost:4567](http://localhost:4567) in your browser.

## Releasing new versions

This repo uses [Semantic Versioning](http://semver.org/) and tag releases. To release a new version, run the appropriate command:

```
npm version major       # bump major version, eg. 1.0.2 -> 2.0.0
npm version minor       # bump minor version, eg. 0.1.3 -> 0.2.0
npm version patch       # bump patch version, eg. 0.0.1 -> 0.0.2
npm version prerelease  # bump pre-release version, eg. 1.0.0 -> 1.0.0-1
```

Given a version number `MAJOR.MINOR.PATCH`, increment the:

1. `MAJOR` version when you make incompatible API changes,
2. `MINOR` version when you add functionality in a backwards-compatible manner, and
3. `PATCH` version when you make backwards-compatible bug fixes.

Make sure to push tags:

```
git push --tags origin master
```

Publish the package to [npm's public registry](https://www.npmjs.com/):

```
npm publish
```

**Heads up!** To publish, you must have a user on the npm registry. If you don't have one, create it with `npm adduser`. If you created one on the site, use `npm login` to store the credentials on the client. You can use `npm config ls` to ensure that the credentials are stored on your client. Check that it has been added to the registry by going to [http://npmjs.com/~](http://npmjs.com/~).
