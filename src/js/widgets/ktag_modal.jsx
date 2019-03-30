import React from 'react';
import { Modal, ModalBody } from 'js/widgets/modal';
import KTagPanel from 'js/item/ktag';
import { Q } from 'js/quantum';
import { getSubject } from 'js/subjects';

export class KtagModal extends React.Component {
    static show(edu, tagIds, onSubmit) {
        return Modal.show(
            <Modal
                id="kt-modal"
            >
                <KtagModal
                    selectedKTagIds={tagIds}
                    edu={edu}
                    onSubmit={onSubmit}
                />
            </Modal>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedKTagIds: props.selectedKTagIds || [],
            dataReady: false,
        };
        this.ktags = null;
        this.kTagsMap = {};
        this.edu = props.edu;
    }

    componentDidMount() {
        Q.get(`/api/ktags`).done((data) => {
            data.results.forEach((tag) => {
                this.kTagsMap[tag._id] = tag;
            });
            this.ktags = data.results;
            this.setState({ dataReady: true });
        });
    }

    addKtag(ktId) {
        const selectedKTagIds = this.state.selectedKTagIds;
        const isExist = selectedKTagIds.some((sKtagId) => {
            return sKtagId === ktId;
        });
        if (!isExist) {
            selectedKTagIds.push(ktId);
            this.setState({ selectedKTagIds });
        }
    }

    removeKtag(ktId) {
        const selectedKTagIds = this.state.selectedKTagIds;
        const isExist = selectedKTagIds.some((sKtagId) => {
            return sKtagId === ktId;
        });
        if (isExist) {
            const index = selectedKTagIds.findIndex((sKtagId) => {
                return sKtagId === ktId;
            });
            selectedKTagIds.splice(index, 1);
            this.setState({ selectedKTagIds });
        }
    }

    submit() {
        this.props.onSubmit(this.state.selectedKTagIds.map(id => this.kTagsMap[id]));
    }

    render() {
        if (!this.state.dataReady) {
            return <div />;
        }
        return (
            <ModalBody>
                <div className="selected-panel">
                    <ul className="selected-kt-wrapper">
                        { this.state.selectedKTagIds.map(id =>
                            <li key={id}>
                                <span>{this.kTagsMap[id].name}</span>
                                <a
                                    className="tool-icon-wrapper"
                                    onClick={this.removeKtag.bind(this, id)}
                                >
                                    <span className="glyphicon glyphicon-remove" />
                                </a>
                            </li>
                        )}
                    </ul>
                    <div className="btns-wrapper">
                        <button className="btn btn-success" onClick={this.submit.bind(this)}>
                            确定
                        </button>
                        <button className="btn btn-default modal-btn" data-action="close">
                            取消
                        </button>
                    </div>
                </div>
                <div className="kt-panel-wrapper">
                    <KTagPanel
                        edu={this.edu} tags={this.ktags}
                        selectKtag={this.addKtag.bind(this)}
                        rootTypes={getSubject().getKtTypeDescs().map(t => t.type)}
                    />
                </div>
            </ModalBody>
        );
    }
}

export default KtagModal;
