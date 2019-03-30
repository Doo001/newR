webpackJsonp([2],{

/***/ "./js/user/common.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = setCurrentNav;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UserRole; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return UserModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return UserPermission; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_nav__ = __webpack_require__("./js/nav.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_global__);





function setCurrentNav(current, uid) {
    var profile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var navItems = null;
    if (uid) {
        navItems = [new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('用户列表', '/users'), new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('全体统计', '/users/statistics'), new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('添加', '/admin/adduser'), new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('编辑', '/user/' + uid)];
        var permissions = __WEBPACK_IMPORTED_MODULE_3_global___default.a.user.permissions.filter(function (p) {
            return p < 200;
        });
        if (permissions.length) {
            navItems.push(new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('用户统计', '/user/' + uid + '/statistics'));
            navItems.push(new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('最近操作', '/user/' + uid + '/op_logs/recent'));
        }
    } else if (profile) {
        navItems = [new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('修改信息', '/profile')];
        // 不包含数学部权限的不显示用户统计
        var _permissions = __WEBPACK_IMPORTED_MODULE_3_global___default.a.user.permissions.filter(function (p) {
            return p < 200;
        });
        if (_permissions.length) {
            navItems.push(new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('用户统计', '/profile/statistics'));
            navItems.push(new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('最近操作', '/profile/op_logs/recent'));
        }
    } else {
        navItems = [new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('用户列表', '/users'), new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('全体统计', '/users/statistics'), new __WEBPACK_IMPORTED_MODULE_2_js_nav__["a" /* NavItem */]('添加', '/admin/adduser')];
    }
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_js_nav__["b" /* setNavBar */])(navItems, current);
}

var UserRole = function () {
    function UserRole() {
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, UserRole);
    }

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(UserRole, null, [{
        key: 'isAdmin',
        value: function isAdmin(role) {
            return role === UserRole.kAdmin;
        }
    }]);

    return UserRole;
}();

UserRole.kDescDict = {
    1: '管理员',
    10: '用户'
};

UserRole.kAdmin = 1;
UserRole.kUser = 10;

var UserModule = function UserModule() {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, UserModule);
};
UserModule.kAllModules = [{ code: 1, desc: '数学部' }];
UserModule.kDescDict = {};
UserModule.kAllModules.forEach(function (item) {
    UserModule.kDescDict[item.code] = item.desc;
});
UserModule.kMathDepartment = 1;
var UserPermission = function () {
    function UserPermission() {
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, UserPermission);
    }

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(UserPermission, null, [{
        key: 'getPermissionsByModule',
        value: function getPermissionsByModule(module) {
            if (module === UserModule.kMathDepartment) {
                return UserPermission.kMathDepartment;
            }
            return null;
        }
    }]);

    return UserPermission;
}();
UserPermission.kMathDepartment = [{ code: 102, desc: '题目查询' }, { code: 103, desc: '试卷编辑' }, { code: 104, desc: '录入' }];

UserPermission.kAll = {};
[].concat(UserPermission.kMathDepartment).forEach(function (item) {
    UserPermission.kAll[item.code] = item.desc;
});

/***/ }),

/***/ "./js/user/entry.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__userlist__ = __webpack_require__("./js/user/userlist.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__manageuser__ = __webpack_require__("./js/user/manageuser.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__userinfo__ = __webpack_require__("./js/user/userinfo.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login__ = __webpack_require__("./js/user/login.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__oplogs__ = __webpack_require__("./js/user/oplogs.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__stats__ = __webpack_require__("./js/user/stats.jsx");










__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_2_react_router__["Router"],
    { history: __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"] },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/users', component: __WEBPACK_IMPORTED_MODULE_3__userlist__["a" /* default */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/users/statistics', component: __WEBPACK_IMPORTED_MODULE_8__stats__["a" /* UsersStatisticsPage */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/admin/adduser', component: __WEBPACK_IMPORTED_MODULE_4__manageuser__["a" /* AddUser */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/user/:id', component: __WEBPACK_IMPORTED_MODULE_4__manageuser__["b" /* UpdateUser */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/user/:id/statistics', component: __WEBPACK_IMPORTED_MODULE_4__manageuser__["c" /* UserStatisticsPage */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/user/:id/op_logs/recent', component: __WEBPACK_IMPORTED_MODULE_7__oplogs__["a" /* UserRecentOpLogsPage */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/profile', component: __WEBPACK_IMPORTED_MODULE_5__userinfo__["a" /* ProfileEditor */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/profile/statistics', component: __WEBPACK_IMPORTED_MODULE_5__userinfo__["b" /* UserStats */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/profile/op_logs/recent', component: __WEBPACK_IMPORTED_MODULE_7__oplogs__["b" /* ProfileRecentOpLogsPage */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: '/auth/login', component: __WEBPACK_IMPORTED_MODULE_6__login__["a" /* UserLogin */] })
), document.getElementById('main'));

/***/ }),

/***/ "./js/user/login.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserLogin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("../node_modules/babel-runtime/core-js/json/stringify.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__ = __webpack_require__("../node_modules/babel-runtime/helpers/defineProperty.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_css_main_scss__ = __webpack_require__("./css/main.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_css_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_css_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__config__ = __webpack_require__("../config.json");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__config__);











