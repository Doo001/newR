import React from 'react';
import Q from "js/quantum";
import "css/main.scss";
import Global from 'global';
import { setCurrentNav, UserRole, UserPermission } from './common';
import { Row, Col } from 'react-flexbox-grid';
import Pagination from 'component/pagination';
import axios from 'js/utils/api'
import {Link} from 'react-router'

class UserTr extends React.Component {

    getPermDesc(perm) {
        return UserPermission.kAll[perm];
    }
    render() {
        const user = this.props.user;
        this.currentUser = Global.user;
        const validClass = user.valid ? "label label-success" : "label label-warning";
        return (
            <tr>
                <td width="15%" className="name-container">
                    <a href={`/user/${user.id}`}>
                        <span>{user.account?user.account:''}</span>
                    </a>
                </td>
                <td width="20%"className="mail-container">
                    <a href={`/user/${user.id}`}>{user.email}</a>
                </td>
                <td width="20%" className="permissions-container">
                    {

                        <span >{user.moudels}</span>
                    }
                </td>
                <td width="10%">
                    {/*<span>{UserRole.kDescDict[user.role]}</span>*/}
                    <span>{user.role}</span>
                </td>
                <td width="15%">
                    {
                        <span className={validClass}>
                            {user.state == 0 ? "Active" : "Banned"}
                        </span>
                     }
                </td>
                { this.props.showOp ? (
                    <td width="20%" >
                        <Link className="link1 " to={`admin/userAdd/${user.id}/${user.state}`}>账户修改</Link>
                        <Link className="link" to={`/user/${user.id}/statistics`}>查看工作量</Link>
                    </td>) : null
                 }
            </tr>
        );
    }
}

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            pageIndex:1,
            totalCount : 1,
            pageSize : 10
        };
        this.currentUser = Global.user;
    }
    componentDidMount() {
        setCurrentNav('用户列表');
        this.init();
    }
    init() {
        axios.get("author/users?pageno=1&pagesize=20")
        .then((data) => {
            this.setState({
                users: data.results,
            });
        });
    }
    /*换页*/
    handlePageChange = (num)=> {
        this.state.pageIndex=num;
        this.onFilterChange(this.state);
    }
    render() {
        const permissions = Global.user.permissions.filter(p => p < 200);
        const showOp = permissions.length > 0;   // 隐藏操作列
        return (
            <div id="users-list">
                <Row  className="userlist-container">
                    <Col xs={12} className="content-container">
                        <Row start="xs">
                            <Col xs={1} className="label">
                                <label>用户检索</label>
                            </Col>
                            <Col xs={4}>
                                <input  className="search" placeholder="请输入邮箱" />
                            </Col>
                            <Col xs={1}>
                               <button className="searchBtn">搜索</button>
                            </Col>
                        </Row>
                        <Row  className="title">
                            <table border="0" className="table table-head">
                                <thead>
                                <tr>
                                    <th width="15%">用户名</th>
                                    <th width="20%">邮箱</th>
                                    <th width="20%">权限</th>
                                    <th width="10%">角色</th>
                                    <th width="15%">状态</th>
                                    { showOp ? <th width="20%">操作</th> : null}
                                </tr>
                                </thead>
                            </table>
                        </Row>
                        <Row  className="content">
                                <table className="table table-wrapper">
                                    <tbody>
                                    {
                                        this.state.users.map(user =>
                                            <UserTr key={user.id} user={user} showOp={showOp} />)
                                    }
                                    </tbody>
                                </table>
                        </Row>
                        <Row className="pagenation">
                            <Pagination changePage={this.handlePageChange} current={this.state.pageIndex} count={5}
                                        total={Math.ceil(this.state.totalCount / this.state.pageSize)}></Pagination>
                        </Row>
                    </Col>
                </Row>
                <div className="lastTilBox">
                    <p className="p1">© 优能中学教育</p>
                    <p className="p2">(Release: dev, Git Version: 278f7e22)</p>
                    <p className="p3">建议您使用360、Google Chrome，分辨率1280*800及以上浏览本网站，获得更好用户体验</p>
                </div>
            </div>
        );
    }
}
