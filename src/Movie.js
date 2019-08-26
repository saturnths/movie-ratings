import React, {Component} from 'react';
import Modal from 'react-modal';
import {RateModal} from "./RateModal";
import axios from "axios";
import {Rating} from "./Rating";

const stripNA = (params) => {
    let newParams = {};
    for (let p in params) {
        const value = params[p];
        newParams[p.toLowerCase()] = value !== 'N/A' ? value : '';
    }
    return newParams;
};

Modal.setAppElement('#root');

class Movie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            hasRating: false,
            rating: 0,
            notes: "",
        };


        this.save = this.save.bind(this);
        this.onRatingChange = this.onRatingChange.bind(this);
        this.onNotesChange = this.onNotesChange.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.rate = this.rate.bind(this);
        this.ratingIsRemoved = this.ratingIsRemoved.bind(this);
    }

    componentDidMount() {
        const { imdbID } = this.props;
        const endpoint = `http://localhost:9292/rating/${imdbID}`;
        const self = this;
        axios
            .get(endpoint)
            .then(function(response) {
                if (response.data.imdbID === imdbID) {
                    const { rating, notes } = response.data;
                    self.setState({
                        rating, notes, hasRating: true,
                    });
                }
            })
            .catch(function(error) {
                // 404 can mean the rating was not found on the server
                if (error.response.status !== 404) {
                    console.log(error);
                }
            });
    }

    onRatingChange(e) {
        this.setState({ rating: e.target.value });
    }
    onNotesChange(e) {
        this.setState({ notes: e.target.value });
    }
    save() {
        const { imdbID } = this.props;
        const { rating, notes, hasRating } = this.state;
        const { title }  = stripNA(this.props.data);
        const endpoint = hasRating ? `http://localhost:9292/update-rating/${imdbID}` : "http://localhost:9292/new-rating";
        const params = {
            imdbID,
            rating,
            notes,
            title,
        };
        const self = this;
        axios
            .post(endpoint, params)
            .then(function(response) {
                self.setState({hasRating: true});

            })
            .catch(function(error) {
                console.log(error);
            });
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }
    rate() {
        this.setState({modalIsOpen: true});
    }
    ratingIsRemoved() {
        this.setState({hasRating: false, rating: 0, notes: ''});
    }
    render() {
        const { imdbID } = this.props;
        const { rating, notes, hasRating } = this.state;
        const { title, year, plot, poster } = stripNA(this.props.data);
        const posterImage = (poster!== 'N/A' && poster) || './placeholder.png';
        return (
            <div className="Movie">
                <div className="row">
                    <div className="row">
                        <img src={posterImage} alt="Poster"/>
                    </div>
                    <div className="row"><h2>{title}</h2></div>
                    <div className="row"><label>Year:</label> {year}</div>
                    <p>{plot}</p>

                    {hasRating && <Rating rating={rating} notes={notes} imdbID={imdbID} ratingIsRemoved={this.ratingIsRemoved} />}

                    <input
                        className="btn btn-primary btn-lg rate-btn"
                        type="button"
                        value={hasRating ? "Edit rating" : "Rate!"}
                        onClick={this.rate}
                    />
                    <RateModal
                        imdbID={imdbID}
                        hasRating={hasRating}
                        rating={rating}
                        notes={notes}
                        open={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        onRatingChange={this.onRatingChange}
                        onNotesChange={this.onNotesChange}
                        save={this.save}
                    />
                </div>
            </div>
        );
    }
}

export default Movie;