var UserLogin = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(UserLogin, _React$Component);

    function UserLogin() {
        __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, UserLogin);

        var _this = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserLogin.__proto__ || __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default()(UserLogin)).call(this));

        _this.genImgSrc = function () {
            var server = "http://" + __WEBPACK_IMPORTED_MODULE_10__config___default.a["test"]['proxy']['english']['host'] + ":" + __WEBPACK_IMPORTED_MODULE_10__config___default.a["test"]['proxy']['english']['port'];
            return server + "/auth/verifycode?num=" + Math.random();
        };

        _this.loginError = function () {
            _this._refPass.focus();
            _this.setState({ pass: '' });
            _this.refreshCode();
        };

        _this.state = {
            email: window.localStorage.getItem('loginName') || '',
            pass: '',
            capacha: '',
            remember: true,
            ajaxing: false,
            imgSrc: _this.genImgSrc()
        };
        _this._refEmail = null;
        _this._refPass = null;
        _this._autoFocusInput = _this.state.email ? 'pass' : 'email';
        return _this;
    }

    //  componentWillMount(){
    //  	localStorage.removeItem('res_str');
    //  }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserLogin, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            if (this.state.email) {
                this._refPass.focus();
            } else {
                this._refEmail.focus();
            }
        }
    }, {
        key: "handleChange",
        value: function handleChange(evt) {
            var value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
            this.setState(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()({}, evt.target.name, value));
        }
    }, {
        key: "refreshCode",
        value: function refreshCode() {
            this.codeImg.setAttribute('src', this.genImgSrc());
        }
    }, {
        key: "login",
        value: function login(evt) {
            var _this2 = this;

            evt.preventDefault();
            this.setState({ ajaxing: true });
            __WEBPACK_IMPORTED_MODULE_8_js_quantum__["a" /* default */].post('/auth/login', { json: this.state }).done(function (res) {
                window.localStorage.setItem('loginName', _this2.state.email);
                localStorage.setItem('token', res.authorization);
                __WEBPACK_IMPORTED_MODULE_8_js_quantum__["a" /* default */].get('/user/current_user').done(function (res) {
                    window.localStorage.setItem('user', encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(res.g.user)));
                    location.href = _this2.props.location.query.next_url || '/';
                }).fail(_this2.loginError);
            }).fail(this.loginError).always(function () {
                _this2.setState({ ajaxing: false });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                "div",
                { id: "login-page" },
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    "div",
                    { className: "login-header" },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        "div",
                        { className: "logo-wrapper" },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("img", { src: "http://sealimg.youneng.com/static/img/logo/logo_s.png" })
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        "div",
                        { className: "sys-name-wrapper" },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("img", { src: "http://sealimg.youneng.com/static/img/logo/318x80_n.png" })
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    "div",
                    { className: "login-body" },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        "form",
                        { id: "login-form", className: "", onSubmit: this.login.bind(this) },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            "div",
                            { className: "form-row" },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("input", {
                                type: "email", name: "email", className: "form-control",
                                placeholder: "\u7528\u6237\u540D", required: true,
                                value: this.state.email,
                                onChange: this.handleChange.bind(this),
                                ref: function ref(c) {
                                    _this3._refEmail = c;
                                }, key: "email"
                            })
                        ),
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            "div",
                            { className: "form-row" },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("input", {
                                type: "password", name: "pass", className: "form-control", required: true,
                                placeholder: "\u5BC6\u7801",
                                value: this.state.pass, onChange: this.handleChange.bind(this),
                                ref: function ref(c) {
                                    _this3._refPass = c;
                                }, key: "pass"
                            })
                        ),
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            "div",
                            { className: "form-row" },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                "div",
                                { className: "capacha" },
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("input", {
                                    type: "text", name: "capacha", className: "form-control text", required: true,
                                    placeholder: "\u9A8C\u8BC1\u7801",
                                    value: this.state.capacha, onChange: this.handleChange.bind(this)
                                }),
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("img", { src: this.state.imgSrc, alt: "", ref: function ref(_ref) {
                                        return _this3.codeImg = _ref;
                                    }, onClick: this.refreshCode.bind(this) })
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            "div",
                            { className: "form-row" },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                "label",
                                { className: "checkbox-inline remember" },
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement("input", {
                                    type: "checkbox", name: "remember", checked: this.state.remember,
                                    onChange: this.handleChange.bind(this)
                                }),
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                    "span",
                                    null,
                                    "\u8BB0\u4F4F\u6211"
                                )
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            "div",
                            { className: "form-row" },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                "button",
                                {
                                    className: "btn btn-primary btn-lg", type: "submit"
                                },
                                "\u767B\u5F55"
                            ),
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                "div",
                                { className: "forget-pass hide" },
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                    "a",
                                    { href: "#", "data-action": "forget-pass" },
                                    "\u5FD8\u8BB0\u5BC6\u7801"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return UserLogin;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

/***/ }),

