import Global from 'global';
import $ from 'jquery';
import Raven from 'raven-js';
import { showAlert } from 'js/widgets/alert';
import { sprintf } from 'sprintf-js';
export const DEFAULT_OPTION = "--- 请选择 ---";
import config from './../../config'
export const server = `http://${config[process.env.NODE_ENV]['proxy']['<%SUBJECT%>']['host']}:${config[process.env.NODE_ENV]['proxy']['<%SUBJECT%>']['port']}`;
if (Global.config.errorAlertEnabled) {
    Raven
        .config(Global.config.sentryPublicDsn, {
            release: Global.config.version,
            ignoreUrls: [
                // see http://sentry.photonmath.com/share/issue/32342e31363231/
                /m\.baidu\.com\.yiqisee\.cn\/kaca_js\/js\/backEn\.js/i,
            ],
        })
        .install();
    if (Global.user) {
        Raven.setUserContext({
            _id: Global.user._id,
            email: Global.user.email,
        });
    }
}
export const planIds = [1388, 1488, 2388, 2488, 3388, 3488, 4388, 4488, 5388, 5488, 6388, 6488,7388,7488,8388, 8488,9388, 9488]

export const Q = {
    ajax: (url, settings = {}) => {
        var deffered = $.Deferred()
        settings.headers={
        	'authorization': localStorage.getItem('token')
        }
        if (settings.query !== undefined) {
            Q.assert(settings.data === undefined);
            Q.assert(url.search(/\?/) === -1);
            const qs = $.param(settings.query);
            url = `${url}?${qs}`;  /* eslint no-param-reassign: 0 */
        }
        if (settings.json !== undefined) {
            Q.assert(settings.data === undefined);
            settings.data = JSON.stringify(settings.json);
            settings.contentType = 'application/json; charset=UTF-8';
        }
        settings.xhrFields = {withCredentials: true}
        settings.crossDomain = true;
        const p = $.ajax(server+url, settings);
        if (settings.defaultFail !== false) {
            p.fail((jqXHR, textStatus, errorThrown) => {
                const json = Q.jsonedError(jqXHR, textStatus, errorThrown);
                showAlert(json.message, "danger");
                return deffered.reject(jqXHR)
            });
        } else {
            p.fail((jqXHR, textStatus, errorThrown) => {
                deffered.reject(jqXHR)
            })
        }
        p.done((data, textStatus, jqXHR) => {
            if (data.status == undefined || data.status == -1) {
                //session 过期了
                Q.alert(data.message || '账号已过期，请重新登录', 'danger');
                localStorage.clear()
                (data.status == -1) && (window.location.href = '/auth/login')
                return deffered.reject(jqXHR)
            }else if (data.status !=undefined && data.status == 0){
            	Q.alert(data.message , 'danger');
            	return deffered.reject(jqXHR)
            }else {
                return deffered.resolve(data.data)
            }

        })
        return deffered;
        //return p;
    },
    get: (url, settings = {}) => {
        settings.method = 'GET';
        return Q.ajax(url, settings);
    },
    post: (url, settings = {}) => {
        settings.method = 'POST';
        return Q.ajax(url, settings);
    },
    delete_: (url, settings = {}) => {
        settings.method = 'DELETE';
        return Q.ajax(url, settings);
    },
    put: (url, settings = {}) => {
        settings.method = 'PUT';
        return Q.ajax(url, settings);
    },
    patch: (url, settings = {}) => {
        settings.method = 'PATCH';
        return Q.ajax(url, settings);
    },
    defaultAjaxFail: (jqXHR, statusText, errorThrown) => {
        const json = Q.jsonedError(jqXHR, statusText, errorThrown);
        showAlert(json.message, "danger");
    },
    jsonedError: (jqXHR, statusText) => {
        if ((jqXHR.getResponseHeader('Content-Type') || '').search('json') !== -1) {
            return JSON.parse(jqXHR.responseText);
        } else {
            return { message: statusText };
        }
    },

    assert: (assertion, ...objs) => {
        console.assert(assertion, ...objs);
    },

    alert: (message, type = "success") => {
        showAlert(message, type);
    },

    data_file_url: (type, filename, saveFilename = null) => {
        let ret = `http://sealdata.youneng.com/${type}/${filename}`;
        if (saveFilename && saveFilename.indexOf('.') === -1 && filename.indexOf('.') !== -1) {
            // eslint-disable-next-line no-param-reassign
            // 自动补上后缀
            saveFilename = `${saveFilename}${filename.slice(filename.lastIndexOf('.'))}`;
        }
        if (saveFilename) {
            ret += `?fname=${encodeURIComponent(saveFilename)}`;
        }
        return ret;
    },

    dateStrToUnixTime: (dateStr) => {
        // 2016-09-11, 直接parse会当成utc时间
        const [year, month, day] = dateStr.split('-');
        return Math.floor(new Date(
            parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).getTime());
    },

    htmlEscape: (() => {
        const entityMap = {
            " ": "&nbsp;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;',
        };
        return function htmlEscape(string) {
            return string.replace(/[ &<>"'/]/g, s => entityMap[s]);
        };
    })(),

    htmlUnescape: (() => {
        const entityMap = {
            "&nbsp;": " ",
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': "/",
        };

        return function htmlUnescape(string) {
            return string.replace(/(&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, s => entityMap[s]);
        };
    })(),
};

export default Q;

export const Qdate = {
    // 和 js 统一，以ms为准
    // api交互时，统一以秒为准
    datetimeFormat: (ts) => {
        const date = ts instanceof Date ? ts : new Date(ts);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        return sprintf(`%04d-%02d-%02d %02d:%02d`, year, month, day, hour, minutes);
    },

    dateFormat: (ts) => {
        const date = ts instanceof Date ? ts : new Date(ts);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return sprintf(`%04d-%02d-%02d`, year, month, day);
    },

    today0: (now = null) => {
        // 对应 now 或现在日期的0时0分
        if (now === null) {
            now = new Date();  // eslint no-param-reassign: 0
        }
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },

    weekFirst: (now = null) => {
        // 周一开始
        now = Qdate.today0(now);
        let day = now.getDay();
        if (day === 0) {
            day = 7;
        }
        return new Date(now.getTime() - ((day - 1) * 86400 * 1000));
    },

    dateStrToUnixTime: Q.dateStrToUnixTime,
};

// deprecated
export function datetimeFormat(timestamp) {
    return Qdate.datetimeFormat(timestamp * 1000);
}

// deprecated
export function dateFormat(timestamp) {
    return Qdate.dateFormat(timestamp * 1000);
}

export class EduDesc {
    constructor(edu, name) {
        this.edu = edu;
        this.name = name;
    }

    static get(edu) {
        let desc = null;
        EduDesc.kAll.forEach((eduDesc) => {
            if (eduDesc.edu === edu) {
                desc = eduDesc;
            }
        });
        return desc;
    }
}

export class Edu { }

Edu.kElementary = 2;
Edu.kJunior = 3;
Edu.kSenior = 4;
Edu.kDefault = Edu.kSenior;

EduDesc.kAll = [
//	new EduDesc(2, '小学'),
    new EduDesc(3, '初中'),
    new EduDesc(4, '高中'),
];

export class Wenli {}

Wenli.kNone = 0;
Wenli.kLi = 2;
Wenli.kWen = 1;

Wenli.kAll = [
    { value: 0, desc: "不限" },
    { value: 1, desc: "文科" },
    { value: 2, desc: "理科" },
];

Wenli.kDescDict = {};
Wenli.kAll.forEach((item) => {
    Wenli.kDescDict[item.value] = item.desc;
});

export class Grade {
    static getGrades(edu) {
        if (edu === Edu.kElemetary) {
            return Grade.kElementarys;
        } else if (edu === Edu.kJunior) {
            return Grade.kJuninors;
        } else if (edu === Edu.kSenior) {
            return Grade.kSeniors;
        }
        return [];
    }

    static getGradeName(grade) {
        const target = [].concat(Grade.kJuniors, Grade.kSeniors)
            .find(desc => desc.grade === grade);
        return target ? target.name : `不详(${grade})`;
    }
}

Grade.kNone = 0;

Grade.kElementary_1 = 21;
Grade.kElementary_2 = 22;
Grade.kElementary_3 = 23;
Grade.kElementary_4 = 24;
Grade.kElementary_5 = 25;
Grade.kElementary_6 = 26;

Grade.kJunior_1 = 31;
Grade.kJunior_2 = 32;
Grade.kJunior_3 = 33;
Grade.kJunior_4 = 34;

Grade.kSenior_1 = 41;
Grade.kSenior_2 = 42;
Grade.kSenior_3 = 43;

Grade.kElementarys = [
    { grade: Grade.kElementary_1, name: "一年级" },
    { grade: Grade.kElementary_2, name: "二年级" },
    { grade: Grade.kElementary_3, name: "三年级" },
    { grade: Grade.kElementary_4, name: "四年级" },
    { grade: Grade.kElementary_5, name: "五年级" },
    { grade: Grade.kElementary_6, name: "六年级" },
];

Grade.kJuniors = [
    { grade: Grade.kJunior_1, name: "初一" },
    { grade: Grade.kJunior_2, name: "初二" },
    { grade: Grade.kJunior_3, name: "初三" },
];

Grade.kSeniors = [
    { grade: Grade.kSenior_1, name: "高一" },
    { grade: Grade.kSenior_2, name: "高二" },
    { grade: Grade.kSenior_3, name: "高三" },
];

Grade.kAll =[].concat(Grade.kJuniors, Grade.kSeniors);

export const DEFAULT_PROVINCE_LIST = [
    '安徽',
    '北京',
    '重庆',
    '福建',
    '甘肃',
    '贵州',
    '广东',
    '广西',
    '海南',
    '河北',
    '河南',
    '黑龙江',
    '湖北',
    '湖南',
    '吉林',
    '江苏',
    '江西',
    '辽宁',
    '内蒙古',
    '宁夏',
    '青海',
    '山东',
    '山西',
    '陕西',
    '上海',
    '四川',
    '天津',
    '西藏',
    '新疆',
    '云南',
    '浙江',
];
