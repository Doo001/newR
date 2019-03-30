import React from "react";
import Immutable from "immutable";
import { setNavBar, NavItem } from "js/nav";
import { Q, Qdate, EduDesc, Grade } from "js/quantum";
import { ItemDisplay } from "js/item/display";
import Global from "global";
import { Modal, ModalHeader, ModalBody, ModalFooter,ModalCreateTrue} from 'js/widgets/modal';
import "css/main.scss";

export class VolumePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: null,
        };
    }

    componentDidMount() {
        setNavBar([
            new NavItem("录入", "/volume/input"),
            new NavItem("已录入", "/volumes"),
            new NavItem("上传Doc", "/doc/input"),
            new NavItem("已上传", "/docs"),
        ]);

        this.handleInput("init");
    }

    async handleInput(msg, ...args) {
        try {
            if (msg === "init") {
                const volume = await Q.get(
                    `/api/volume/${this.props.params.id}`
                );
                this.setState({ volume: Immutable.fromJS(volume) });
            } else if (msg === "change") {
                const [field, value] = args;
                const volume = this.state.volume.set(field, value);
                this.setState({ volume });
            } else if (msg === "rename") {
                await Q.patch(`/api/volume/${this.state.volume.get("_id")}`, {
                    json: { title: this.state.volume.get("title") },
                });
                Q.alert("重命名成功");
            } else if (msg === "delete") {
                if (!confirm("确认删除？")) {
                    return;
                }
                await Q.patch(`/api/volume/${this.state.volume.get("_id")}`, {
                    json: { deleted: true },
                });
                location.reload();
            } else if (msg === "restore") {
                await Q.patch(`/api/volume/${this.state.volume.get("_id")}`, {
                    json: { deleted: false },
                });
                location.reload();
            } else if (msg === "create-paper") {
                this.showCreatePaperModal();
            }
        } catch (e) {
            if (!("promise" in e)) {
                throw e;
            }
        }
    }

    showCreatePaperModal() {
        const modal = ModalCreateTrue.show(
            <ModalCreateTrue>
            	<ModalHeader>
                    <h4 className="modal-title">创建优学试卷</h4>
                </ModalHeader>
                <ModalBody>
                    <CreateOmegaPaper
                        volume={this.state.volume.toJS()}
                        onCreated={() => {
                            modal.close();
                            Q.alert("创建成功");
                            window.setTimeout(location.reload.bind(location), 1000);
                        }}
                    />
                </ModalBody>
            </ModalCreateTrue>
        );
    }

    render() {
        if (this.state.volume === null) {
            return <div className="loading">加载中...</div>;
        }
        return (
            <div id="volume-view">
                <Header
                    volume={this.state.volume}
                    handleInput={this.handleInput.bind(this)}
                />
                <Body volume={this.state.volume} itemIds={this.state.volume.get("item_ids")} />
            </div>
        );
    }
}

class CreateOmegaPaper extends React.Component {
    static extractInitialStateFromVolume(volume) {
        const state = {
            name: volume.title,
            year: new Date().getFullYear(),
            grade: Grade.kJunior_1,
            cat: '',
            item_ids: volume.item_ids,
            volume_id: volume._id,
        };
        const yearMo = /\d{4}(?!\d)/.exec(volume.title);
        if (yearMo) {
            state.year = parseInt(yearMo[0], 10);
        }
        const gradeMo = /(一|二|三|四|五|六)年级/.exec(volume.title);
        if (gradeMo) {
            state.grade = {
                一年级: 21,
                二年级: 22,
                三年级: 23,
                四年级: 24,
                五年级: 25,
                六年级: 26,
            }[gradeMo[0]];
        } else {
            const groupMo = /中|高/.exec(volume.title);
            if (groupMo) {
                state.grade = {
                    中: 24,
                    高: 26,
                }[groupMo[0]];
            }
        }
        const catMo = /华杯|迎春杯|走美杯|希望杯/.exec(volume.title);
        if (catMo) {
            state.cat = catMo[0];
            if (state.cat === '华杯') {
                state.cat += '赛';
            }
        }

        return state;
    }

    constructor(props) {
        super(props);
        this.state = CreateOmegaPaper.extractInitialStateFromVolume(props.volume);
    }

    submit(event) {
        event.preventDefault();
        Q.put('/api/omega_papers', { json: this.state })
            .done((paper) => {
                this.props.onCreated(paper);
            })
        ;
    }

