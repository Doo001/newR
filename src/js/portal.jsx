import React from 'react';
import ReactDom from 'react-dom';
import Q from "js/quantum";
import Global from "global";
import "css/main.scss";
import { Grid, Row, Col } from 'react-flexbox-grid';

class Portal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataReady: false,
        };
        this.user = null;
        this.currentUser = Global.user;
        this.urlMap = {
            102: [{ url: '/item_search', desc: '单题管理' }],
            103: [{ url: '/paper/create', desc: '试卷管理' }],
            104: [{ url: `/lesson/${Global.user.edu}`, desc: '教案管理' },
                { url: '/ktags/', desc: '图谱管理' },
                // { url: '/item_search', desc: '题目查询' }，
                // { url: '/volume/input', desc: '单题录入' },
                // { url: '/item/review?review=tag', desc: '标注' },
                // { url: '/item/review?review=typeset', desc: '审核' },
                // {
                //     url: '/item/review?review=tag&subreview=retag',
                //     desc: '复标',
                //     title: '重新标注已跳过的题目',
                // },
                { url: `/quality`, desc: '质量管理' },
            ],
            0: [{ url: '/users', desc: '用户管理' }],
        };
    }
    componentDidMount() {
        Q.get(`/api/user/${this.props.userId}`)
        .done((data) => {
            this.user = data;
            if (this.user.role >= 10 && this.user.permissions.length === 1) {
                if (this.urlMap[this.user.permissions[0]].length === 1) {
                    window.location.href = this.urlMap[this.user.permissions[0]][0].url;
                }
            } else {
                this.setState({
                    dataReady: true,
                });
            }
        });
    }
    redirect = (item) => {
        if (item.url.indexOf('review') != -1) {
            Q.get(item.url).done(data => {
                if (data) {
                    window.location.href = data;
                }
            })
        } else {
            window.location.href = item.url;
        }
    }
    render() {
        if (!this.state.dataReady) {
            return null;
        }
        const portals = [];
        const permissions = this.user.permissions.sort();
        if (this.user.role < 10) {
            permissions.push(0);
        }
        permissions.forEach((p) => {
            if (!this.urlMap[p] || p === 101) {  // 暂时去掉书籍入口
                return;
            }
            this.urlMap[p].forEach((item) => {
                portals.push(
                    <a
                        className="module-portal" onClick={e => {e.stopPropagation(); this.redirect(item)}} key={item.url}
                        title={item.title || ''}
                    >{item.desc}</a>
            );
            });
        });
        return (
            <div id="home-module-portals">
                <div className="contain-main">
                <Row>
                    <Col xs={12} className="margin-B">
                        <Row><h1>尊敬的{this.user.name}</h1></Row>
                        <Row><h1>欢迎您使用内容系统</h1></Row>
                    </Col>
                </Row>
                {portals}
                </div>
                <Row>
                    <Col xs={12}>
                        <Row end="xs">
                            <Col xs={6}>
                                <span className="logo-main"></span>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>
        );
    }
}

ReactDom.render(
    <Portal userId={Global.userId} />,
    document.getElementById('main')
);
/* global userId*/
