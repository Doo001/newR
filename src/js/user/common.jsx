import { setNavBar, NavItem } from 'js/nav';
import Global from "global";

export function setCurrentNav(current, uid, profile = false) {
    let navItems = null;
    if (uid) {
        navItems = [
            new NavItem('用户列表', '/users'),
            new NavItem('全体统计', '/users/statistics'),
            new NavItem('添加', '/admin/useradd'),
            new NavItem('编辑', `/user/${uid}`),
        ];
        const permissions = Global.user.permissions.filter(p => p < 200);
        if (permissions.length) {
            navItems.push(new NavItem('用户统计', `/user/${uid}/statistics`));
            navItems.push(new NavItem('最近操作', `/user/${uid}/op_logs/recent`));
        }
    } else if (profile) {
        navItems = [
            new NavItem('修改信息', '/profile'),
        ];
            // 不包含数学部权限的不显示用户统计
        const permissions = Global.user.permissions.filter(p => p < 200);
        if (permissions.length) {
            navItems.push(new NavItem('用户统计', '/profile/statistics'));
            navItems.push(new NavItem('最近操作', '/profile/op_logs/recent'));
        }
    } else {
        navItems = [
            new NavItem('用户列表', '/users'),
            new NavItem('全体统计', '/users/statistics'),
            new NavItem('添加', '/admin/useradd'),
            
        ];
    }
    setNavBar(navItems, current);
}

export class UserRole {
    static isAdmin(role) {
        return role === UserRole.kAdmin;
    }
}

UserRole.kDescDict = {
    1: '管理员',
    10: '用户',
};

UserRole.kAdmin = 1;
UserRole.kUser = 10;

export class UserModule {}
UserModule.kAllModules = [
    { code: 1, desc: '数学部' },
];
UserModule.kDescDict = {};
UserModule.kAllModules.forEach((item) => { UserModule.kDescDict[item.code] = item.desc; });
UserModule.kMathDepartment = 1;
export class UserPermission {
    static getPermissionsByModule(module) {
        if (module === UserModule.kMathDepartment) {
            return UserPermission.kMathDepartment;
        }
        return null;
    }
}
UserPermission.kMathDepartment = [
    { code: 102, desc: '题目查询' },
    { code: 103, desc: '试卷编辑' },
    { code: 104, desc: '录入' },
];

UserPermission.kAll = {};
[].concat(UserPermission.kMathDepartment).forEach(
    (item) => { UserPermission.kAll[item.code] = item.desc; });
