import React from 'react';
import "css/main.scss";

class Star extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.callbackEvent) {
            this.props.callbackEvent();
        }
    }
    render() {
        let starClass = "glyphicon glyphicon-star star";
        starClass += this.props.selected ? " selected" : "";
        return <li className={starClass} onClick={this.handleClick} />;
    }
}

export default class StarsGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: this.props.initScore || this.props.value || 0,
        };
    }

    componentWillReceiveProps(props) {
        if (props.value !== this.state.score) {
            this.setState({
                score: props.value,
            });
        }
    }
    getStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(
                <Star
                    key={i} selected={this.state.score > i}
                    callbackEvent={this.handleClick.bind(this, i)}
                />
            );
        }
        return stars;
    }
    handleClick(index) {
        let score = index + 1;
        if (this.state.score === score) {
            score = 0;
        }
        if (this.props.callbackEvent) {
            this.props.callbackEvent(score);
        }
        this.setState({
            score,
        });
    }
    render() {
        const count = this.props.count || 5;
        return (
            <label className="stars-group-wrapper">
                {
                    this.props.label?<strong>{this.props.label}</strong>: null
                }

                {/*<span>{this.state.score}</span>*/}
                <ul className="stars-group">
                    {this.getStars(count)}
                </ul>
            </label>
        );
    }
}
