import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';


function getDialogRoot() {
    return document.querySelector('#dialog-root');
}

class SimpleUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'new',
        };
    }

    componentDidMount() {
        const domNode = ReactDom.findDOMNode(this);
        $(domNode).on('hidden.bs.modal', () => {
            ReactDom.unmountComponentAtNode(getDialogRoot());
        });
        $(domNode).modal();
    }

    handleUpload() {
        const formData = new FormData();
        formData.append('file', this.refs.fileInput.files[0]);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/upload");
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.setState({ status: "ok" });
                const resp = JSON.parse(xhr.responseText);
                this.props.onUploaded(resp);

                const domNode = ReactDom.findDOMNode(this);
                $(domNode).modal('hide');
            } else {
                this.setState({ status: "error" });
            }
        };
        xhr.send(formData);
        this.setState({ status: 'uploading' });
    }

    render() {
        let statusIndicator = <span className="upload-status label" />;
        if (this.state.status === 'ok') {
            statusIndicator = <span className="upload-status label label-success">上传成功</span>;
        } else if (this.state.status === 'error') {
            statusIndicator = <span className="upload-status label label-danger">上传失败</span>;
        } else if (this.state.status === 'uploading') {
            statusIndicator = <span className="upload-status label label-info">正在上传</span>;
        }

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            <input
                                type="file" name="file" ref='fileInput'
                                accept={this.props.accept}
                            />
                            {statusIndicator}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button" className="btn btn-default" data-dismiss="modal"
                            >取消</button>
                            <button
                                type="button" onClick={this.handleUpload.bind(this)}
                                className="btn btn-primary"
                            >确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SimpleUploader.defaultProps = {
    accept: '*/*',
};

export function uploadFile(title, onUploaded, props = {}) {
    return ReactDom.render(
        <SimpleUploader title={title} onUploaded={onUploaded} {...props} />,
        getDialogRoot()
    );
}

export default uploadFile;
