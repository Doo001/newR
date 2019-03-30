import React from 'react'
import { connect } from 'react-redux'
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select, {Option, OptGroup} from 'rc-select';
import { saveLesson } from 'store/actions'
class Release extends React.Component{
    constructor(props) {
        super(props)
    }
    state = {
        selected: ""
    }
    onChange = (value, option)=> {
        this.setState({
            selected: option._id
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selected : nextProps.release[0]._id
        })

    }
    render() {
        let { release } = this.props;
        let { selected } = this.state;
        return (
            <div className="header" >
                <span className="version">
                   版本
                </span>
                <Select
                    placeholder="版本"
                    value={selected}
                    defaultValue={selected}
                    optionLabelProp="children"
                    style={{ width: 100 }}
                    animation="slide-up"
                    showSearch={false}
                    onChange={this.onChange}>
                    {
                        release.map((item, index) => <Option key={`release${index}`} value={item._id}>{item.area_name}</Option>)
                    }
                </Select>

                <button className="saveBtn" onClick={this.props.saveLesson}>
                    保存
                </button>
            </div>
        )
    }


}

function mapStateToProps(state) {
    return {
        release: state.release
    }
}
function mapDispatchToProps(dispatch) {
    return {
        saveLesson: () => dispatch(saveLesson())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Release)