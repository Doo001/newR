import React from 'react'
import HtmlWithTex from 'js/widgets/html_with_tex'
import { Q } from 'js/quantum'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'js/widgets/modal';
import ItemParsing from 'subjects/<%SUBJECT%>/parsePage';
import { showAlert } from 'js/widgets/alert';


export default class PlanWrap extends React.Component {
    state = {
        plans: []
    }

    constructor(props) {
        super(props)
        this.obj = {}

    }

    componentDidMount() {
        this.updatePlans(this.props.plans)
    }

    updatePlans = (plans) => {
        let itemIds = plans.map(plan => {
            this.obj[plan.item_id] = plan;
            return plan.item_id
        })
        if (!itemIds.toString()) {
            this.setState({ plans: [] });
            return;
        }
        Q.get(`/api/item/${itemIds.toString()}/htmls`)
            .done(result => {
                result.map(item => {
                    Object.assign(this.obj[item.id], item);
                })
                this.setState({ plans: Object.values(this.obj) }, () => {
                    this.props.syncStateNode(this.props.name, this.state.plans)
                })
            })

    }

    componentWillReceiveProps(nextProps) {
        this.obj = {};
        this.updatePlans(nextProps.plans)
    }

    movePlan = (up = true, index, plan) => {
        this.state.plans.splice(index, 1)
        if (up) {
            this.state.plans.splice(index - 1, 0, plan)
        } else {
            this.state.plans.splice(index + 1, 0, plan)
        }
        this.setState({ plans: this.state.plans.slice() })
        this.props.syncStateNode(this.props.name, this.state.plans)
    }
    removePlan = (plan) => {
        let plans = this.state.plans;
        for (let i = 0; i < plans.length; i++) {
            if (plan.item_id == plans[i].item_id) {
                plans.splice(i, 1);
                break;
            }
        }
        this.forceUpdate(() => {
            this.props.syncStateNode(this.props.name, plans)
        })
    }
    syncPlanNode = (item) => {
        for (let i = 0; i < this.state.plans.length; i++) {
            if (this.state.plans[i].id == item.id) {
                this.state.plans[i] = item;
                break;
            }
        }
        this.props.syncStateNode(this.props.name, this.state.plans)
    }

    addItem = (preItem, newItem) => {
        let index = this.state.plans.indexOf(preItem);
        this.state.plans.splice(index, 0, newItem);
        this.forceUpdate(() => {
            this.props.syncStateNode(this.props.name, this.state.plans)
        })
    }
    render() {

        return (
            <div className="plan-qus-wraps">
                <ul className={`part-body plan-wrap ${this.props.name}`}>
                    {
                        this.state.plans.map((plan, index) => <PlanItem key={plan._id} {...this.props} index={index}
                            movePlan={this.movePlan}
                            syncPlanNode={this.syncPlanNode}
                            removePlan={this.removePlan}
                            plan={plan} addItem={this.addItem}></PlanItem>)
                    }
                </ul>
            </div>

        )
    }

}

class PlanItem extends React.Component {
    state = {
        type: null,
        focus: false
    }

    constructor(props) {
        super(props);
        this.state.type = props.plan.type;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ type: nextProps.plan.type })
    }

    changePlanType(type) {
        this.setState({ type }, () => {
            this.props.syncPlanNode(Object.assign({}, this.props.plan, { type }))
        })

    }


    saveCallback = (item) => {
        this.modal.close();
        this.modal = null;
        this.props.addItem(item, { id: item._id, html: item.html, sort: this.currentPlan.sort + 1, type: this.currentPlan.type, item_id: item._id })
    }
    showCreateModal = (plan) => {
        this.currentPlan = plan;
        this.modal = Modal.show(
            <Modal
                modalDialogClass="modal-big"
            >
                <ModalHeader>
                    <h4 className="modal-title">题目新建</h4>
                </ModalHeader>
                <ModalBody>
                    <ItemParsing
                        saveCallback={this.saveCallback}
                    />
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button" className="btn btn-default modal-btn"
                        data-action="close"
                    >
                        关闭
                    </button>
                </ModalFooter>
            </Modal>
        );
    }


    render() {
        let { plan, index, plans } = this.props;
        let tabBars = this.props.subject.getPlanTypes().map(type => {
            return <span className={type.name == this.state.type ? "selected" : ""}
                onClick={() => this.changePlanType(type.name)}>{type.displayName}</span>
        })

        return (
            <li key={plan.item_id} id={plan.item_id} className="paper-border paper-item">
                <div className="plan-tabs">
                    <span className="leftBlock"></span>{tabBars}<em className="closeIt" onClick={() => {this.props.removePlan(plan)}}>+</em>
                </div>
                <div className="item-display">
                    <HtmlWithTex html={this.props.plan.html} />
                </div>
                <div className="general-info">
                    <span className="label no-click code"> {plan.item_id} </span>
                    &nbsp;

                    <a href={`/item/${plan.item_id}`} target='_blank'> 查看 </a>
                    &nbsp;
                    <a href={`/item/${plan.item_id}/tag`} target='_blank'> 标注 </a>
                    &nbsp;
                    <a href={`/item/${plan.item_id}/typeset`} target='_blank'> 排版 </a>
                    &nbsp;
                    <a href={`/item/${plan.item_id}/cluster`} target='_blank'> 聚类 </a>
                </div>
                <div className="btns">
                    <button
                        className={`btn-icon up ${index === 0 || plans.length == 1 ? 'hidden' : ''}`}
                        onClick={() => {
                            this.props.movePlan(true, index, plan);
                        }}>上移
                    </button>
                    <button className={`btn-icon down ${index === plans.length - 1 ? 'hidden' : ''}`}
                        onClick={() => {
                            this.props.movePlan(false, index, plan);
                        }}>下移
                    </button>
                    <button className="btn-primary" onClick={() => {
                        this.props.removePlan(plan)
                    }}>删除此题
                    </button>
                </div>
            </li>
        )
    }
}

PlanItem.defaultProps = {
    plan: {}
}
