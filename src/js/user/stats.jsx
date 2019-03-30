import React from 'react';
import { Q, Qdate } from "js/quantum";
import "css/main.scss";
import { UserStatSearchBar } from './manageuser';
import { setCurrentNav } from './common';


export class UsersStatisticsPage extends React.Component {
    static defaultDateRange() {
        return [Qdate.dateFormat(new Date()), Qdate.dateFormat(new Date())];
    }

    constructor(props) {
        super(props);
        this.state = {
            stats: [],
        };
        this.setBind();
    }

    componentDidMount() {
        setCurrentNav('全体统计', this.props.params.id);

        this.search(...UsersStatisticsPage.defaultDateRange());
    }

    setBind() {
        this.search = this.search.bind(this);
    }

    search(start, end) {
        const query = {};
        if (start) {
            query.start = Q.dateStrToUnixTime(start) / 1000;
        }
        if (end) {
            query.end = (Q.dateStrToUnixTime(end) / 1000) + 86400;
        }
        Q.get(`/api/users/statistics`, { query })
        .done((data) => {
            this.setState({
                stats: data,
            });
        });
    }

    _renderTr(stat) {
        return (
            <tr key={stat._id}>
                <td><span>{stat.name}</span></td>
                <td><span>{stat.create}</span></td>
                <td><span>{stat.typeset}</span></td>
                <td><span>{stat.tag}</span></td>
                <td><span>{stat.volume}</span></td>
                <td><span>{stat.volume_items}</span></td>
                <td><span>{stat.review_tag}</span></td>
                <td><span>{stat.review_typeset}</span></td>
            </tr>
        );
    }

    render() {
        return (
            <div id="user-statistics">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span>全体工作统计</span>
                    </div>
                    <div className="panel-body">
                        <div className="search-bar-wrapper">
                            <UserStatSearchBar
                                defaultDateRange={UsersStatisticsPage.defaultDateRange()}
                                searchCallback={this.search}
                            />
                        </div>
                        <div>
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>用户</th>
                                        <th>创建题目</th>
                                        <th>排版题目</th>
                                        <th>标注题目</th>
                                        <th>创建Volume</th>
                                        <th>Volume题目数</th>
                                        <th>标注</th>
                                        <th>审核</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.stats.map(this._renderTr.bind(this)) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
