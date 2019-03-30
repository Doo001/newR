import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import 'rc-select/assets/index.css';
import 'rc-tabs/assets/index.css';
import '../../css/lesson.scss'
import RelationTree from 'component/relationtree'
import LessonWrapper from './wrapper'
import Release from './release'
import PreviewWrapper from './preview'
import { preview} from "../../store/actions";
import { store } from 'js/main_entry'
import showAlert from "../widgets/alert";
import FormulaKit from 'component/formulaKit'


class Lesson extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        release: [],
        selected: ""
    }

    preview(obj) {
      let item = store.getState().lesson.content_list.filter(v => v.type == 1 && v.data.type == "102");
      if (item.length && !item[0].data.content) {
        showAlert("知识笔记不能为空", "danger")
      } else {
        this.props.preview(obj)
      }
    }

    render() {
        //let { release, selected } = this.state;
        return (
            <Row className="lesson-wrapper">
                <PreviewWrapper/>
                <FormulaKit type='ckeditor'/>
                <RelationTree {...this.props}/>
                <div className="preview-ctr">
                    <ul>
                        <li><a onClick={e=>{e.stopPropagation(); this.preview({type: 'plan', show: true})}}>预览教案</a></li>
                        <li><a onClick={e=>{e.stopPropagation(); this.preview({type: 'text', show: true})}}>预览教材</a></li>
                    </ul>
                </div>
                <Col xs>
                   <Row className="content-wrapper">

                       <div className="lessonContent">
                           <Release/>
                           <div className="lesson-tabs-wrapper">
                               <Tabs
                                   defaultActiveKey="1"
                                   renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onTabClick}/>}
                                   renderTabContent={() => <TabContent/>}
                                   onChange={this.onChange}
                               >
                                   <TabPane tab="教案教材" key="1">
                                       <div className="tab-content-wrapper">
                                           <LessonWrapper/>
                                       </div>

                                   </TabPane>
                                   <TabPane tab="配套测试" key="2">
                                       配套测试
                                   </TabPane>
                                   <TabPane tab="配套课件" key="3">
                                       配套课件
                                   </TabPane>
                               </Tabs>
                           </div>


                       </div>

                   </Row>
                </Col>



            </Row>
           )

    }

}
Lesson.PropTypes = {
    preview: PropTypes.func.isRequired
}
function mapDispatchToProps(dispatch) {
    return {
        preview: (data) => {
            dispatch(preview(data))
        }
    }
}

export default connect (null, mapDispatchToProps)(Lesson)