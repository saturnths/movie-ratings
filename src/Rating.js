import React, {Component} from "react";
import * as PropTypes from "prop-types";
import axios from "axios";

export class Rating extends Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }
    delete() {
        const { imdbID, ratingIsRemoved } = this.props;
        const endpoint = `http://localhost:9292/remove-rating/${imdbID}`;
        axios
            .delete(endpoint)
            .then(function(response) {
                ratingIsRemoved(imdbID);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    render() {
        const { rating, notes, title, className} = this.props;
        const classN = `${className} rating-component centered`;
        return <div className={classN}>
            <form>
                {title &&
                <div className="form-group">
                    <label>Title:</label> <span>{title}</span>
                </div>}
                <div className="form-group">
                    <label>Rating:</label> <span>{rating}</span>
                </div>
                <div className="form-group">
                    <label>Notes:</label> <span>{notes}</span>
                </div>
                <button type='button' className="btn btn-default btn-xs" onClick={this.delete}>
                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button>
            </form>
        </div>;
    }
}


Rating.propTypes = {
    rating: PropTypes.number,
    notes: PropTypes.string,
    imdbID: PropTypes.string.isRequired,
    title: PropTypes.string,
    ratingIsRemoved: PropTypes.func.isRequired,
};