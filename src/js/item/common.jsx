import { setNavBar, NavItem } from 'js/nav';

export function setCurrentNav(current, itemId, search) {
    let navItems = null;
    const query = search || '';
    if (itemId) {
        navItems = [
            new NavItem('概要', `/item/${itemId}${query}`),
            new NavItem('排版', `/item/${itemId}/typeset${query}`),
            new NavItem('标注', `/item/${itemId}/tag${query}`),
            new NavItem('聚类', `/item/${itemId}/cluster${query}`),
            new NavItem('    ', '#'),
            new NavItem('创建', '/item/parse'),
        ];
    } else {
        navItems = [
            new NavItem('创建', '/item/parse'),
        ];
    }
    setNavBar(navItems, current);
}

export function makeWikiLink(wiki) {
    return `http://wiki.ma.photonmath.com/${encodeURIComponent(wiki)}`;
}