    render() {
        return (
            <form className="form formCreat" onSubmit={this.submit.bind(this)} style={{'padding':'40px 10%'}}>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon">名字</span>
                        <input
                            type="text" value={this.state.name} name="name"
                            placeholder="paper name" required className="form-control"
                            onChange={event => this.setState({ name: event.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon">时间</span>
                        <input
                            type="number" value={this.state.year} name="year"
                            min="2009" max={`${new Date().getFullYear() + 1}`} required className="form-control"
                            onChange={event =>
                                this.setState({ year: parseInt(event.target.value, 10) })
                            }
                        />
                        <span className="input-group-addon">年</span>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon">年级</span>
                        <select
                            name="grade" className="form-control" value={this.state.grade}
                            onChange={event =>
                                this.setState({ grade: parseInt(event.target.value, 10) })
                            }
                        >
                            {
                                Grade.kAll.map(gradeDesc =>
                                    <option value={gradeDesc.grade} key={gradeDesc.grade}>
                                        {gradeDesc.name}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon">类别</span>
                        <input
                            type="text" value={this.state.cat} name="cat"
                            placeholder="高考真题（理）"
                            required className="form-control"
                            onChange={event => this.setState({ cat: event.target.value })}
                        />
                    </div>
                </div>

                <ModalFooter style={{border:0}}>
                    <input type="submit" name="创建" value="创建" className="btn btn-primary creatBtn" />
                </ModalFooter>
            </form>
        );
    }
}

class Reviewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: null };
    }

    componentDidMount() {
        if (this.props.volume.get("reviewer_id")) {
            Q.get(
                `/api/user/${this.props.volume.get("reviewer_id")}`
            ).done((user) => {
                if (user.name) {
                    this.setState({ name: user.name });
                } else {
                    this.setState({ name: user.email });
                }
            });
        }
    }

    render() {
        return (
            <div>
                <span>
                    {reviewStatus(this.props.volume.get("review"))}
                </span>
                {this.state.name &&
                    <span>
                        {" "} - {this.state.name}
                    </span>}
            </div>
        );
    }
}

function Header(props) {
    const volume = props.volume;
	
    return (
        <div>
            <h2>Volume基本信息</h2>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td width="20%"> ID </td>
                        <td width="80%" className="code">
                            {volume.get("_id")}
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 名称 </td>
                        <td width="80%">
                            <div className="flex-row">
                                <input
                                    className="form-control"
                                    value={volume.get("title")}
                                    onChange={evt =>
                                        props.handleInput(
                                            "change",
                                            "title",
                                            evt.target.value
                                        )}
                                />
                                <button
                                    className="btn btn-warning"
                                    onClick={() => props.handleInput("rename")}
                                >
                                    修改名称
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 级段 </td>
                        <td width="80%">
                            {EduDesc.get(volume.get("edu")).name}
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 录入时间 </td>
                        <td width="80%">
                            {Qdate.datetimeFormat(
                                1000 * props.volume.get("ctime")
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 状态 </td>
                        <td width="80%">
                            <Reviewer volume={volume} />
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 原始文件 </td>
                        <td width="80%">
                            <a
                                target="_blank"
                                href={Q.data_file_url(
                                    "doc",
                                    volume.get("filename"),
                                    volume.get("title")
                                )}
                            >
                                点击下载
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 是否已删除 </td>
                        <td width="80%">
                            {props.volume.get("deleted") ? "是" : "否"}
                        </td>
                    </tr>
                    <tr>
                        <td width="20%"> 操作 </td>
                        <td width="80%">
                            {props.volume.get("deleted")
                                ? <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                          props.handleInput("restore")}
                                >
                                      恢复
                                  </button>
                                : <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                          props.handleInput("delete")}
                                >
                                      删除
                                  </button>}
                            <Review {...props} />
                            {props.volume.get('omega_paper_id')
                                    ? <a
                                        href={`/omega_paper/${props.volume.get("omega_paper_id")}`}
                                        target="_blank"
                                    >查看试卷</a>
                                    : <button
                                        className="btn btn-default"
                                        onClick={() => props.handleInput("create-paper")}
                                    >创建试卷</button>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function Body(props) {
    return (
        <div className="volume-body">
            <h2>题目部分</h2>
            <table className="volume-items table table-striped">
                <tbody>
                    {props.itemIds.map((itemId, index) => {
                        return (
                            <tr key={itemId}>
                                <td width="30%">
                                    <ul>
                                        <li>
                                            序号：{index + 1}
                                        </li>
                                        <li>
                                            ID：
                                            <a
                                                href={`/item/${itemId}`}
                                                target="_blank"
                                                className="code"
                                            >
                                                {itemId}
                                            </a>
                                        </li>
                                    </ul>
                                </td>
                                <td width="70%">
                                    <ItemDisplay volume={props.volume} id={itemId} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function Review(props) {
    const review = props.volume.get("review");
    const handleInput = function () {
        const reviewerId = props.volume.get("reviewer_id", "");
        if (reviewerId && reviewerId !== Global.user._id) {
            let status = null;
            if (review === ReviewStatus.kTagging) {
                status = "标注";
            } else if (review === ReviewStatus.kTypesetting) {
                status = "审核";
            } else if (review === ReviewStatus.kRetagging) {
                status = "复标";
            }

            if (status && !confirm(`有其它人正在${status}中，确定要${status}吗？`)) {
                return;
            }
        }
		Q.get(`/review?volume_id=${props.volume.get("_id")}`).done(data => {
	        if (data) {
	        	Q.get(data).done(res => {
			        if (res) {
		        		window.open(res);
			        }
			    })
	        }
	    })
    };

    return (
        <button className="btn btn-primary" onClick={handleInput}>
            {reviewStatus(review)}
        </button>
    );
}

export function reviewStatus(review) {
    if (review < 0 || review > 6) {
        return "";
    }

    return ["等待标注", "标注中", "等待审核", "审核中", "审核完毕", "等待复标", "复标中"][review];
}

class ReviewStatus {}
ReviewStatus.kNone = 0;
ReviewStatus.kTagging = 1;
ReviewStatus.kTagged = 2;
ReviewStatus.kTypesetting = 3;
ReviewStatus.kTypesetted = 4;
ReviewStatus.kNeedRetag = 5;
ReviewStatus.kRetagging = 6;
