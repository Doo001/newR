import React from 'react';
import Q from "js/quantum";
import "css/main.scss";
import config from '../../../config'
export class UserLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            email: window.localStorage.getItem('loginName') || '',
            pass: '',
            capacha: '',
            remember: true,
            ajaxing: false,
            imgSrc: this.genImgSrc()
        };
        this._refEmail = null;
        this._refPass = null;
        this._autoFocusInput = this.state.email ? 'pass' : 'email';
    }
    
//  componentWillMount(){
//  	localStorage.removeItem('res_str');
//  }

    componentDidMount() {
        if (this.state.email) {
            this._refPass.focus();
        } else {
            this._refEmail.focus();
        }
    }

    handleChange(evt) {
        const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        this.setState({ [evt.target.name]: value });
    }
    genImgSrc = () => {
        let server = `http://${config[process.env.NODE_ENV]['proxy']['<%SUBJECT%>']['host']}:${config[process.env.NODE_ENV]['proxy']['<%SUBJECT%>']['port']}`;
        return `${server}/auth/verifycode?num=${Math.random()}`
    }
    refreshCode() {
        this.codeImg.setAttribute('src', this.genImgSrc())
    }
    login(evt) {
        evt.preventDefault();
        this.setState({ ajaxing: true });
        Q.post('/auth/login', { json: this.state })
        .done((res) => {
            window.localStorage.setItem('loginName', this.state.email);
            localStorage.setItem('token', res.authorization);
            Q.get('/user/current_user').done(res => {
                window.localStorage.setItem('user', encodeURIComponent(JSON.stringify(res.g.user)));
                location.href = this.props.location.query.next_url || '/';
            }).fail(this.loginError)
        })
        .fail(this.loginError)
        .always(() => {
            this.setState({ ajaxing: false });
        });
    }
    loginError =()=> {
        this._refPass.focus();
        this.setState({ pass: '' });
        this.refreshCode();
    }
    render() {
        return (
            <div id="login-page">
                <div className="login-header">
                    <div className="logo-wrapper">
                        <img src="http://sealimg.youneng.com/static/img/logo/logo_s.png" />
                    </div>
                    <div className="sys-name-wrapper">
                        <img src="http://sealimg.youneng.com/static/img/logo/318x80_n.png" />
                    </div>
                </div>
                <div className="login-body">
                    <form id="login-form" className="" onSubmit={this.login.bind(this)}>
                        <div className="form-row">
                            <input
                                type="email" name="email" className="form-control"
                                placeholder="用户名" required
                                value={this.state.email}
                                onChange={this.handleChange.bind(this)}
                                ref={(c) => { this._refEmail = c; }} key="email"
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="password" name="pass" className="form-control" required
                                placeholder="密码"
                                value={this.state.pass} onChange={this.handleChange.bind(this)}
                                ref={(c) => { this._refPass = c; }} key="pass"
                            />
                        </div>
                        <div className="form-row">
                            <div className="capacha">
                                <input
                                    type="text" name="capacha" className="form-control text" required
                                    placeholder="验证码"
                                    value={this.state.capacha} onChange={this.handleChange.bind(this)}
                                />
                                <img src={this.state.imgSrc} alt="" ref={ref=> this.codeImg=ref} onClick={this.refreshCode.bind(this)}/>
                            </div>
                        </div>
                        <div className="form-row">
                            <label className="checkbox-inline remember" >
                                <input
                                    type="checkbox" name="remember" checked={this.state.remember}
                                    onChange={this.handleChange.bind(this)}
                                />
                                <span>记住我</span>
                            </label>
                        </div>
                        <div className="form-row">
                            <button
                                className="btn btn-primary btn-lg" type="submit"
                            >登录</button>
                            <div className="forget-pass hide">
                                <a href="#" data-action="forget-pass">
                                    忘记密码
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
