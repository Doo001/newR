import React from 'react'
import HtmlWithTex from 'js/widgets/html_with_tex'
import { getSubject } from 'js/subjects'
import { Q } from 'js/quantum'

export default class Preview extends React.Component {
    constructor(props) {
        super(props)
        props.plan.general_explain.question_list.map(item => {
            this.sortQuestionList('general', item)
        })
        props.plan.deep_explain.question_list.map(item => {
            this.sortQuestionList('deep', item)
        })
    }

    state = {
        exercise: {
            deep: [],
            general: []
        }, //联系题
        example: {
            deep: [],
            general: []
        }, //例题
        tests: [],   //测试题
    }

    sortQuestionList(key, obj) {
        switch (obj.type) {
            case 1:
                this.state.example[key].push(obj);
                break;
            case 2:
                this.state.exercise[key].push(obj);
                break;
            case 3:
                this.state.tests.push(obj);
                break;
            default:
                console.warn(`question ${obj.id}'s type is not correct!`);
        }

    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            exercise: {
                deep: [],
                general: []
            }, //联系题
            example: {
                deep: [],
                general: []
            }, //例题
            tests: [],   //测试题
        }
        nextProps.plan.general_explain.question_list.map(item => {
            this.sortQuestionList('general', item)
        })
        nextProps.plan.deep_explain.question_list.map(item => {
            this.sortQuestionList('deep', item)
        })
    }

    render() {
        let { plan, html, isPlan } = this.props;
        const { exercise, example, tests } = this.state;
        return (
            <div className="page-frame-inner">
                <div className="page-count">
                    <div className="block">
                        <div className="plan-name">
                            <div className="plan-name-container">
                                {plan.name}
                            </div>
                        </div>
                        <PlanGoal goals={[{
                            content: plan.name,
                            star: plan.general_explain.star,
                            desc: html.general_explain.desc
                        }]} />
                        <PlanGeneralExplain plan={{
                            ...plan, ...{ isPlans: false }, ...{
                                example: example.general,
                                exercise: exercise.general
                            }
                        }} html={html} isPlan={isPlan} />
                        <PlanDeepExplain
                            plan={{ ...plan, ...{ isPlans: false }, ...{ example: example.deep, exercise: exercise.deep } }}
                            html={html} />
                        {
                            tests.length ? <PlanTest tests={tests} html={html} /> : ''
                        }

                    </div>
                </div>
            </div>
        )
    }
}

