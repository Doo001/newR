import React from 'react';
import { Q, EduDesc } from 'js/quantum';
import { ItemTypeDesc } from 'js/subjects';
import { ItemDisplay } from './display';
import { setCurrentNav } from './common';


export default class ClusterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster: null,
        };
    }

    componentDidMount() {
        setCurrentNav('聚类', this.props.params.id, this.props.location.search);
        Q.get(`/api/item/${this.props.params.id}/cluster`)
            .done((cluster) => { this.setState({ cluster }); })
        ;
    }

    render() {
        if (!this.state.cluster) {
            return null;
        }
        return (
            <div id="item-cluster-view">
                <ClusterInfo cluster={this.state.cluster} />
                <ItemList cluster={this.state.cluster} curItemId={this.props.params.id} />
            </div>
        );
    }
}


function ClusterInfo({ cluster }) {
    return (
        <div className="cluster-meta">
            <h3>概要信息</h3>
            <ul>
                <li className="code">ID：{cluster._id} </li>
                <li>类型：{ItemTypeDesc.get(cluster.item_type).name}</li>
                <li>级段：{EduDesc.get(cluster.item_edu).name}</li>
                <li>Centroid ID：
                    <a className="code" href={`/item/${cluster.centroid_id}`}>{cluster.centroid_id}</a>
                </li>
                <li>Item IDs：
                    { cluster.item_ids.map(itemId =>
                        <a className="code" href={`/item/${itemId}`} key={itemId}>{itemId}&nbsp;|&nbsp;</a>
                    )}
                </li>
            </ul>
        </div>
    );
}

function ItemList({ cluster, curItemId }) {
    const itemClassFunc = (item) => {
        let className = item.get('boost') > 0 ? '' : 'item-deleted';
        className = `${className} ${item.get('_id') === curItemId ? 'current' : ''}`;
        return className;
    };
    return (
        <div className="cluster-items">
            <h3>题目列表</h3>
            <ol>
                { cluster.item_ids.map(itemId =>
                    <li className=""><ItemDisplay id={itemId} classNameFunc={itemClassFunc} /></li>
                )}
            </ol>
        </div>
    );
}
