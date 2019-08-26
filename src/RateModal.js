import React, {Component} from "react";
import Modal from "react-modal";
import * as PropTypes from "prop-types";
import $ from 'jquery';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export class RateModal extends Component {
    constructor(props) {
        super(props);

        this.onRatingChange = this.onRatingChange.bind(this);
        this.onNotesChange = this.onNotesChange.bind(this);
        this.save = this.save.bind(this);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {rating, notes} = nextProps.rating;
        this.setState({ rating, notes });
    }

    onRatingChange(e) {
        this.props.onRatingChange(e);
    }

    onNotesChange(e) {
        this.props.onNotesChange(e);
    }

    save(e) {
        const $form = $('#modal');
        if (!$form[0].checkValidity()) {
            $form.find(':submit').click();
        } else {
            e.preventDefault();
            this.props.save();
            this.props.onRequestClose();
            return false;
        }
    }

    render() {
        const { rating, notes } = this.props;
        return <div>
            <Modal
                isOpen={this.props.open}
                onAfterOpen={this.props.onAfterOpen}
                onRequestClose={this.props.onRequestClose}
                style={customStyles}
                contentLabel="Rate"
            >
                <h3>Rate this movie:</h3>
                <form id="modal">
                    <div className="form-group">
                        <label htmlFor="rating">Rating (0-5):</label>
                        <input
                            type="number"
                            className="textbox"
                            id="rating"
                            onChange={this.onRatingChange}
                            value={rating}
                            min="0"
                            max="5"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">Notes:</label>
                        <input type="text" className="textbox" id="notes" onChange={this.onNotesChange} value={notes}/>
                    </div>

                    <input className="btn btn-primary btn-lg" value="Save" type="button" onClick={this.save} />
                    <input className="btn btn-primary btn-lg hidden" type="submit" />
                    <input className="btn btn-default btn-lg" type="button" value="Cancel" onClick={this.props.onRequestClose}/>
                </form>
            </Modal>
        </div>;
    }
}

RateModal.propTypes = {
    ref: PropTypes.func,
    open: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func
};