Preview.defaultProps = {
    html: {
        deep_explain: {
            expand: '',
            summary: ''
        },
        general_explain: {
            guide: '',
            knowledge: '',
            summary: '',
            exam: ''

        }
    },
    isPlan: true,
    plan: {
        _id: '232323',
        area_id: '2323',
        deep_explain: {
            expand: '深度讲解',
            question_list: [],
            summary: 'sddsd'
        },
        deleted: false,
        general_explain: {
            exam: '',
            guide: 'dsddsd',
            knowledge: 'sdsdsds',
            question_list: [
                {
                    item_id: '232323232323',
                    sort: 1,
                    type: 1,
                    html: '',
                    id: ''
                }
            ],
            summary: 'sdfdsfd'

        },
        name: '测试案例',
        parent_id: '23232332',
        subject_id: 1,
        weight: 100,
        test_list: [
            {
                item_id: '121212',
                sort: 1,
                type: 2
            }
        ]
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
                        <td width="250">目标序号</td>
                        <td width="250">教学内容</td>
                        <td width="100">星级</td>
                        <td>要求</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        goals.map((goal, index) => {
                            return (
                                <tr key={`goal${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{goal.content}</td>
                                    <td>{starType[goal.star].content}</td>
                                    <td><HtmlWithTex force={true} html={goal.desc} className="preview" /></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}


export const PlanGeneralExplain = ({ plan, html, isPlan, isPlans }) => {
    return (
        <div className="plan-content">
            <h3 className='plan-title'>教学内容 {isPlans ? `:${plan.name}` : ''}</h3>
            {
                isPlan ?
                    <div className="plan-body border">
                        {
                            html.general_explain.guide ? <div>
                                <div className="plan-tag">
                                    讲解指南
                                </div>
                                <div className="plan-desc">
                                    <HtmlWithTex html={html.general_explain.guide} />
                                </div>
                            </div> : ''
                        }
                        {
                            plan.example.length ? <div>
                                <div className="plan-tag">
                                    例题
                                </div>
                                <ol className="plan-example">
                                    {
                                        plan.example.map((test, index) => {
                                            return (
                                                <li key={`example${index}`}><HtmlWithTex key={`test${index}`}
                                                    html={test.html} />
                                                </li>

                                            )
                                        })
                                    }
                                </ol>
                            </div> : ''
                        }
                        {
                            plan.exercise.length ? <div>
                                <div className="plan-tag">
                                    练习
                                </div>
                                <ol className="plan-example">
                                    {
                                        plan.exercise.map((test, index) => {
                                            return (
                                                <li key={`exercise${index}`}><HtmlWithTex key={`test${index}`}
                                                    html={test.html} /></li>

                                            )
                                        })
                                    }
                                </ol>
                            </div> : ''
                        }
                        {
                            html.general_explain.summary ? <div>
                                <div className="plan-tag">讲解小结</div>
                                <div className="plan-desc"><HtmlWithTex html={html.general_explain.summary} /></div>
                            </div> : ''
                        }


                    </div> :
                    <div className="plan-body border">
                        <div className="plan-tag">
                            考情分析
                        </div>
                        <div className="plan-desc">
                            <HtmlWithTex html={html.general_explain.exam} />
                        </div>
                        <div className="plan-tag">知识点</div>
                        <div className="plan-desc"><HtmlWithTex html={html.general_explain.knowledge} /></div>
                        <div className="plan-tag">
                            例题
                        </div>
                        <ol className="plan-example">
                            {
                                plan.example.map((test, index) => {
                                    return (
                                        <li key={`example${index}`}><HtmlWithTex key={`test${index}`} html={test.html} />
                                        </li>

                                    )
                                })
                            }
                        </ol>
                        <div className="plan-tag">
                            练习
                        </div>
                        <ol className="plan-example">
                            {
                                plan.exercise.map((test, index) => {
                                    return (
                                        <li key={`exercise${index}`}><HtmlWithTex key={`test${index}`}
                                            html={test.html} /></li>

                                    )
                                })
                            }
                        </ol>

                    </div>
            }

        </div>

    )
}
export const PlanDeepExplain = ({ plan, html, isPlans }) => {
    return (
        <div className="plan-content">
            <h3 className='plan-title'>深度拓展 {isPlans ? `:${plan.name}` : ''}</h3>
            <div className="plan-body border">
                {
                    html.deep_explain.expand ? <div>
                        <div className="plan-tag">
                            拓展讲解
                        </div>
                        <div className="plan-desc">
                            <HtmlWithTex html={html.deep_explain.expand} />
                        </div>
                    </div> : ''
                }
                {
                    plan.example.length ? <div>
                        <div className="plan-tag">
                            例题
                        </div>
                        <ol className="plan-example">
                            {
                                plan.example.map((test, index) => {
                                    return (
                                        <li key={`example${index}`}><HtmlWithTex key={`test${index}`} html={test.html}
                                            className="preview" /></li>

                                    )
                                })
                            }
                        </ol>
                    </div> : ''
                }
                {
                    plan.exercise.length ? <div>
                        <div className="plan-tag">
                            练习
                        </div>
                        <ol className="plan-example">
                            {
                                plan.exercise.map((test, index) => {
                                    return (
                                        <li key={`exercise${index}`}><HtmlWithTex key={`test${index}`} html={test.html}
                                            className="preview" /></li>

                                    )
                                })
                            }
                        </ol>
                    </div> : ''
                }
                {
                    html.deep_explain.summary ? <div>
                        <div className="plan-tag">
                            拓展小结
                        </div>
                        <div className="plan-desc">
                            <HtmlWithTex html={html.deep_explain.summary} className="preview" />
                        </div>
                    </div> : ''
                }


            </div>
        </div>
    )
}
PlanDeepExplain.defaultProps = {
    isPlans: false,

    plan: {
        _id: '232323',
        area_id: '2323',
        exercise: [], //练习题
        example: [], //例题
        deep_explain: {
            expand: '深度讲解',
            question_list: [],
            summary: 'sddsd'
        },
        deleted: false,
        general_explain: {
            guide: 'dsddsd',
            knowledge: 'sdsdsds',
            question_list: [
                {
                    item_id: '232323232323',
                    sort: 1,
                    type: 1
                }
            ],
            summary: 'sdfdsfd'

        },
        name: '测试案例',
        parent_id: '23232332',
        subject_id: 1,
        weight: 100,
        test_list: [
            {
                item_id: '121212',
                sort: 1,
                type: 2
            }
        ]

    }
}
export const PlanTest = ({ tests }) => {
    return (
        <div className='plan-content'>
            <h3 className='plan-title'>测试</h3>
            <div className='plan-body border'>
                <ol className="plan-example">
                    {
                        tests.map((test, index) => {
                            return (
                                <li key={`test${index}`}><HtmlWithTex key={`test${index}`} html={test.html} /></li>

                            )
                        })
                    }
                </ol>
            </div>
        </div>
    )
}
