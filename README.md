# app-web-campaign-management

VueJS web app for Pryv campaign management

*Prerequisites*: Node v8+, Yarn v1+

## Usage

- Download dependencies: `yarn install`

- Serve with hot reload at localhost:8080: `yarn dev`

- Build for production with minification: `yarn build`

- Build for production and view the bundle analyzer report: `yarn build --report`

## Deploy to GH-pages

1. Build: `yarn build`
2. Copy to gh-pages: `cp -R dist/ gh-pages/`
3. Make links relative (Remove first `/`)
4. Commit and push

### Known issues

- When you have the following error: `Error: getaddrinfo ENOTFOUND http://localhost` upon launching the server with `yarn dev` or `yarn build`, define a new hostname pointing to `127.0.0.1` in your `/etc/hosts` file and add the `--host NEW_HOSTNAME` option in your script as it is done in the `dev2` script.  