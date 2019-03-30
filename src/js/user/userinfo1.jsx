import React from 'react';
import { Q, EduDesc } from "js/quantum";
import Global from 'global';
import { setCurrentNav } from './common';
import { UserStatistics } from './manageuser';

class UserInfoEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tip: "",
            newPass: "",
            confirmPass: "",
            edu: props.userEdu,
            pass: "",
            name: props.userName,
            showPassForm: false,
            loading: false,
        };
        this.setBind();
    }
           
    componentWillMount(){
    	Q.get(`/api/user/${this.props.userId}`)
        .done((res) => {
        	this.setState({
        		edu:res.edu
        	},()=>{
        		Global.user.edu=res.edu;
        		console.log(Global.user.edu)
        	})
        })
    }
    
    componentDidMount() {
        setCurrentNav('修改信息', null, true);
    }

    setBind() {
        this.showPassForm = this.showPassForm.bind(this);
        this.updateUserName = this.updateUserName.bind(this);
        this.updateUserEdu = this.updateUserEdu.bind(this);
        this.updateUserPass = this.updateUserPass.bind(this);
    }

    setTip(tip) {
        this.setState({ tip });
    }

    changeEdu(evt) {
        const value = parseInt(evt.target.value, 10);
        const edu = this.state.edu;
        if (edu !== value) {
            this.setState({ edu: value });
        }
    }

    inputChange(key, evt) {
        const value = evt.target.value;
        this.setState({ [key]: value });
        const btnStatus = this.state.invalid;
        this.setState({ invalid: btnStatus });
    }

    showPassForm() {
        this.setState({ showPassForm: !this.state.showPassForm });
    }

    updateUserName() {
        this.setTip("");
        if (!this.state.name) {
            this.setTip("用户名不能为空!");
            return;
        }
        this.updateUserInfo({ name: this.state.name });
    }

    updateUserEdu() {
        this.setTip('');
        this.updateUserInfo({ edu: this.state.edu });
        
    }

    updateUserPass() {
        this.setTip("");
        if (!this.state.pass) {
            this.setTip("密码为空!");
            return;
        }
        if (!this.state.newPass) {
            this.setTip("新密码为空!");
            return;
        }
        if (this.state.newPass.length < 6 || this.state.pass.length < 6 ||
            this.state.newPass.length > 32 || this.state.pass.length > 32) {
            this.setTip("密码需要6～32位！");
            return;
        }
        if (this.state.newPass !== this.state.confirmPass) {
            this.setTip("密码输入不一致！");
            return;
        }
        this.updateUserInfo({ pass: this.state.pass, newPass: this.state.newPass },
            () => {
                this.setState({ showPassForm: false });
                Q.alert("信息更新成功");
            }
        );
    }

    updateUserInfo(params, successCallback) {
        this.setState({ loading: true });
        this.setTip("");
        Q.post(`/api/user/${this.props.userId}`,
               { json: { update_profile: params } }
        )
        .done((res) => {
//      	localStorage.setItem('eduChange',res.edu)
        	Global.user.edu=res.edu;
        	console.log(Global.user.edu)
        	
            if (successCallback) {
                successCallback();
            } else {
                Q.alert("信息更新成功");
            }
        })
        .fail(() => {
            this.setState({ pass: "", newPass: "", confirmPass: "" });
        })
        .always(() => {
            this.setState({ loading: false });
        });
    }

    render() {
        return (
            <form id="userinfo-form" className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputEmail" className="col-sm-2 control-label">邮箱</label>
                    <label className="col-sm-4 control-label text-left">
                        {this.props.email}
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUserName" className="col-sm-2 control-label">用户名</label>
                    <div className="col-sm-2">
                        <input
                            type="text" id="inputUserName" className="form-control"
                            onChange={this.inputChange.bind(this, "name")}
                            value={this.state.name}
                        />
                    </div>
                    <div className="col-sm-2">
                        <button
                            type="button" onClick={this.updateUserName}
                            disabled={this.state.loading} className="btn btn-success"
                        >保存</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUserEdu" className="col-sm-2 control-label">级段</label>
                    <div className="col-sm-2">
                        <select
                            id="inputUserEdu"
                            className="form-control"
                            value={this.state.edu}
                            onChange={this.changeEdu.bind(this)}
                        >
                            {EduDesc.kAll.map(eduDesc =>
                                <option
                                    value={eduDesc.edu}
                                    key={eduDesc.edu}
                                >
                                    {eduDesc.name}
                                </option>)}
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <button
                            type="button" onClick={this.updateUserEdu}
                            disabled={this.state.loading} className="btn btn-success"
                        >保存</button>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">密码</label>
                    <label className="col-sm-2 control-label text-left">
                        ******
                    </label>
                    <div className="col-sm-2">
                        <button
                            type="button" onClick={this.showPassForm}
                            className="btn btn-success"
                        >{this.state.showPassForm ? '取消' : '修改密码'}</button>
                    </div>
                </div>
                {
                    this.state.showPassForm ? (
                        <div>
                            <div className="form-group">
                                <label htmlFor="inputPass" className="col-sm-2 control-label">
                                    当前密码
                                </label>
                                <div className="col-sm-2">
                                    <input
                                        type="password" id="inputPass" className="form-control"
                                        onChange={this.inputChange.bind(this, "pass")}
                                        value={this.state.pass}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputNewPass" className="col-sm-2 control-label">新密码
                                </label>
                                <div className="col-sm-2">
                                    <input
                                        type="password" id="inputNewPass" className="form-control"
                                        onChange={this.inputChange.bind(this, "newPass")}
                                        value={this.state.newPass}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="inputConfirmPass"
                                    className="col-sm-2 control-label"
                                >确认新密码</label>
                                <div className="col-sm-2">
                                    <input
                                        type="password" id="inputConfirmPass"
                                        className="form-control"
                                        onChange={this.inputChange.bind(this, "confirmPass")}
                                        value={this.state.confirmPass}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-8">
                                    <button
                                        type="button" onClick={this.updateUserPass}
                                        disabled={this.state.loading} className="btn btn-success"
                                    >保存</button>
                                </div>
                            </div>
                        </div>) : null
                }
                <div className={this.state.tip !== "" ? 'form-group' : 'hide'}>
                    <div className="col-sm-offset-2 col-sm-8">
                        <div className="alert alert-warning">
                            { this.state.tip }
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const ProfileEditor = function () {
    return (
        <UserInfoEditor
            email={Global.user.email}
            userEdu={Global.user.edu}
            userName={Global.user.name} userId={Global.user._id}
        />
    );
};

class UserStats extends React.Component {
    componentDidMount() {
        setCurrentNav('用户统计', null, true);
    }

    render() {
        return <UserStatistics uid={Global.user._id} />;
    }
}

export { ProfileEditor, UserStats };
