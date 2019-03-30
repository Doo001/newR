import React from 'react';
import Immutable from 'immutable';
import { setNavBar, NavItem } from 'js/nav';
import { Q, Qdate } from 'js/quantum';
import "css/main.scss";

export class DocPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: null,
        };
    }

    componentDidMount() {
        setNavBar([
            new NavItem('录入', '/volume/input'),
            new NavItem('已录入', '/volumes'),
            new NavItem('上传Doc', '/doc/input'),
            new NavItem('已上传', '/docs'),
        ]);

        Q.get(`/api/doc/${this.props.params.id}`)
            .done((doc) => {
                this.setState({ doc: Immutable.fromJS(doc) });
            });
    }

    render() {
        if (this.state.doc === null) {
            return (<div className="loading">加载中...</div>);
        }
        const doc = this.state.doc;

        return (
            <div id="doc-view">
                <h2>Doc基本信息</h2>
                <table className='table table-bordered'>
                    <tbody>
                        <tr>
                            <td width="20%"> ID </td>
                            <td width="80%" className="code"> {doc.get('_id')} </td>
                        </tr>
                        <tr>
                            <td width="20%"> 名称 </td>
                            <td width="80%"> {doc.get('title')} </td>
                        </tr>
                        <tr>
                            <td width="20%"> 创建时间 </td>
                            <td width="80%"> {Qdate.datetimeFormat(1000 * doc.get('ctime'))} </td>
                        </tr>
                        <tr>
                            <td width="20%"> 状态 </td>
                            <td width="80%"> {docStatus(doc.get('status'))} </td>
                        </tr>
                        {doc.get('status') === 5 &&
                            <tr>
                                <td width="20%"> 错误 </td>
                                <td width="80%"> {doc.get('last_error')} </td>
                            </tr>
                        }
                        {doc.get('status') === 3 &&
                            <tr>
                                <td width="20%"> Volume </td>
                                <td width="80%"> <a href={`/volume/${doc.get('to_volume')}`} > {doc.get('to_volume')} </a> </td>
                            </tr>
                        }
                        <tr>
                            <td width="20%"> 原始文件 </td>
                            <td width="80%">
                                <a
                                    target='_blank'
                                    href={Q.data_file_url('doc', doc.get('doc_filename'), doc.get('title'))}
                                > 点击下载 </a>
                            </td>

                        </tr>
                        {doc.get('text_filename') &&
                            <tr>
                                <td width="20%"> 转换后的文件 </td>
                                <td width="80%">
                                    <a
                                        target='_blank'
                                        href={Q.data_file_url('doc', doc.get('text_filename'), doc.get('title'))}
                                    > 点击下载 </a>
                                </td>

                            </tr>
                        }
                        <tr>
                            <td width="20%"> 是否已删除 </td>
                            <td width="80%">
                                {doc.get('deleted') ? '是' : '否'}
                            </td>
                        </tr>
                        <tr>
                            <td width="20%"> 操作 </td>
                            <td width="80%">
                                <DeleteDoc doc={doc} />
                                <RedoConvert doc={doc} />
                                <CreateVolume doc={doc} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export function docStatus(status) {
    const captions = ['', '已上传', '已成功转换为文本文件', 'Volume已创建', '转换中', '转换失败', '等待重新转换'];

    if (status < 1 || status > captions.length - 1) {
        return '';
    }

    return `${status} - ${captions[status]}`;
}

function DeleteDoc(props) {
    if (props.doc.get('deleted')) {
        return (
            <button
                className="btn btn-primary"
                onClick={() => deleteDoc(props.doc.get('_id'), false)}
            >恢复</button>
        );
    } else {
        return (
            <button
                className="btn btn-danger"
                onClick={() => deleteDoc(props.doc.get('_id'), true)}
            >删除</button>
        );
    }
}

function deleteDoc(docId, deleted) {
    if (deleted && !confirm('确认删除？')) {
        return;
    }

    Q.patch(`/api/doc/${docId}`, { json: { deleted } })
        .done(() => location.reload());
}

function CreateVolume(props) {
    if (props.doc.get('status') === 2) {
        return (
            <a role="button" className="btn btn-success" href={`/volume/input?from_doc=${props.doc.get("_id")}`}>创建Volume</a>
        );
    }

    return null;
}

function RedoConvert(props) {
    const status = props.doc.get('status', 0);
    if (status === 5 || status === 2) {
        return (
            <button
                className="btn btn-danger"
                onClick={() => redoTransform(props.doc.get('_id'))}
            >重新转换</button>
        );
    }

    return null;
}

function redoTransform(docId) {
    if (!confirm('确定要重新转换吗？')) {
        return;
    }

    Q.patch(`/api/doc/${docId}`, { json: { status: 6 } })
     .done(() => Q.alert('请求已提交'));
}
