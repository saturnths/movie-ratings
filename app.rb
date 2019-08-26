# frozen_string_literal: true

require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json/ext'
require 'json'
require 'httparty'
require 'sinatra/cross_origin'

class APIKeyError < StandardError
end

# Backend for the Movies app.
class MoviesApp < Sinatra::Base
  configure do
    enable :cross_origin
  end

  before do
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
  end

  options '*' do
    headers = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE'
    response.headers['Access-Control-Allow-Headers'] = headers
    200
  end

  configure do
    db = Mongo::Client.new(['127.0.0.1:27017'], database: 'movies')
    set :mongo_db, db[:ratings]
  end

  before do
    content_type 'application/json'
  end

  get '/' do
    'Hello'
  end

  # saves a new rating
  post '/new-rating/?' do
    db = settings.mongo_db
    payload = JSON.parse(request.env['rack.input'].read)
    db.insert_one payload

    status 200
  end

  # updates a rating
  # returns a list of all existing ratings
  post '/update-rating/:imdbID/?' do
    content_type :json
    imdb_id = params[:imdbID]
    settings.mongo_db.find(imdbID: imdb_id).find_one_and_update('$set' => request.params)
    settings.mongo_db.find.to_a.to_json
  end

  delete '/remove-rating/:imdbID' do
    content_type :json
    db = settings.mongo_db
    imdb_id = params[:imdbID]
    documents = db.find(imdbID: imdb_id)
    if !documents.to_a.first.nil?
      documents.find_one_and_delete
      { success: true }.to_json
    else
      { success: false }.to_json
    end
  end

  get '/rating/:imdbID/?' do
    db = settings.mongo_db
    content_type :json
    doc = db.find(imdbID: params[:imdbID]).to_a.first
    if doc then doc.to_json
    else status 404
    end
  end

  get '/ratings/?' do
    content_type :json
    settings.mongo_db.find.to_a.to_json
  end

  get '/query_movie/:title/?' do
    title = params['title']
    omdb_key = ENV['OMDB_KEY']
    url = "http://www.omdbapi.com/?apikey=#{omdb_key}&t=#{title}&plot=short"
    begin
      response = HTTParty.get(url)
    rescue HTTParty::Error
      puts 'There was a http issue connecting to omdbapi.'
      raise
    rescue StandardError
      raise
    end

    res = JSON.parse(response.body)
    content_type :json
    res.to_json
  end
end
