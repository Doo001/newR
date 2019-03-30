webpackJsonp([3],{

/***/ "./js/portal.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_js_quantum__ = __webpack_require__("./js/quantum.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_css_main_scss__ = __webpack_require__("./css/main.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_css_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_css_main_scss__);











var Portal = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Portal, _React$Component);

    function Portal(props) {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Portal);

        var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Portal.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Portal)).call(this, props));

        _this.redirect = function (item) {
            if (item.url.indexOf('review') != -1) {
                __WEBPACK_IMPORTED_MODULE_7_js_quantum__["a" /* default */].get(item.url).done(function (data) {
                    if (data) {
                        window.location.href = data;
                    }
                });
            } else {
                window.location.href = item.url;
            }
        };

        _this.state = {
            dataReady: false
        };
        _this.user = null;
        _this.currentUser = __WEBPACK_IMPORTED_MODULE_8_global___default.a.user;
        _this.urlMap = {
            102: [{ url: '/item_search', desc: '查询题目' }],
            103: [{ url: '/omega_papers', desc: '真题试卷' }],
            104: [{ url: '/ktags/', desc: '知识点编辑' }, { url: '/volume/input', desc: '题目录入' }, { url: '/item/review?review=tag', desc: '标注' }, { url: '/item/review?review=typeset', desc: '审核' }, { url: '/lesson/' + __WEBPACK_IMPORTED_MODULE_8_global___default.a.user.edu, desc: '教案管理' }, {
                url: '/item/review?review=tag&subreview=retag',
                desc: '复标',
                title: '重新标注已跳过的题目'
            }],
            0: [{ url: '/users', desc: '用户管理' }]
        };
        return _this;
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Portal, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            __WEBPACK_IMPORTED_MODULE_7_js_quantum__["a" /* default */].get('/api/user/' + this.props.userId).done(function (data) {
                _this2.user = data;
                if (_this2.user.role >= 10 && _this2.user.permissions.length === 1) {
                    if (_this2.urlMap[_this2.user.permissions[0]].length === 1) {
                        window.location.href = _this2.urlMap[_this2.user.permissions[0]][0].url;
                    }
                } else {
                    _this2.setState({
                        dataReady: true
                    });
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!this.state.dataReady) {
                return null;
            }
            var portals = [];
            var permissions = this.user.permissions.sort();
            if (this.user.role < 10) {
                permissions.push(0);
            }
            permissions.forEach(function (p) {
                if (!_this3.urlMap[p] || p === 101) {
                    // 暂时去掉书籍入口
                    return;
                }
                _this3.urlMap[p].forEach(function (item) {
                    portals.push(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                        'a',
                        {
                            className: 'module-portal', onClick: function onClick(e) {
                                e.stopPropagation();_this3.redirect(item);
                            }, key: item.url,
                            title: item.title || ''
                        },
                        item.desc
                    ));
                });
            });
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'div',
                { id: 'home-module-portals' },
                portals
            );
        }
    }]);

    return Portal;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Portal, { userId: __WEBPACK_IMPORTED_MODULE_8_global___default.a.userId }), document.getElementById('main'));
/* global userId*/

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

/***/ 7:
/***/ (function(module, exports) {

module.exports = Raven;

/***/ })

},["./js/portal.jsx"]);
//# sourceMappingURL=portal.js.map