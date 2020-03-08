import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorPanel extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        setError: PropTypes.func.isRequired,
    };

    render() {
        const {error, setError} = this.props;
        if (!error) {
            return <div/>
        }
        return (<div className="alert alert-danger fade show"
                     role="alert">
            {error}
            <button type="button" className="close" aria-label="Close"
                    onClick={e => setError("")}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>);
    }
}
