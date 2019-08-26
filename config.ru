# frozen_string_literal: true

require 'rack'
require 'rubygems'
require 'bundler'

Bundler.require

require './app'

raise APIKeyError, 'No OMDB key was found.' if ENV['OMDB_KEY'].nil?

use Rack::PostBodyContentTypeParser
run MoviesApp
