import React from "react";
import PropTypes from 'prop-types';

export default class TagPanel extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,
    };

    state = {
        color: "#f6f6f6",
    };

    render() {
        const {color} = this.state;
        const {tag} = this.props;
        return (
            <div className="mb-1 mt-2 mr-2 d-block card" style={{
                background: color,
            }} onMouseEnter={e => {
                this.setState({
                    color: "#ddd"
                });
            }} onMouseLeave={e => {
                this.setState({
                    color: "#f6f6f6",
                });
            }}>
                <a className="no-underline p-2" style={{
                    color: "#a6a7a8",
                }} href={`/tag/${tag.id}`}>
                    {tag.name}
                </a>
            </div>
        );
    }
}
