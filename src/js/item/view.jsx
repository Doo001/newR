import React from 'react';
import { Q, EduDesc } from 'js/quantum';
import { ItemTypeDesc, ItemClassDesc } from 'js/subjects';
import { reviewStatus } from 'js/item/volume_view';
import { ItemDisplay } from './display';
import { setCurrentNav } from './common';


export default class ItemView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
        };
    }

    componentDidMount() {
        setCurrentNav('概要', this.props.params.id, this.props.location.search);
    }

    render() {
        return (
            <div id="item-view">
                <div className="item-display-wrapper">
                    <h3>显示</h3>
                    <hr />
                    <ItemDisplay
                        id={this.props.params.id} auxiliary
                        onLoaded={itemDisplay => this.setState({ item: itemDisplay.state.item })}
                    />
                </div>
                <div className="item-info">
                    <h3>题目信息</h3>
                    <hr />
                    { this.state.item ? <ItemInfo item={this.state.item} /> : null }
                    <h3>操作历史</h3>
                    <hr />
                    <ItemOpLogs itemId={this.props.params.id} />
                </div>
            </div>
        );
    }
}


function ItemInfo({ item }) {
    return (
        <ul>
            <li className="code">ID: {item.get('_id')} </li>
            <li>类型：{ItemTypeDesc.get(item.get('data').get('type')).name}</li>
            <li>级段：{EduDesc.get(item.get('extra').get('edu')).name}</li>
            <li>
                来源：{
                    item.get('extra').get('classes')
                    .map(class_ =>
                        <span
                            className="label label-info" style={{ marginRight: '1em' }} key={class_}
                        >{ItemClassDesc.get(class_).name}</span>
                    )
                }
            </li>
            <li>状态：{reviewStatus(item.get('review'))}</li>
            <li>修订：{item.get('ver')}</li>
            <li>
                已删除：<ItemBoost item={item} />
            </li>
            <li>创建时间：{new Date(item.get('ctime') * 1000).toLocaleString()}</li>
            <li>修改时间：{new Date(item.get('mtime') * 1000).toLocaleString()}</li>
        </ul>
    );
}

function ItemBoost({ item }) {
    const deleted = item.get('boost') === 0;
    const onClick = () => {
        if (!window.confirm(`确定要${deleted ? '恢复' : '删除'}该题目吗？`)) {
            return;
        }
        Q.post(`/api/item/${item.get('_id')}`, { json: { boost: (deleted ? 1.0 : 0.0) } })
            .done(() => location.reload())
        ;
    };
    if (deleted) {
        return <button className="btn btn-warning btn-sm" onClick={onClick}>是</button>;
    } else {
        return <button className="btn btn-default btn-sm" onClick={onClick}>否</button>;
    }
}

class ItemOpLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opLogs: null,
        };
    }

    componentDidMount() {
        Q.get(`/api/item/${this.props.itemId}/op_logs`)
        .done((results) => { this.setState({ opLogs: results }); })
        ;
    }

    render() {
        if (this.state.opLogs === null) {
            return <div className='loading'>加载中。。。</div>;
        }
        const trs = this.state.opLogs.map((opLog, index) => {
            return (
                <tr key={opLog._id}>
                    <td>{index + 1}</td>
                    <td>{opLog.user.email}</td>
                    <td>{opLog.type}</td>
                    <td>{new Date(opLog.ctime * 1000).toLocaleString()}</td>
                </tr>
            );
        });
        return (
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>用户</th>
                        <th>操作</th>
                        <th>时间</th>
                    </tr>
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table>
        );
    }
}
