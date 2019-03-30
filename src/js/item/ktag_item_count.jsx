import React from 'react';
import isUndefined from 'lodash/isUndefined';
import { Q, Edu, EduDesc } from 'js/quantum';
import { EduSwitcher } from 'component/ItemParsing';
import { setCurrentNav } from './ktag_editor';

export default class KtagItemCount extends React.Component {
    constructor(props) {
        super(props);
        let edu = props.location.query.edu;
        if (isUndefined(edu)) {
            edu = Edu.kElementary;
        } else {
            edu = Number(edu);
        }
        this.state = { edu };
    }

    componentDidMount() {
        setCurrentNav('题目统计');
    }

    render() {
        return (
            <div>
                <EduSwitcher
                    edu={this.state.edu}
                    onEduChanged={(edu) => { window.location.href = `/ktags/item_count?edu=${edu}`; }}
                />
                <div style={{ marginTop: 12 }}>
                    <DownloadItemCount edu={this.state.edu} />
                </div>
            </div>
        );
    }
}

class DownloadItemCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getData(this.props.edu);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edu !== this.state.edu) {
            this.setState({
                edu: nextProps.edu,
            });
            this.getData(nextProps.edu);
        }
    }

    getData(edu) {
        Q.get(`/api/ktags/item_count?edu=${edu}`, { defaultFail: false })
         .done((report) => {
             this.setState({ report });
         })
         .fail((rv) => {
             if (rv.status === 404) {
                 this.setState({ report: null });
             } else {
                 Q.alert(rv.statusText, 'danger');
             }
         });
    }

    generateReport() {
        Q.put(`/api/ktags/item_count?edu=${this.props.edu}`)
         .done(() => {
             window.location.reload();
         });
    }

    render() {
        const report = this.state.report;
        if (isUndefined(report)) {
            return null;
        }

        const name = `${EduDesc.get(this.props.edu).name}题目统计`;
        if (!report) {
            return (
                <button
                    className="btn btn-primary"
                    onClick={this.generateReport.bind(this)}
                >生成{ name }</button>
            );
        }

        if (report.state === 1) {
            return <p>正在生成{ name }，请稍后刷新页面</p>;
        } else if (report.state === 2) {
            return (
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.open(`/ktags/item_count/content?edu=${this.props.edu}`)}
                    > 下载{ name } </button>
                    <button
                        style={{ marginLeft: 20 }}
                        className="btn btn-secondary"
                        onClick={this.generateReport.bind(this)}
                    >重新生成{ name } </button>
                </div>
            );
        }

        return null;
    }
}