/***/ "./js/user/manageuser.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return UserStatSearchBar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UpdateUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return UserStatistics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return UserStatisticsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__("../node_modules/babel-runtime/helpers/defineProperty.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__ = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_immutable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_sprintf_js__ = __webpack_require__("../node_modules/sprintf-js/src/sprintf.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_sprintf_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_sprintf_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__common__ = __webpack_require__("./js/user/common.jsx");














var UserInfo = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(UserInfo, _React$Component);

    function UserInfo(props) {
        __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, UserInfo);

        var _this = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserInfo.__proto__ || __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default()(UserInfo)).call(this, props));

        _this.state = {
            tip: ""
        };
        _this.isAdd = _this.props.opType === "addUser";
        _this.currentUser = __WEBPACK_IMPORTED_MODULE_11_global___default.a.user;
        _this.setBind();
        return _this;
    }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserInfo, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.isAdd) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__common__["a" /* setCurrentNav */])('添加');
            } else {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__common__["a" /* setCurrentNav */])('编辑', this.props.userId);
            }
            this.init(this.isAdd);
        }
    }, {
        key: 'setTip',
        value: function setTip(tip) {
            this.setState({ tip: tip });
        }
    }, {
        key: 'setBind',
        value: function setBind() {
            this.updateUserInfo = this.updateUserInfo.bind(this);
            this.changeRole = this.changeRole.bind(this);
            this.changePermissions = this.changePermissions.bind(this);
            this.banUser = this.banUser.bind(this);
            this.addUser = this.addUser.bind(this);
            this.changeEdu = this.changeEdu.bind(this);
            this.submit = this.submit.bind(this);
        }
    }, {
        key: 'setUser',
        value: function setUser(key, value) {
            var user = this.state.user.set(key, value);
            this.setState({ user: user });
        }
    }, {
        key: 'init',
        value: function init(isAdd) {
            var _this2 = this;

            if (isAdd) {
                var user = {
                    email: "",
                    name: "",
                    pass: "",
                    edu: __WEBPACK_IMPORTED_MODULE_8_js_quantum__["d" /* Edu */].kDefault,
                    role: __WEBPACK_IMPORTED_MODULE_12__common__["b" /* UserRole */].kUser,
                    permissions: []
                };
                this.setState({ user: __WEBPACK_IMPORTED_MODULE_9_immutable___default.a.fromJS(user) });
            } else {
                __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].get('/api/user/' + this.props.userId, { query: { format: "json" } }).done(function (res) {
                    _this2.setState({
                        user: __WEBPACK_IMPORTED_MODULE_9_immutable___default.a.fromJS(res)
                    });
                });
            }
        }
    }, {
        key: 'inputChange',
        value: function inputChange(key, evt) {
            var value = evt.target.value;
            this.setUser(key, value);
        }
    }, {
        key: 'changeRole',
        value: function changeRole(evt) {
            var value = parseInt(evt.target.value, 10);
            this.setUser('role', value);
        }
    }, {
        key: 'changeEdu',
        value: function changeEdu(evt) {
            var value = parseInt(evt.target.value, 10);
            var edu = this.state.user.get('edu');
            if (edu !== value) {
                this.setUser('edu', value);
            }
        }
    }, {
        key: 'changePermissions',
        value: function changePermissions(evt) {
            var value = parseInt(evt.target.value, 10);
            var permissions = this.state.user.get('permissions');
            if (permissions.indexOf(value) !== -1) {
                permissions = permissions.delete(permissions.indexOf(value));
            } else {
                permissions = permissions.push(value);
            }
            this.setUser('permissions', permissions);
        }
    }, {
        key: 'banUser',
        value: function banUser() {
            this.updateUser({ valid: !this.state.user.get("valid") });
        }
    }, {
        key: 'submit',
        value: function submit(evt) {
            evt.preventDefault();
            if (this.isAdd) {
                return this.addUser(evt);
            } else {
                return this.updateUserInfo(evt);
            }
        }
    }, {
        key: 'updateUser',
        value: function updateUser(data, success) {
            var _this3 = this;

            this.setState({ loading: true });
            __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].post('/api/user/' + this.props.userId, { json: { update: data } }).done(function (res) {
                _this3.setState({
                    user: __WEBPACK_IMPORTED_MODULE_9_immutable___default.a.fromJS(res)
                });
                if (success) {
                    success();
                }
            }).always(function () {
                _this3.setState({ loading: false });
            });
        }
    }, {
        key: 'updateUserInfo',
        value: function updateUserInfo() {
            var user = this.state.user;
            var pass = user.get("pass");
            if (pass && (pass.length < 6 || pass.length > 32)) {
                this.setTip("密码需要6～32位！");
                return;
            }
            this.setTip("");
            var data = {
                name: user.get("name"),
                role: user.get("role"),
                edu: user.get('edu'),
                permissions: user.get('permissions'),
                module: __WEBPACK_IMPORTED_MODULE_12__common__["c" /* UserModule */].kMathDepartment
            };
            if (pass) {
                data.pass = pass;
            }
            this.updateUser(data, function () {
                __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].alert("信息更新成功！");
            });
        }
    }, {
        key: 'addUser',
        value: function addUser() {
            var _this4 = this;

            var user = this.state.user;
            if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(user.get("email"))) {
                this.setTip("不是合法的Email！");
                return;
            }

            var data = {
                email: user.get("email"),
                name: user.get("name"),
                role: user.get("role"),
                pass: user.get('pass'),
                edu: user.get("edu"),
                permissions: user.get('permissions'),
                module: __WEBPACK_IMPORTED_MODULE_12__common__["c" /* UserModule */].kMathDepartment
            };
            this.setState({ loading: true });
            __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].put('/api/users', { json: data }).done(function () {
                __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].alert("添加成功");
                location.href = "/users";
            }).always(function () {
                _this4.setState({ loading: false });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.state.user) {
                return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    null,
                    '\u6570\u636E\u52A0\u8F7D\u4E2D....'
                );
            }
            return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'form',
                { id: 'userinfo-form', className: 'form-horizontal', onSubmit: this.submit },
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputEmail', className: 'col-sm-2 control-label' },
                        '\u90AE\u7BB1'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                            type: 'email', id: 'inputEmail', className: 'form-control',
                            disabled: !this.isAdd,
                            value: this.state.user.get('email'),
                            onChange: this.inputChange.bind(this, "email")
                        })
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputUserName', className: 'col-sm-2 control-label' },
                        '\u7528\u6237\u540D'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                            type: 'text', id: 'inputUserName', className: 'form-control',
                            onChange: this.inputChange.bind(this, "name"),
                            value: this.state.user.get('name')
                        })
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: "form-group" },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputPass', className: 'col-sm-2 control-label' },
                        '\u5BC6\u7801'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                            type: 'password', id: 'inputPass', className: 'form-control',
                            required: this.isAdd,
                            onChange: this.inputChange.bind(this, "pass"),
                            value: this.state.user.get('pass') || ''
                        })
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_12__common__["b" /* UserRole */].isAdmin(this.currentUser.role) ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(AdminEdu, {
                    edu: this.state.user.get('edu'),
                    changeEdu: this.changeEdu
                }) : null,
                __WEBPACK_IMPORTED_MODULE_12__common__["b" /* UserRole */].isAdmin(this.currentUser.role) && this.state.user.get('_id') !== this.currentUser._id ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputRole', className: 'col-sm-2 control-label' },
                        '\u89D2\u8272'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'select',
                            {
                                className: 'form-control', value: this.state.user.get('role'),
                                onChange: this.changeRole
                            },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                'option',
                                { value: '10' },
                                '\u666E\u901A\u7528\u6237'
                            ),
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                'option',
                                { value: '1' },
                                '\u7BA1\u7406\u5458'
                            )
                        )
                    )
                ) : null,
                __WEBPACK_IMPORTED_MODULE_12__common__["b" /* UserRole */].isAdmin(this.currentUser.role) ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(Permissions, {
                    user: this.currentUser,
                    permissions: this.state.user.get('permissions'),
                    changePermissions: this.changePermissions
                }) : null,
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: !this.isAdd ? "form-group" : "hide" },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-offset-2 col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'span',
                            {
                                className: this.state.user.get('valid') ? "label label-success" : "label label-warning"
                            },
                            this.state.user.get('valid') ? "Active" : "Banned"
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: this.state.tip !== "" ? 'form-group' : 'hide' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-offset-2 col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'div',
                            { className: 'alert alert-warning' },
                            this.state.tip
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: "form-group" },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-offset-2 col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'button',
                            {
                                type: 'submit', disabled: this.state.loading, className: 'btn btn-success'
                            },
                            '\u4FDD\u5B58'
                        ),
                        '\xA0\xA0',
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'button',
                            {
                                type: 'button', onClick: this.banUser, disabled: this.state.loading,
                                className: 'btn btn-danger ' + (this.isAdd ? 'hide' : '')
                            },
                            this.state.user.get('valid') ? "禁用" : "激活"
                        )
                    )
                )
            );
        }
    }]);

    return UserInfo;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

