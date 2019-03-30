import React from 'react';
import ReactDom from 'react-dom';


export class NavItem {
    constructor(name, url, disabled = false) {
        this.name = name;
        this.url = url;
        this.disabled = disabled;  // not used yet
    }
}

export function SiteNav(props) {
    const navItems = props.navItems.map((item) => {
        return (
            <li
                className={`${props.current === item.name ? 'active' : ''}`}
                key={item.name}
            >
                {item.url === '#'
                    ? <p className="navbar-text">{item.name.indexOf('上传')!=-1?'':item.name}</p>
                    : <a href={item.url}>{item.name.indexOf('上传')!=-1?'':item.name}</a>
                }
            </li>
        );
    });
    return (
        <ul className="nav navbar-nav">
            {navItems}
        </ul>
    );
}

export function setNavBar(navItems, current) {
    return ReactDom.render(
        <SiteNav navItems={navItems} current={current} />,
        document.querySelector('#quantum-navbar .page-nav')
    );
}
