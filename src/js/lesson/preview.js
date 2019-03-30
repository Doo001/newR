import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HtmlWithTex from 'js/widgets/html_with_tex'
import { getSubject } from 'js/subjects'
import { Q } from 'js/quantum'
import Portal from 'js/widgets/portal'
import { preview } from 'store/actions'
class ItemList extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        html: ""
    }
    componentDidMount() {
       this.getHtml(this.props.content)

    }
    componentWillReceiveProps(nextProps) {
        this.getHtml(nextProps.content)
    }
    getHtml(content) {
        if (!content.data.content) {
           return this.setState({
                html: ""
            })
        }
        if (content.type == 2) {
            Q.get(`/api/item/${content.data.content}/html`)
                .done(result => {
                    this.setState({ html: result.html });
                })
        } else {
            Q.post(`/api/ktag`, {json: {preview: {desc: content.data.content} }})
                .done((data) => {
                    this.setState({
                        html: data.desc_rendered
                    })
                });
        }
    }
    render() {
        let { content } = this.props;
        let { html } = this.state;
        let planTitle = 'plan-title';
        let planDesc = 'plan-desc';
        if (!content.data.content) return null;

        if(content.type==1){//1文本
            if([1,2,3,101,102,103].indexOf(content.data.type)!= -1 ){//常规文本
                planTitle = 'plan-title';
            }else{//拓展文本
                planTitle = "extraPlan-title";
            }
            planDesc = 'plan-desc';
        }else{//2题
            if([1,2].indexOf(content.data.type)!= -1 ){//常规题
                planTitle = "question-title";
                planDesc = 'question-desc';
            }else{//拓展题
                planTitle = "extraQuestion-title";
                planDesc = 'question-desc';
            }

        }
        return (
            <div className="clearfix">
                {
                    content.data.title == "无须标题" || content.data.title == ""? null : <div className={planTitle}>
                        {content.data.title}
                    </div>
                }

                <div className={planDesc}>
                    <HtmlWithTex html={html} />
                </div>
            </div>
        )
    }
}
ItemList.PropTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired
}
class Preview extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        plan: {
            2: [1, 2, 3, 4],
            1: [1, 2, 3, 4, 5, 6]
        },
        text: {
            2: [1,2],
            1: [101, 102, 103]
        }
    }

    render() {
        let { preview, lesson } = this.props;

        let contents = lesson.content_list.filter(content => this.state[preview.type][content.type].indexOf(content.data.type)!= -1);

        return (
            <div className={preview.type == "text"? "page-frame-inner hideAnswers" : "page-frame-inner"}>
                <div className="page-count">
                    <div className="block">
                        <div className='topLogo'></div>
                        <div className="plan-name">
                            <div className="plan-name-container">
                                {lesson.name}
                            </div>
                        </div>
                        <PlanGoal goals={lesson.target_list} />
                        {
                            contents.map((content, index) => <ItemList key={`content${index}`} content={content}/>)
                        }
                        <div className='bottomLogo'></div>
                    </div>
                </div>
            </div>
        )
    }
}
class PreviewWrapper extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let { preview, lesson, closePreview } = this.props;
        return (
            <div>
                {
                    preview.show ?
                        <Portal previewPlan={preview.show} closePortalCallback={closePreview}>
                            <Preview preview={preview} lesson={lesson} />
                        </Portal> :
                        null

                }
            </div>
        )
    }

}
Preview.PropTypes = {
    lesson: PropTypes.object.isRequired,
    preview: PropTypes.object.isRequired
}
PreviewWrapper.PropTypes = {
    lesson: PropTypes.object.isRequired,
    preview: PropTypes.object.isRequired
}
function mapStateToProps(state) {
    return {
        lesson: state.lesson,
        preview: state.preview
    }
}


function mapDispatchToProps(dispatch) {
    return {
        closePreview: () => {
            dispatch(preview({
                show: false
            }))
        }
    }
}
const PlanGoal = ({ goals }) => {
    let starType = getSubject().getLessonSliceLevel();
    return (
        <div className="plan-goal">
            <h3 className='plan-title'>教学目标</h3>
            <table className='table s-body goal'>
                <thead>
                <tr>
                    <td width="304">星级</td>
                    <td>要求</td>
                </tr>
                </thead>
                <tbody>
                {
                    goals.map((goal, index) => {
                        return (
                            <tr key={`goal${index}`}>
                                <td style={{width:304}}>{starType[goal.star].content}</td>
                                <td>{goal.desc}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewWrapper)