function AdminEdu(props) {
    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'div',
        { className: 'form-group' },
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'label',
            { htmlFor: 'inputEdu', className: 'col-sm-2 control-label' },
            '\u7EA7\u6BB5'
        ),
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'div',
            { className: 'col-sm-8' },
            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'select',
                {
                    className: 'form-control', value: props.edu,
                    onChange: props.changeEdu
                },
                __WEBPACK_IMPORTED_MODULE_8_js_quantum__["c" /* EduDesc */].kAll.map(function (eduDesc) {
                    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'option',
                        { value: eduDesc.edu },
                        eduDesc.name
                    );
                })
            )
        )
    );
}

function Permissions(props) {
    var user = props.user;
    var checkedPermissions = props.permissions;
    if (!user.module) {
        return null;
    }
    var permissions = __WEBPACK_IMPORTED_MODULE_12__common__["d" /* UserPermission */].getPermissionsByModule(user.module);

    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'div',
        { className: 'form-group' },
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'label',
            { className: 'col-sm-2 control-label' },
            '\u6743\u9650'
        ),
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'div',
            { className: 'col-sm-8' },
            permissions.map(function (perm, i) {
                return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'label',
                    { className: 'checkbox-inline', key: i },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                        type: 'checkbox', value: perm.code,
                        checked: checkedPermissions.indexOf(perm.code) !== -1,
                        onChange: props.changePermissions
                    }),
                    perm.desc
                );
            })
        )
    );
}

var UserStatistics = function (_React$Component2) {
    __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(UserStatistics, _React$Component2);

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserStatistics, null, [{
        key: 'defaultDateRange',
        value: function defaultDateRange() {
            var today = new Date();
            var monthFirst = new Date(today.getFullYear(), today.getMonth(), 1);
            return [UserStatistics.formatDate(monthFirst), UserStatistics.formatDate(today)];
        }
    }, {
        key: 'formatDate',
        value: function formatDate(dt) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10_sprintf_js__["sprintf"])('%04d-%02d-%02d', dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
        }
    }]);

    function UserStatistics(props) {
        __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, UserStatistics);

        var _this5 = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserStatistics.__proto__ || __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default()(UserStatistics)).call(this, props));

        _this5.state = {
            dataReady: false,
            statistics: {}
        };
        _this5.setBind();
        return _this5;
    }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserStatistics, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.search.apply(this, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default()(UserStatistics.defaultDateRange()));
            this.loadUserInfo();
        }
    }, {
        key: 'setBind',
        value: function setBind() {
            this.search = this.search.bind(this);
        }
    }, {
        key: 'loadUserInfo',
        value: function loadUserInfo() {
            var _this6 = this;

            __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].get('/api/user/' + this.props.uid).done(function (user) {
                _this6.user = user;
                _this6.setState({
                    dataReady: true
                });
            });
        }
    }, {
        key: 'search',
        value: function search(start, end) {
            var _this7 = this;

            var query = {};
            if (start) {
                query.start = start + ' 00:00';
            }
            if (end) {
                query.end = end + ' 23:59';
            }
            __WEBPACK_IMPORTED_MODULE_8_js_quantum__["b" /* Q */].get('/api/user/' + this.props.uid + '/statistics', { query: query }).done(function (data) {
                _this7.setState({
                    statistics: data
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.state.dataReady) {
                return null;
            }
            var statistics = this.state.statistics;
            return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'div',
                { id: 'user-statistics' },
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'panel panel-default' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'panel-heading' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'span',
                            null,
                            this.user.name || this.user.email,
                            '\u7684\u5DE5\u4F5C\u91CF'
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'div',
                        { className: 'panel-body' },
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'div',
                            { className: 'search-bar-wrapper' },
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(UserStatSearchBar, {
                                defaultDateRange: UserStatistics.defaultDateRange(),
                                searchCallback: this.search
                            })
                        ),
                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                            'div',
                            null,
                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                'table',
                                { className: 'table table-striped table-hover' },
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                    'thead',
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                        'tr',
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u7528\u6237'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u521B\u5EFA\u9898\u76EE'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u6392\u7248\u9898\u76EE'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u6807\u6CE8\u9898\u76EE'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u521B\u5EFAVolume'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            'Volume\u9898\u76EE\u6570'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u6807\u6CE8'
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'th',
                                            null,
                                            '\u5BA1\u6838'
                                        )
                                    )
                                ),
                                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                    'tbody',
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                        'tr',
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                this.user.name || this.user.email
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.create
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.typeset
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.tag
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.volume
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.volume_items
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.review_tag
                                            )
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                            'td',
                                            null,
                                            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                                                'span',
                                                null,
                                                statistics.review_typeset
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return UserStatistics;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

