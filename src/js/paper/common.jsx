import { setNavBar, NavItem } from 'js/nav';

export function setCurrentNav(current) {
    setNavBar([
        new NavItem('创建', '/omega_paper/create'),
        new NavItem('列表', '/omega_papers')
        // new NavItem('整套录入', '/volume/input')
    ], current);
}
