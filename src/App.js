import React, {Component} from 'react';
import './App.css';
import Movie from "./Movie";
import axios from "axios";
import {Rating} from "./Rating";

const ENTER_KEY = 13;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: {},
            ratings: [],
        };

        this.search = this.search.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.showResults = this.showResults.bind(this);
        this.showRatings = this.showRatings.bind(this);
        this.ratingIsRemoved = this.ratingIsRemoved.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.keyPress);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyPress);
    }

    keyPress(event){
        if (event.keyCode === ENTER_KEY) {
            this.search();
        }
    }

    onQueryChange(e) {
        this.setState({query: e.target.value});
    }
    search() {
        const self = this;
        const query = this.state.query;
        if (!query) return;
        const endpoint = "http://localhost:9292/query_movie/" + query;
        axios
            .get(endpoint)
            .then(function(response) {
                if (response.data.Response === "True") {
                    self.setState({results: response.data, ratings: []});
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    showResults() {
        const {results} = this.state;
        return results.Title;
    }
    showRatings() {
        this.setState({results: {}});
        const self = this;
        const endpoint = "http://localhost:9292/ratings";
        axios
            .get(endpoint)
            .then(function(response) {
                self.setState({ ratings: response.data });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    ratingIsRemoved(imdbID) {
        this.setState(prevState => ({ratings: prevState.ratings.filter(r => r.imdbID !== imdbID)}));
    }
    render() {
        const {results, query} = this.state;
        const {imdbID} = results;
        return (
            <div className="App">
                <div className="container">

                    <div className="row marketing">
                        <div>
                            <h1>Movies</h1>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control search-textbox"
                                    placeholder="Search for..."
                                    value={query}
                                    onChange={this.onQueryChange}
                                />
                                <span className="input-group-btn">
                                    <button className="btn btn-default btn-lg" type="button" disabled={!query}
                                    onClick={this.search}>Go!</button>
                                </span>
                            </div>
                            {this.showResults() && <Movie key={imdbID} imdbID={imdbID} data={results} />}

                            <div className="row padded-row">
                                <input className="btn btn-default btn-lg" type='button' value='Show ratings' onClick={this.showRatings}/>

                                <div className="row padded-row">
                                    {this.state.ratings.map(r => <Rating key={r.imdbID} className="ratings-list-item" title={r.title} rating={r.rating} notes={r.notes} imdbID={r.imdbID} ratingIsRemoved={this.ratingIsRemoved} />)}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default App;