var UserStatisticsPage = function (_React$Component3) {
    __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(UserStatisticsPage, _React$Component3);

    function UserStatisticsPage() {
        __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, UserStatisticsPage);

        return __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserStatisticsPage.__proto__ || __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default()(UserStatisticsPage)).apply(this, arguments));
    }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserStatisticsPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__common__["a" /* setCurrentNav */])('用户统计', this.props.params.id);
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(UserStatistics, { uid: this.props.params.id });
        }
    }]);

    return UserStatisticsPage;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

var UserStatSearchBar = function (_React$Component4) {
    __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(UserStatSearchBar, _React$Component4);

    function UserStatSearchBar(props) {
        __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, UserStatSearchBar);

        var _this9 = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserStatSearchBar.__proto__ || __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_get_prototype_of___default()(UserStatSearchBar)).call(this, props));

        _this9.state = {
            start: props.defaultDateRange[0],
            end: props.defaultDateRange[1]
        };
        _this9.setBind();
        return _this9;
    }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UserStatSearchBar, [{
        key: 'setBind',
        value: function setBind() {
            this.changeHandler = this.changeHandler.bind(this);
        }
    }, {
        key: 'changeHandler',
        value: function changeHandler(key, evt) {
            this.setState(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()({}, key, evt.target.value));
        }
    }, {
        key: 'quickSearch',
        value: function quickSearch(rangeName) {
            var _this10 = this;

            var range = [new Date(), new Date()];
            switch (rangeName) {
                case 'yesterday':
                    range = [new Date(new Date().getTime() - 86400 * 1000), new Date(new Date().getTime() - 86400 * 1000)];
                    break;
                case 'thisweek':
                    range = [__WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].weekFirst(), new Date()];
                    break;
                case 'lastweek':
                    range = [__WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].weekFirst(new Date(__WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].weekFirst().getTime() - 1)), new Date(__WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].weekFirst(new Date(__WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].weekFirst().getTime() - 1)).getTime() + 6 * 86400 * 1000)];
                    break;
                default:
                    break;
            }
            this.setState({
                start: __WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].dateFormat(range[0]),
                end: __WEBPACK_IMPORTED_MODULE_8_js_quantum__["e" /* Qdate */].dateFormat(range[1])
            }, function () {
                return _this10.props.searchCallback(_this10.state.start, _this10.state.end);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this11 = this;

            return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'form',
                { className: 'form-inline date-range-form' },
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        null,
                        '\u5F00\u59CB\u65F6\u95F4\uFF1A'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                        type: 'date', className: 'form-control', value: this.state.start,
                        onChange: this.changeHandler.bind(this, 'start')
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                        'label',
                        null,
                        '\u7ED3\u675F\u65F6\u95F4\uFF1A'
                    ),
                    __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('input', {
                        type: 'date', className: 'form-control', value: this.state.end,
                        onChange: this.changeHandler.bind(this, 'end')
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'button',
                    {
                        type: 'button', className: 'btn btn-success',
                        onClick: function onClick() {
                            return _this11.props.searchCallback(_this11.state.start, _this11.state.end);
                        }
                    },
                    '\u67E5\u8BE2'
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'button',
                    {
                        type: 'button', className: 'btn btn-default',
                        onClick: this.quickSearch.bind(this, 'today')
                    },
                    '\u4ECA\u5929'
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'button',
                    {
                        type: 'button', className: 'btn btn-default',
                        onClick: this.quickSearch.bind(this, 'yesterday')
                    },
                    '\u6628\u5929'
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'button',
                    {
                        type: 'button', className: 'btn btn-default',
                        onClick: this.quickSearch.bind(this, 'thisweek')
                    },
                    '\u672C\u5468'
                ),
                __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                    'button',
                    {
                        type: 'button', className: 'btn btn-default',
                        onClick: this.quickSearch.bind(this, 'lastweek')
                    },
                    '\u4E0A\u5468'
                )
            );
        }
    }]);

    return UserStatSearchBar;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

var AddUser = function AddUser() {
    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(UserInfo, { opType: 'addUser' });
};

var UpdateUser = function UpdateUser(props) {
    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(UserInfo, { opType: 'updateUser', userId: props.params.id });
};



/***/ }),

/***/ "./js/user/oplogs.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RecentOplogs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProfileRecentOpLogsPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserRecentOpLogsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_immutable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common__ = __webpack_require__("./js/user/common.jsx");











var RecentOplogs = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(RecentOplogs, _React$Component);

    function RecentOplogs(props) {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, RecentOplogs);

        var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (RecentOplogs.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(RecentOplogs)).call(this, props));

        _this.state = {
            opLogs: null
        };
        return _this;
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(RecentOplogs, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["a" /* default */].get('/api/user/' + this.props.uid + '/op_logs/recent', { query: { days: this.props.days } }).done(function (results) {
                _this2.setState({ opLogs: __WEBPACK_IMPORTED_MODULE_6_immutable___default.a.fromJS(results) });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.opLogs === null) {
                return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    'div',
                    { className: 'loading' },
                    '\u6B63\u5728\u52A0\u8F7D\u4E2D...'
                );
            }
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'table',
                { className: 'table table-hover' },
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        'tr',
                        null,
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            'th',
                            null,
                            '\u5E8F\u53F7'
                        ),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            'th',
                            null,
                            '\u65F6\u95F4'
                        ),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            'th',
                            null,
                            '\u7C7B\u578B'
                        ),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            'th',
                            null,
                            'ID'
                        ),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            'th',
                            null,
                            '\u64CD\u4F5C'
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    'tbody',
                    null,
                    this.state.opLogs.map(function (opLog, index) {
                        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(OpLog, { index: index, opLog: opLog, key: index });
                    })
                )
            );
        }
    }]);

    return RecentOplogs;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

