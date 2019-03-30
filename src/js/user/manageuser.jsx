import React from 'react';
import { Q, Qdate, Edu, EduDesc } from "js/quantum";
import Immutable from 'immutable';
import { sprintf } from 'sprintf-js';
import Global from 'global';
import { setCurrentNav, UserRole, UserModule, UserPermission } from './common';
import {showAlert} from 'js/widgets/alert';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tip: "",
        };
        this.isAdd = this.props.opType === "addUser";
        this.currentUser = Global.user;
        this.setBind();
    }
    componentDidMount() {
        if (this.isAdd) {
            setCurrentNav('添加');
        } else {
            setCurrentNav('编辑', this.props.userId);
        }
        this.init(this.isAdd);
    }
    setTip(tip) {
        this.setState({ tip });
    }
    setBind() {
        this.updateUserInfo = this.updateUserInfo.bind(this);
        this.changeRole = this.changeRole.bind(this);
        this.changePermissions = this.changePermissions.bind(this);
        this.banUser = this.banUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.changeEdu = this.changeEdu.bind(this);
        this.submit = this.submit.bind(this);
    }
    setUser(key, value) {
        const user = this.state.user.set(key, value);
        this.setState({ user });
    }
    init(isAdd) {
        if (isAdd) {
            const user = {
                email: "",
                name: "",
                pass: "",
                edu: Edu.kDefault,
                role: UserRole.kUser,
                permissions: [],
            };
            this.setState({ user: Immutable.fromJS(user) });
        } else {
            Q.get(`/api/user/${this.props.userId}`, { query: { format: "json" } })
            .done((res) => {
                this.setState({
                    user: Immutable.fromJS(res),
                });
            });
        }
    }
    inputChange(key, evt) {
        const value = evt.target.value;
        this.setUser(key, value);
    }
    changeRole(evt) {
        const value = parseInt(evt.target.value, 10);
        this.setUser('role', value);
    }
    changeEdu(evt) {
        const value = parseInt(evt.target.value, 10);
        const edu = this.state.user.get('edu');
        if (edu !== value) {
            this.setUser('edu', value);
        }
    }
    changePermissions(evt) {
        const value = parseInt(evt.target.value, 10);
        let permissions = this.state.user.get('permissions');
        if (permissions.indexOf(value) !== -1) {
            permissions = permissions.delete(permissions.indexOf(value));
        } else {
            permissions = permissions.push(value);
        }
        this.setUser('permissions', permissions);
    }
    banUser() {
        this.updateUser({ valid: !this.state.user.get("valid") });
    }
    submit(evt) {
        evt.preventDefault();
        if (this.isAdd) {
            return this.addUser(evt);
        } else {
            return this.updateUserInfo(evt);
        }
    }
    updateUser(data, success) {
        this.setState({ loading: true });
        Q.post(`/api/user/${this.props.userId}`, { json: { update: data } })
        .done((res) => {
            this.setState({
                user: Immutable.fromJS(res),
            });
            if (success) {
                success();
            }
        })
        .always(() => {
            this.setState({ loading: false });
        });
    }
    updateUserInfo() {
        const user = this.state.user;
        const pass = user.get("pass");
        if (pass && (pass.length < 6 || pass.length > 32)) {
            this.setTip("密码需要6～32位！");
            return;
        }
        this.setTip("");
        const data = {
            name: user.get("name"),
            role: user.get("role"),
            edu: user.get('edu'),
            permissions: user.get('permissions'),
            module: UserModule.kMathDepartment,
        };
        if (pass) {
            data.pass = pass;
        }
        this.updateUser(data, () => { Q.alert("信息更新成功！"); });
    }
    
    
    addUser() {
        const user = this.state.user;
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(user.get("email"))) {
            this.setTip("不是合法的Email！");
            return;
        }

        const data = {
            email: user.get("email"),
            name: user.get("name"),
            role: user.get("role"),
            pass: user.get('pass'),
            edu: user.get("edu"),
            permissions: user.get('permissions'),
            module: UserModule.kMathDepartment,
        };
        this.setState({ loading: true });
        Q.put('/api/users', { json: data })
        .done(() => {
            Q.alert("添加成功");
            location.href = "/users";
        })
        .always(() => {
            this.setState({ loading: false });
        });
    }
    render() {
        if (!this.state.user) {
            return (
                <div>数据加载中....</div>
            );
        }
        return (
            <form id="userinfo-form" className="form-horizontal" onSubmit={this.submit}>
                <div className="form-group">
                    <label htmlFor="inputEmail" className="col-sm-2 control-label">邮箱</label>
                    <div className="col-sm-8">
                        <input
                            type="email" id="inputEmail" className="form-control"
                            disabled={!this.isAdd}
                            value={this.state.user.get('email')}
                            onChange={this.inputChange.bind(this, "email")}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUserName" className="col-sm-2 control-label">用户名</label>
                    <div className="col-sm-8">
                        <input
                            type="text" id="inputUserName" className="form-control"
                            onChange={this.inputChange.bind(this, "name")}
                            value={this.state.user.get('name')}
                        />
                    </div>
                </div>
                <div className={"form-group"}>
                    <label htmlFor="inputPass" className="col-sm-2 control-label">密码</label>
                    <div className="col-sm-8">
                        <input
                            type="password" id="inputPass" className="form-control"
                            required={this.isAdd}
                            onChange={this.inputChange.bind(this, "pass")}
                            value={this.state.user.get('pass') || ''}
                        />
                    </div>
                </div>
                { UserRole.isAdmin(this.currentUser.role) ? (
                    <AdminEdu
                        edu={this.state.user.get('edu')}
                        changeEdu={this.changeEdu}
                    />) : null}
                { UserRole.isAdmin(this.currentUser.role) && (
                    this.state.user.get('_id') !== this.currentUser._id) ? (
                        <div className="form-group">
                            <label htmlFor="inputRole" className="col-sm-2 control-label">角色</label>
                            <div className="col-sm-8">
                                <select
                                    className="form-control" value={this.state.user.get('role')}
                                    onChange={this.changeRole}
                                >
                                    <option value="10">普通用户</option>
                                    <option value="1">管理员</option>
                                </select>
                            </div>
                        </div>) : null}
                { UserRole.isAdmin(this.currentUser.role) ? (
                    <Permissions
                        user={this.currentUser}
                        permissions={this.state.user.get('permissions')}
                        changePermissions={this.changePermissions}
                    />) : null}
                <div className={!this.isAdd ? "form-group" : "hide"}>
                    <div className="col-sm-offset-2 col-sm-8">
                        <span
                            className={this.state.user.get('valid') ?
                            "label label-success" : "label label-warning"}
                        >
                            {this.state.user.get('valid') ? "Active" : "Banned"}
                        </span>
                    </div>
                </div>
                <div className={this.state.tip !== "" ? 'form-group' : 'hide'}>
                    <div className="col-sm-offset-2 col-sm-8">
                        <div className="alert alert-warning">
                            {this.state.tip}
                        </div>
                    </div>
                </div>
                <div className={"form-group"}>
                    <div className="col-sm-offset-2 col-sm-8">
                        <button
                            type="submit" disabled={this.state.loading} className="btn btn-success"
                        >保存</button>
                        &nbsp;&nbsp;
                        <button
                            type="button" onClick={this.banUser} disabled={this.state.loading}
                            className={`btn btn-danger ${this.isAdd ? 'hide' : ''}`}
                        >{this.state.user.get('valid') ? "禁用" : "激活"}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

function AdminEdu(props) {
    return (
        <div className="form-group">
            <label htmlFor="inputEdu" className="col-sm-2 control-label">级段</label>
            <div className="col-sm-8">
                <select
                    className="form-control" value={props.edu}
                    onChange={props.changeEdu}
                >
                    {EduDesc.kAll.map(eduDesc =>
                        <option value={eduDesc.edu}>{eduDesc.name}</option>)}
                </select>
            </div>
        </div>);
}

function Permissions(props) {
    const user = props.user;
    const checkedPermissions = props.permissions;
    if (!user.module) {
        return null;
    }
    const permissions = UserPermission.getPermissionsByModule(user.module);

    return (
        <div className="form-group">
            <label className="col-sm-2 control-label">权限</label>
            <div className="col-sm-8">
                {
                    permissions.map((perm, i) =>
                        <label className="checkbox-inline" key={i}>
                            <input
                                type="checkbox" value={perm.code}
                                checked={checkedPermissions.indexOf(perm.code) !== -1}
                                onChange={props.changePermissions}
                            />{perm.desc}
                        </label>
                    )
                }
            </div>
        </div>
    );
}

class UserStatistics extends React.Component {
    static defaultDateRange() {
        const today = new Date();
        const monthFirst = new Date(today.getFullYear(), today.getMonth(), 1);
        return [UserStatistics.formatDate(monthFirst), UserStatistics.formatDate(today)];
    }

    static formatDate(dt) {
        return sprintf(`%04d-%02d-%02d`, dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
    }

    constructor(props) {
        super(props);
        this.state = {
            dataReady: false,
            statistics: {},
        };
        this.setBind();
    }
    componentDidMount() {
        this.search(...UserStatistics.defaultDateRange());
        this.loadUserInfo();
    }
    setBind() {
        this.search = this.search.bind(this);
    }
    loadUserInfo() {
        Q.get(`/api/user/${this.props.uid}`)
        .done((user) => {
            this.user = user;
            this.setState({
                dataReady: true,
            });
        });
    }
    search(start, end) {
        const query = {};
        if (start) {
            query.start = `${start} 00:00`;
        }
        if (end) {
            query.end = `${end} 23:59`;
        }
        Q.get(`/api/user/${this.props.uid}/statistics`, { query })
        .done((data) => {
            this.setState({
                statistics: data,
            });
        });
    }
    render() {
        if (!this.state.dataReady) {
            return null;
        }
        const statistics = this.state.statistics;
        return (
            <div id="user-statistics">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span>{this.user.name || this.user.email}的工作量</span>
                    </div>
                    <div className="panel-body">
                        <div className="search-bar-wrapper">
                            <UserStatSearchBar
                                defaultDateRange={UserStatistics.defaultDateRange()}
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
                                    <tr>
                                        <td><span>{this.user.name || this.user.email}</span></td>
                                        <td><span>{statistics.create}</span></td>
                                        <td><span>{statistics.typeset}</span></td>
                                        <td><span>{statistics.tag}</span></td>
                                        <td><span>{statistics.volume}</span></td>
                                        <td><span>{statistics.volume_items}</span></td>
                                        <td><span>{statistics.review_tag}</span></td>
                                        <td><span>{statistics.review_typeset}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class UserStatisticsPage extends React.Component {
    componentDidMount() {
        setCurrentNav('用户统计', this.props.params.id);
    }

    render() {
        return (
            <UserStatistics uid={this.props.params.id} />
        );
    }
}

export class UserStatSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: props.defaultDateRange[0],
            end: props.defaultDateRange[1],
        };
        this.setBind();
    }

    setBind() {
        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler(key, evt) {
        this.setState({
            [key]: evt.target.value,
        });
    }

    quickSearch(rangeName) {
        let range = [new Date(), new Date()];
        switch (rangeName) {
        case 'yesterday':
            range = [
                new Date(new Date().getTime() - (86400 * 1000)),
                new Date(new Date().getTime() - (86400 * 1000)),
            ];
            break;
        case 'thisweek':
            range = [
                Qdate.weekFirst(),
                new Date(),
            ];
            break;
        case 'lastweek':
            range = [
                Qdate.weekFirst(new Date(Qdate.weekFirst().getTime() - 1)),
                new Date(Qdate.weekFirst(
                    new Date(Qdate.weekFirst().getTime() - 1)).getTime() + (6 * 86400 * 1000)),
            ];
            break;
        default: break;
        }
        this.setState({
            start: Qdate.dateFormat(range[0]),
            end: Qdate.dateFormat(range[1]),
        }, () => this.props.searchCallback(this.state.start, this.state.end));
    }
    render() {
        return (
            <form className="form-inline date-range-form">
                <div className="form-group">
                    <label>开始时间：</label>
                    <input
                        type="date" className="form-control" value={this.state.start}
                        onChange={this.changeHandler.bind(this, 'start')}
                    />
                </div>
                <div className="form-group">
                    <label>结束时间：</label>
                    <input
                        type="date" className="form-control" value={this.state.end}
                        onChange={this.changeHandler.bind(this, 'end')}
                    />
                </div>
                <button
                    type="button" className="btn btn-success"
                    onClick={() => this.props.searchCallback(this.state.start, this.state.end)}
                >查询</button>
                <button
                    type="button" className="btn btn-default"
                    onClick={this.quickSearch.bind(this, 'today')}
                >今天</button>
                <button
                    type="button" className="btn btn-default"
                    onClick={this.quickSearch.bind(this, 'yesterday')}
                >昨天</button>
                <button
                    type="button" className="btn btn-default"
                    onClick={this.quickSearch.bind(this, 'thisweek')}
                >本周</button>
                <button
                    type="button" className="btn btn-default"
                    onClick={this.quickSearch.bind(this, 'lastweek')}
                >上周</button>
            </form>
        );
    }
}

const AddUser = function () {
    return (
        <UserInfo opType="addUser" />
    );
};

const UpdateUser = function (props) {
    return (
        <UserInfo opType="updateUser" userId={props.params.id} />
    );
};

export { AddUser, UpdateUser, UserStatistics, UserStatisticsPage };
