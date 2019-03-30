import React from 'react';
import { Q } from 'js/quantum';
import { setNavBar, NavItem } from 'js/nav';
import "css/main.scss";
import { uploadFile } from 'js/widgets/uploader';

export class DocInputPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
        };
    }

    componentDidMount() {
        setCurrentNav('上传Doc');
    }

    handleUploadFile() {
        if (!this.state.title) {
            Q.alert("请输入标题，标题不能为空");
            return;
        }

        uploadFile('上传Doc', (json) => {
            const payload = {
                title: this.state.title,
                filename: json.filename,
            };

            Q.put(`/api/doc`, { json: payload })
             .done(() => {
                 Q.alert("创建Doc成功");
             });
        });
    }


    render() {
        return (
            <div id="doc-input-page">
                <div className="input-group">
                    <span className="input-group-addon">标题</span>
                    <input
                        type="text" className="form-control"
                        value={this.state.title}
                        onChange={evt => this.setState({ title: evt.target.value.trim() })}
                    />
                </div>
                <button
                    className="btn btn-default"
                    onClick={this.handleUploadFile.bind(this)}
                >上传Doc</button>
            </div>
        );
    }
}

function setCurrentNav(current) {
    const navItems = [
        new NavItem('录入', '/volume/input'),
        new NavItem('已录入', '/volumes'),
        new NavItem('上传Doc', '/doc/input'),
        new NavItem('已上传', '/docs'),
    ];
    setNavBar(navItems, current);
}