function OpLog(_ref) {
    var opLog = _ref.opLog,
        index = _ref.index;

    return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'tr',
        null,
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'td',
            null,
            index + 1
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'td',
            null,
            new Date(opLog.get('ctime') * 1000).toLocaleString()
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'td',
            null,
            opLog.get('obj_type')
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'td',
            null,
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'a',
                { href: '/' + opLog.get('obj_type') + '/' + opLog.get('obj_id'), target: '_blank' },
                opLog.get('obj_id')
            )
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'td',
            null,
            opLog.get('type')
        )
    );
}

var ProfileRecentOpLogsPage = function (_React$Component2) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(ProfileRecentOpLogsPage, _React$Component2);

    function ProfileRecentOpLogsPage() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, ProfileRecentOpLogsPage);

        return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (ProfileRecentOpLogsPage.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(ProfileRecentOpLogsPage)).apply(this, arguments));
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(ProfileRecentOpLogsPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common__["a" /* setCurrentNav */])('最近操作', null, true);
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'div',
                { id: 'my-recent-op-logs' },
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    'h3',
                    null,
                    '\u6700\u8FD1',
                    this.props.days,
                    '\u5929\u7684\u64CD\u4F5C'
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(RecentOplogs, { uid: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user._id, days: this.props.days })
            );
        }
    }]);

    return ProfileRecentOpLogsPage;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

ProfileRecentOpLogsPage.defaultProps = {
    days: 7
};

var UserRecentOpLogsPage = function (_React$Component3) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(UserRecentOpLogsPage, _React$Component3);

    function UserRecentOpLogsPage() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, UserRecentOpLogsPage);

        return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserRecentOpLogsPage.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(UserRecentOpLogsPage)).apply(this, arguments));
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(UserRecentOpLogsPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common__["a" /* setCurrentNav */])('最近操作', this.props.params.id, false);
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'div',
                { id: 'user-recent-op-logs' },
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    'h3',
                    null,
                    '\u6700\u8FD1',
                    this.props.days,
                    '\u5929\u7684\u64CD\u4F5C'
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(RecentOplogs, { uid: this.props.params.id, days: this.props.days })
            );
        }
    }]);

    return UserRecentOpLogsPage;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

UserRecentOpLogsPage.defaultProps = {
    days: 7
};

/***/ }),

/***/ "./js/user/stats.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersStatisticsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_css_main_scss__ = __webpack_require__("./css/main.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_css_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_css_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__manageuser__ = __webpack_require__("./js/user/manageuser.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__common__ = __webpack_require__("./js/user/common.jsx");












var UsersStatisticsPage = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(UsersStatisticsPage, _React$Component);

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UsersStatisticsPage, null, [{
        key: "defaultDateRange",
        value: function defaultDateRange() {
            return [__WEBPACK_IMPORTED_MODULE_7_js_quantum__["e" /* Qdate */].dateFormat(new Date()), __WEBPACK_IMPORTED_MODULE_7_js_quantum__["e" /* Qdate */].dateFormat(new Date())];
        }
    }]);

    function UsersStatisticsPage(props) {
        __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, UsersStatisticsPage);

        var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UsersStatisticsPage.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(UsersStatisticsPage)).call(this, props));

        _this.state = {
            stats: []
        };
        _this.setBind();
        return _this;
    }

    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(UsersStatisticsPage, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__common__["a" /* setCurrentNav */])('全体统计', this.props.params.id);

            this.search.apply(this, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(UsersStatisticsPage.defaultDateRange()));
        }
    }, {
        key: "setBind",
        value: function setBind() {
            this.search = this.search.bind(this);
        }
    }, {
        key: "search",
        value: function search(start, end) {
            var _this2 = this;

            var query = {};
            if (start) {
                query.start = __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].dateStrToUnixTime(start) / 1000;
            }
            if (end) {
                query.end = __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].dateStrToUnixTime(end) / 1000 + 86400;
            }
            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].get("/api/users/statistics", { query: query }).done(function (data) {
                _this2.setState({
                    stats: data
                });
            });
        }
    }, {
        key: "_renderTr",
        value: function _renderTr(stat) {
            return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                "tr",
                { key: stat._id },
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.name
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.create
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.typeset
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.tag
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.volume
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.volume_items
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.review_tag
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "span",
                        null,
                        stat.review_typeset
                    )
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                "div",
                { id: "user-statistics" },
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    "div",
                    { className: "panel panel-default" },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "div",
                        { className: "panel-heading" },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            "span",
                            null,
                            "\u5168\u4F53\u5DE5\u4F5C\u7EDF\u8BA1"
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        "div",
                        { className: "panel-body" },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            "div",
                            { className: "search-bar-wrapper" },
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__manageuser__["e" /* UserStatSearchBar */], {
                                defaultDateRange: UsersStatisticsPage.defaultDateRange(),
                                searchCallback: this.search
                            })
                        ),
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            "div",
                            null,
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                "table",
                                { className: "table table-striped table-hover" },
                                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                    "thead",
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                        "tr",
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u7528\u6237"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u521B\u5EFA\u9898\u76EE"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u6392\u7248\u9898\u76EE"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u6807\u6CE8\u9898\u76EE"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u521B\u5EFAVolume"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "Volume\u9898\u76EE\u6570"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u6807\u6CE8"
                                        ),
                                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                            "th",
                                            null,
                                            "\u5BA1\u6838"
                                        )
                                    )
                                ),
                                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                    "tbody",
                                    null,
                                    this.state.stats.map(this._renderTr.bind(this))
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return UsersStatisticsPage;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

/***/ }),

