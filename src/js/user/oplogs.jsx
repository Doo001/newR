import React from 'react';
import Immutable from 'immutable';
import Q from 'js/quantum';
import Global from 'global';
import { setCurrentNav } from './common';

export class RecentOplogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opLogs: null,
        };
    }

    componentDidMount() {
        Q.get(`/api/user/${this.props.uid}/op_logs/recent`, { query: { days: this.props.days } })
        .done((results) => { this.setState({ opLogs: Immutable.fromJS(results) }); });
    }

    render() {
        if (this.state.opLogs === null) {
            return <div className='loading'>正在加载中...</div>;
        }
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>时间</th>
                        <th>类型</th>
                        <th>ID</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    { this.state.opLogs.map((opLog, index) =>
                        <OpLog index={index} opLog={opLog} key={index} />) }
                </tbody>
            </table>
        );
    }
}

function OpLog({ opLog, index }) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{new Date(opLog.get('ctime') * 1000).toLocaleString()}</td>
            <td>{opLog.get('obj_type')}</td>
            <td>
                <a href={`/${opLog.get('obj_type')}/${opLog.get('obj_id')}`} target='_blank'>
                    {opLog.get('obj_id')}
                </a>
            </td>
            <td>{opLog.get('type')}</td>
        </tr>
    );
}

export class ProfileRecentOpLogsPage extends React.Component {
    componentDidMount() {
        setCurrentNav('最近操作', null, true);
    }

    render() {
        return (
            <div id="my-recent-op-logs">
                <h3>最近{this.props.days}天的操作</h3>
                <RecentOplogs uid={Global.user._id} days={this.props.days} />
            </div>
        );
    }
}

ProfileRecentOpLogsPage.defaultProps = {
    days: 7,
};

export class UserRecentOpLogsPage extends React.Component {
    componentDidMount() {
        setCurrentNav('最近操作', this.props.params.id, false);
    }

    render() {
        return (
            <div id="user-recent-op-logs">
                <h3>最近{this.props.days}天的操作</h3>
                <RecentOplogs uid={this.props.params.id} days={this.props.days} />
            </div>
        );
    }
}

UserRecentOpLogsPage.defaultProps = {
    days: 7,
};
