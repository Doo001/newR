import React from 'react'
import ItemComponent from 'component/ItemComponent'
export default class Type1003 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stem: '',
            qs: [{
                desc: '',
                ans: '',
                exp: '',
                step: '',
            }],
        };
    }

    getData() {
        return Object.assign({}, this.state);
    }

    handleChange(evt) {
        this.props.setGoodToLeave(false);
        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleQChange(index, evt) {
        this.props.setGoodToLeave(false);
        this.state.qs[index][evt.target.name] = evt.target.value;
        this.forceUpdate();
    }

    handleDeleteQ(index) {
        this.props.setGoodToLeave(false);
        this.state.qs.splice(index, 1);
        this.forceUpdate();
    }

    handleStemBlur() {
        // 根据题号预生成小题
        if (this.state.qs.length > 1) {
            return;
        }

        const matches = [];
        const re = /^\s*[(（][12345][）)]\s*/gm;
        for (;;) {
            const match = re.exec(this.state.stem);
            if (!match) {
                break;
            }
            matches.push(match);
        }
        if (!matches.length || matches.length === 1 || matches.length === this.state.qs.length) {
            return;
        }
        const stem = this.state.stem.substring(0, matches[0].index);
        const qdescs = matches.map((match, index) => {
            if (index === matches.length - 1) {
                return this.state.stem.substring(match.index);
            } else {
                return this.state.stem.substring(match.index, matches[index + 1].index);
            }
        });

        this.props.setGoodToLeave(false);
        this.state.stem = stem;
        this.state.qs = qdescs.map((desc) => { return { desc, ans: '', exp: '',step:'' }; });
        this.forceUpdate();
    }

    handleAddQ() {
        this.props.setGoodToLeave(false);
        this.state.qs.push({
            desc: '',
            ans: '',
            exp: '',
            step: '',
        });
        this.forceUpdate();
    }

    _renderQ(q, index) {
        return (
            <li className="q-input" key={index}>
                <header>
                    <h4 style={{ display: 'inline-block', margin: 0 }}>第{index + 1}小题</h4>
                    <button
                        className="btn btn-default btn-xs"
                        style={{ float: 'right' }}
                        onClick={this.handleDeleteQ.bind(this, index)}
                    >删除</button>
                </header>
                <ItemComponent
                    name='desc' title='小题题干' rows={6}
                    onChange={this.handleQChange.bind(this, index)}
                    value={q.desc}
                />
                <ItemComponent
                    name='ans' title='答案' rows={6} onChange={this.handleQChange.bind(this, index)}
                    value={q.ans}
                />
                <ItemComponent
                    name='exp' title='解析' rows={6} onChange={this.handleQChange.bind(this, index)}
                    value={q.exp}
                />
                <ItemComponent
                    name='step' title='备注' rows={6} onChange={this.handleQChange.bind(this, index)}
                    value={q.step}
                />
            </li>
        );
    }
    
    clear(){
    	this.setState({
    		stem: '',
            qs: [{
                desc: '',
                ans: '',
                exp: '',
                step: '',
            }],
    	})
    }

    render() {
        return (
            <div className="parser-input-zone">
                <ItemComponent
                    name='stem' title='题干' rows={6} onChange={this.handleChange.bind(this)}
                    onBlur={this.handleStemBlur.bind(this)}
                    value={this.state.stem}
                />
                <ul style={{ paddingLeft: '1.25em' }}>
                    { this.state.qs.map(this._renderQ.bind(this)) }
                </ul>
                <hr />
                <button
                    className="btn btn-default btn-block btn-lg"
                    onClick={this.handleAddQ.bind(this)}
                >添加小题</button>
            </div>
        );
    }
}