/***/ "./js/user/userinfo.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UserStats; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__("../node_modules/babel-runtime/helpers/defineProperty.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common__ = __webpack_require__("./js/user/common.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__manageuser__ = __webpack_require__("./js/user/manageuser.jsx");












var UserInfoEditor = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(UserInfoEditor, _React$Component);

    function UserInfoEditor(props) {
        __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, UserInfoEditor);

        var _this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserInfoEditor.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(UserInfoEditor)).call(this, props));

        _this.state = {
            tip: "",
            newPass: "",
            confirmPass: "",
            edu: props.userEdu,
            pass: "",
            name: props.userName,
            showPassForm: false,
            loading: false
        };
        _this.setBind();
        return _this;
    }

    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(UserInfoEditor, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].get('/api/user/' + this.props.userId).done(function (res) {
                _this2.setState({
                    edu: res.edu
                }, function () {
                    __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu = res.edu;
                    console.log(__WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu);
                });
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common__["a" /* setCurrentNav */])('修改信息', null, true);
        }
    }, {
        key: 'setBind',
        value: function setBind() {
            this.showPassForm = this.showPassForm.bind(this);
            this.updateUserName = this.updateUserName.bind(this);
            this.updateUserEdu = this.updateUserEdu.bind(this);
            this.updateUserPass = this.updateUserPass.bind(this);
        }
    }, {
        key: 'setTip',
        value: function setTip(tip) {
            this.setState({ tip: tip });
        }
    }, {
        key: 'changeEdu',
        value: function changeEdu(evt) {
            var value = parseInt(evt.target.value, 10);
            var edu = this.state.edu;
            if (edu !== value) {
                this.setState({ edu: value });
            }
        }
    }, {
        key: 'inputChange',
        value: function inputChange(key, evt) {
            var value = evt.target.value;
            this.setState(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()({}, key, value));
            var btnStatus = this.state.invalid;
            this.setState({ invalid: btnStatus });
        }
    }, {
        key: 'showPassForm',
        value: function showPassForm() {
            this.setState({ showPassForm: !this.state.showPassForm });
        }
    }, {
        key: 'updateUserName',
        value: function updateUserName() {
            this.setTip("");
            if (!this.state.name) {
                this.setTip("用户名不能为空!");
                return;
            }
            this.updateUserInfo({ name: this.state.name });
        }
    }, {
        key: 'updateUserEdu',
        value: function updateUserEdu() {
            this.setTip('');
            this.updateUserInfo({ edu: this.state.edu });
        }
    }, {
        key: 'updateUserPass',
        value: function updateUserPass() {
            var _this3 = this;

            this.setTip("");
            if (!this.state.pass) {
                this.setTip("密码为空!");
                return;
            }
            if (!this.state.newPass) {
                this.setTip("新密码为空!");
                return;
            }
            if (this.state.newPass.length < 6 || this.state.pass.length < 6 || this.state.newPass.length > 32 || this.state.pass.length > 32) {
                this.setTip("密码需要6～32位！");
                return;
            }
            if (this.state.newPass !== this.state.confirmPass) {
                this.setTip("密码输入不一致！");
                return;
            }
            this.updateUserInfo({ pass: this.state.pass, newPass: this.state.newPass }, function () {
                _this3.setState({ showPassForm: false });
                __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].alert("信息更新成功");
            });
        }
    }, {
        key: 'updateUserInfo',
        value: function updateUserInfo(params, successCallback) {
            var _this4 = this;

            this.setState({ loading: true });
            this.setTip("");
            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].post('/api/user/' + this.props.userId, { json: { update_profile: params } }).done(function (res) {
                //      	localStorage.setItem('eduChange',res.edu)
                __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu = res.edu;
                console.log(__WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu);

                if (successCallback) {
                    successCallback();
                } else {
                    __WEBPACK_IMPORTED_MODULE_7_js_quantum__["b" /* Q */].alert("信息更新成功");
                }
            }).fail(function () {
                _this4.setState({ pass: "", newPass: "", confirmPass: "" });
            }).always(function () {
                _this4.setState({ loading: false });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                'form',
                { id: 'userinfo-form', className: 'form-horizontal' },
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputEmail', className: 'col-sm-2 control-label' },
                        '\u90AE\u7BB1'
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { className: 'col-sm-4 control-label text-left' },
                        this.props.email
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputUserName', className: 'col-sm-2 control-label' },
                        '\u7528\u6237\u540D'
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
                            type: 'text', id: 'inputUserName', className: 'form-control',
                            onChange: this.inputChange.bind(this, "name"),
                            value: this.state.name
                        })
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'button',
                            {
                                type: 'button', onClick: this.updateUserName,
                                disabled: this.state.loading, className: 'btn btn-success'
                            },
                            '\u4FDD\u5B58'
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { htmlFor: 'inputUserEdu', className: 'col-sm-2 control-label' },
                        '\u7EA7\u6BB5'
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'select',
                            {
                                id: 'inputUserEdu',
                                className: 'form-control',
                                value: this.state.edu,
                                onChange: this.changeEdu.bind(this)
                            },
                            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["c" /* EduDesc */].kAll.map(function (eduDesc) {
                                return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                    'option',
                                    {
                                        value: eduDesc.edu,
                                        key: eduDesc.edu
                                    },
                                    eduDesc.name
                                );
                            })
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'button',
                            {
                                type: 'button', onClick: this.updateUserEdu,
                                disabled: this.state.loading, className: 'btn btn-success'
                            },
                            '\u4FDD\u5B58'
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { className: 'col-sm-2 control-label' },
                        '\u5BC6\u7801'
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'label',
                        { className: 'col-sm-2 control-label text-left' },
                        '******'
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'button',
                            {
                                type: 'button', onClick: this.showPassForm,
                                className: 'btn btn-success'
                            },
                            this.state.showPassForm ? '取消' : '修改密码'
                        )
                    )
                ),
                this.state.showPassForm ? __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    null,
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'form-group' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'label',
                            { htmlFor: 'inputPass', className: 'col-sm-2 control-label' },
                            '\u5F53\u524D\u5BC6\u7801'
                        ),
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
                                type: 'password', id: 'inputPass', className: 'form-control',
                                onChange: this.inputChange.bind(this, "pass"),
                                value: this.state.pass
                            })
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'form-group' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'label',
                            { htmlFor: 'inputNewPass', className: 'col-sm-2 control-label' },
                            '\u65B0\u5BC6\u7801'
                        ),
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
                                type: 'password', id: 'inputNewPass', className: 'form-control',
                                onChange: this.inputChange.bind(this, "newPass"),
                                value: this.state.newPass
                            })
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'form-group' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'label',
                            {
                                htmlFor: 'inputConfirmPass',
                                className: 'col-sm-2 control-label'
                            },
                            '\u786E\u8BA4\u65B0\u5BC6\u7801'
                        ),
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
                                type: 'password', id: 'inputConfirmPass',
                                className: 'form-control',
                                onChange: this.inputChange.bind(this, "confirmPass"),
                                value: this.state.confirmPass
                            })
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'form-group' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'div',
                            { className: 'col-sm-offset-2 col-sm-8' },
                            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                                'button',
                                {
                                    type: 'button', onClick: this.updateUserPass,
                                    disabled: this.state.loading, className: 'btn btn-success'
                                },
                                '\u4FDD\u5B58'
                            )
                        )
                    )
                ) : null,
                __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                    'div',
                    { className: this.state.tip !== "" ? 'form-group' : 'hide' },
                    __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                        'div',
                        { className: 'col-sm-offset-2 col-sm-8' },
                        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
                            'div',
                            { className: 'alert alert-warning' },
                            this.state.tip
                        )
                    )
                )
            );
        }
    }]);

    return UserInfoEditor;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

