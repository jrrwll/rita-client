import React from 'react';
import PropTypes from "prop-types";

export default class PaginationPanel extends React.Component {
    static propTypes = {
        pattern: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    };

    totalPage() {
        const total = this.props.total;
        const size = this.props.size;
        const offset = total % size === 0 ? 0 : 1;
        return Math.floor(total / size) + offset;
    }

    leftArrowQuo() {
        const page = this.props.page;
        if (page === 1) {
            const prev = this.props.pattern.replace('%d', `${page}`);
            return (
                <li className="page-item disabled">
                    <a className="page-link" href={`${prev}`} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            );
        } else {
            const prev = this.props.pattern.replace('%d', `${page - 1}`);
            return (
                <li className="page-item">
                    <a className="page-link" href={`${prev}`} aria-label="Previous">
                        <span aria-hidden="false">&laquo;</span>
                    </a>
                </li>
            );
        }
    }

    rightArrowQuo() {
        const pattern = this.props.pattern;
        const page = this.props.page;
        const totalPage = this.totalPage();
        if (page === totalPage) {
            const next = pattern.replace('%d', `${page}`);
            return (
                <li className="page-item disabled">
                    <a className="page-link" href={`${next}`} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            );
        } else {
            const next = pattern.replace('%d', `${page + 1}`);
            return (
                <li className="page-item">
                    <a className="page-link" href={`${next}`} aria-label="Previous">
                        <span aria-hidden="false">&raquo;</span>
                    </a>
                </li>
            );
        }
    }

    render() {
        const pattern = this.props.pattern;
        const page = this.props.page;
        const totalPage = this.totalPage();

        // [1, prev,current,next,last]
        const slice = [];
        [1, page - 1, page, page + 1, totalPage].forEach(k => {
            if (k > totalPage || k < 1) return;
            if (slice.indexOf(k) === -1) {
                slice.push(k);
            }
        });

        return (
            <div className="container-fluid">
                <nav aria-label="pagination" style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    <ul className="pagination justify-content-center">
                        {this.leftArrowQuo()}
                        {slice.map(k => (
                            <li className="page-item" key={k}>
                                <a className="page-link link-secondary"
                                   href={`${pattern.replace('%d', `${k}`)}`}>
                                    {k}
                                </a>
                            </li>
                        ))}
                        {this.rightArrowQuo()}
                    </ul>
                </nav>
            </div>
        );
    }
}
