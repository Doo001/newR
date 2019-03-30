// 在屏幕顶部显示的提示条，可以自动消失，用以给予用户操作反馈

import React from 'react';
import ReactDom from 'react-dom';
import Immutable from 'immutable';
import $ from 'jquery';

class AlertInfo {
    constructor(message, type = 'success') {
        this.message = message;
        this.type = type;
        this.id = null;  // set by Alerts
    }
}

class Alert extends React.Component {
    constructor(props) {
        super(props);
        this._timer = null;
    }

    componentDidMount() {
        this._timer = window.setTimeout(() => {
            $(this.refs.alert).slideUp(400, () => {
                this.props.onFinished(this.props.alertInfo.id);
            });
        }, this.props.timeout);
    }

    componentWillUnmount() {
        if (this._timer) {
            window.clearTimeout(this._timer);
        }
    }

    render() {
        const nodes = [];
        if (this.props.alertInfo.type === 'success') {
            nodes.push(<span className="glyphicon glyphicon-ok" key="icon" />);
        }
        nodes.push(<span key="message">{this.props.alertInfo.message}</span>);
        return (
            <div className={`alert alert-${this.props.alertInfo.type}`} ref="alert">
                {nodes}
            </div>
        );
    }
}

Alert.defaultProps = {
    timeout: 1000,
};

class Alerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertInfos: Immutable.List(),
        };
        this._idSeed = 1;
    }

    addAlert(alertInfo) {
        alertInfo.id = this._idSeed + 1;  /* eslint no-param-reassign: 0 */
        this._idSeed += 1;
        this.setState({
            alertInfos: this.state.alertInfos.push(alertInfo),
        });
        return alertInfo.id;
    }

    handleAlertFinished(id) {
        const entry = this.state.alertInfos.findEntry(alertInfo => alertInfo.id === id);
        this.setState({
            alertInfos: this.state.alertInfos.remove(entry[0]),
        });
    }

    render() {
        const alerts = this.state.alertInfos.map((alertInfo, index) => {
            return (
                <Alert
                    alertInfo={alertInfo} index={index} key={alertInfo.id}
                    onFinished={this.handleAlertFinished.bind(this)}
                />
            );
        });

        return (
            <div className="alerts" id="alerts-manager">
                {alerts}
            </div>
        );
    }
}

Alerts.instance = ReactDom.render(<Alerts />, document.querySelector('#alerts-root'));

export function showAlert(message, type = "success") {
    return Alerts.instance.addAlert(new AlertInfo(message, type));
}

export default showAlert;