var ProfileEditor = function ProfileEditor() {
    return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(UserInfoEditor, {
        email: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.email,
        userEdu: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu,
        userName: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.name, userId: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user._id
    });
};

var UserStats = function (_React$Component2) {
    __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(UserStats, _React$Component2);

    function UserStats() {
        __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, UserStats);

        return __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserStats.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(UserStats)).apply(this, arguments));
    }

    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(UserStats, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common__["a" /* setCurrentNav */])('用户统计', null, true);
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__manageuser__["d" /* UserStatistics */], { uid: __WEBPACK_IMPORTED_MODULE_8_global___default.a.user._id });
        }
    }]);

    return UserStats;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);



/***/ }),

/***/ "./js/user/userlist.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("../node_modules/babel-runtime/core-js/object/get-prototype-of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_css_main_scss__ = __webpack_require__("./css/main.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_css_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_css_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common__ = __webpack_require__("./js/user/common.jsx");











var UserTr = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(UserTr, _React$Component);

    function UserTr() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, UserTr);

        return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserTr.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(UserTr)).apply(this, arguments));
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(UserTr, [{
        key: "getPermDesc",
        value: function getPermDesc(perm) {
            return __WEBPACK_IMPORTED_MODULE_9__common__["d" /* UserPermission */].kAll[perm];
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var user = this.props.user;
            this.currentUser = __WEBPACK_IMPORTED_MODULE_8_global___default.a.user;
            var validClass = user.valid ? "label label-success" : "label label-warning";
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                "tr",
                null,
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "a",
                        { href: "/user/" + user._id },
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("i", { className: "glyphicon glyphicon-user" }),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            "span",
                            null,
                            user.name
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "a",
                        { href: "/user/" + user._id },
                        user.email
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "span",
                        { className: validClass },
                        user.valid ? "Active" : "Banned"
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    { className: "permissions-container" },
                    user.permissions.map(function (permi, i) {
                        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            "span",
                            { key: i },
                            _this2.getPermDesc(permi)
                        );
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "span",
                        null,
                        __WEBPACK_IMPORTED_MODULE_9__common__["b" /* UserRole */].kDescDict[user.role]
                    )
                ),
                this.props.showOp ? __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "td",
                    null,
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "a",
                        { href: "/user/" + user._id + "/statistics" },
                        "\u67E5\u770B\u5DE5\u4F5C\u91CF"
                    )
                ) : null
            );
        }
    }]);

    return UserTr;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

var UserList = function (_React$Component2) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(UserList, _React$Component2);

    function UserList(props) {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, UserList);

        var _this3 = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserList.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(UserList)).call(this, props));

        _this3.state = {
            users: []
        };
        _this3.currentUser = __WEBPACK_IMPORTED_MODULE_8_global___default.a.user;
        return _this3;
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(UserList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common__["a" /* setCurrentNav */])('用户列表');
            this.init();
        }
    }, {
        key: "init",
        value: function init() {
            var _this4 = this;

            __WEBPACK_IMPORTED_MODULE_6_js_quantum__["a" /* default */].get("/api/users", { query: { format: "json" } }).done(function (data) {
                _this4.setState({
                    users: data
                });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var permissions = __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.permissions.filter(function (p) {
                return p < 200;
            });
            var showOp = permissions.length > 0; // 隐藏操作列
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                "div",
                { id: "users-list" },
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "div",
                    { className: "userlist-container" },
                    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        "table",
                        { className: "table table-wrapper" },
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            "thead",
                            null,
                            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                "tr",
                                null,
                                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u7528\u6237\u540D"
                                ),
                                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u90AE\u7BB1"
                                ),
                                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u72B6\u6001"
                                ),
                                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u6743\u9650"
                                ),
                                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u89D2\u8272"
                                ),
                                showOp ? __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                                    "th",
                                    null,
                                    "\u64CD\u4F5C"
                                ) : null
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                            "tbody",
                            null,
                            this.state.users.map(function (user) {
                                return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(UserTr, { key: user._id, user: user, showOp: showOp });
                            })
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                    "a",
                    { role: "button", className: "btn btn-success", href: "/admin/adduser" },
                    "\u6DFB\u52A0\u7528\u6237"
                )
            );
        }
    }]);

    return UserList;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = (UserList);

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = Immutable;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = Global;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = ReactRouter;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = Raven;

/***/ })

},["./js/user/entry.jsx"]);
//# sourceMappingURL=user.js.map