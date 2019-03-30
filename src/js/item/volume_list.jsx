import React from "react";
import Immutable from "immutable";
import { setNavBar, NavItem } from "js/nav";
import { Q, Qdate, EduDesc } from "js/quantum";
import Pagination, {
    DEFAULT_PAGE_NO,
    DEFAULT_PAGE_SIZE,
} from "js/widgets/pagination";
import "css/main.scss";
import { Review } from "./volume_view";

export class VolumeListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_no: DEFAULT_PAGE_NO,
            page_size: DEFAULT_PAGE_SIZE,
            total: 0,
            volumes: Immutable.List(),
        };
    }

    componentDidMount() {
        setCurrentNav("已录入");
        this.handleInput("page", 1);
    }

    async handleInput(msg, ...args) {
        if (msg === "page") {
            const [pageNo] = args;
            const page = await Q.get("/api/volumes", {
                query: {
                    page_no: pageNo,
                    page_size: this.state.page_size,
                },
            });
            this.setState({
                page_no: pageNo,
                total: page.total,
                volumes: Immutable.fromJS(page.results),
            });
        }
    }

    render() {
        return (
            <div id="volume-list-page" className="flex-column">
                <div className="volume-list">
                    <VolumeList volumes={this.state.volumes} />
                </div>
                <Pagination
                    pageNo={this.state.page_no}
                    totalPages={Math.ceil(
                        this.state.total / this.state.page_size
                    )}
                    paginateCallback={pageNo =>
                        this.handleInput("page", pageNo)}
                />
            </div>
        );
    }
}

function VolumeList(props) {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th width="5%"> 序号 </th>
                    <th width="20%" className="code"> ID </th>
                    <th width="40%"> 名称 </th>
                    <th width="5%"> 级段 </th>
                    <th width="15%"> 录入时间 </th>
                    <th width="15%"> 状态 </th>
                </tr>
            </thead>
            <tbody>
                {props.volumes.map((volume, index) =>
                    <VolumeRow volume={volume} index={index} key={index} />
                )}
            </tbody>
        </table>
    );
}

function VolumeRow(props) {
    return (
        <tr
            data-id={props.volume.get("_id")}
            className={props.volume.get("deleted") ? "strikeout" : ""}
        >
            <td>
                {props.index + 1}
            </td>
            <td className="code">
                {props.volume.get("_id")}
            </td>
            <td>
                <a href={`/volume/${props.volume.get("_id")}`}>
                    {props.volume.get("title") || "<EMPTY TITLE>"}
                </a>
            </td>
            <td>
                {EduDesc.get(props.volume.get("edu")).name}
            </td>
            <td>
                {Qdate.datetimeFormat(1000 * props.volume.get("ctime"))}
            </td>
            <td>
                <Review {...props} />
            </td>
        </tr>
    );
}

function setCurrentNav(current) {
    const navItems = [
        new NavItem("录入", "/volume/input"),
        new NavItem("已录入", "/volumes"),
//      new NavItem("上传Doc", "/doc/input"),
//      new NavItem("已上传", "/docs"),
    ];
    setNavBar(navItems, current);
}
