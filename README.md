# Movies
Sinatra, mongodb, and react app that makes use of OMDb API. Search movies and save your ratings/comments.

## Get started:
* `bundle` to install gem dependencies.
* `mongod` to run a MongoDB server.
* `export OMDB_KEY=XYZ` to set the api key, where XYZ is your key. Otherwise the app will not start.
* `bundle exec puma` or `bundle exec rackup` to start the Sinatra server at localhost:9292.
* `npm install` to install node dependencies.
* `npm start` to run the React server at localhost:3001.

## Linting:
* `npm run lint` for react and javascript eslint linting.
* `rubocop` for ruby linting.

## TODO:
* A minimum of 2 characters to start searches (as opposed to 1 character minimum).
* More sanity checks (error handling), data type checking (e.g. string vs number).
* Resolve remaining linting issues.
* Tests (enzyme, rack-test).
* Make production/Heroku ready: use Procfile, set the OMDB_KEY environment variable, and use the prod version of frontend (`npm run build`).
