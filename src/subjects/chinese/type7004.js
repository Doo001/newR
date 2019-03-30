import React from 'react'
import ItemComponent from 'component/ItemComponent'
export default class Type7004 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stem: '',
            desc: '',
            opts: '',
            ans: '',
            exp: '',
            step: '',
        };
    }
    
    clear(){
    	this.setState({
    		stem: '',
            desc: '',
            opts: '',
            ans: '',
            exp: '',
            step: '',
    	})
    }

    getData() {
        return Object.assign({}, this.state);
    }

    handleChange(evt) {
        this.props.setGoodToLeave(false);
        this.setState({[evt.target.name]: evt.target.value});
    }

    handleDescBlur() {
        // 尝试自动抽出选项段
        const match = /^\s*\\(one|two|four)ch/m.exec(this.state.desc);
        if (!match) {
            return;
        }
        this.setState({
            desc: this.state.desc.substring(0, match.index),
            opts: this.state.desc.substring(match.index),
        });
    }

    render() {
        return (
            <div className="parser-input-zone">
                <ItemComponent
                    name='stem' title='大题题干' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.stem}
                />
                <ItemComponent
                    name='desc' title='小题题干' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.desc}
                />
                <ItemComponent
                    name='opts' title='小题选项' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.opts}
                />
                <ItemComponent
                    name='ans' title='小题答案' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.ans}
                />
                <ItemComponent
                    name='exp' title='小题解析' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.exp}
                />
                <ItemComponent
                    name='step' title='小题备注' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.step}
                />
            </div>
        );
    }
}