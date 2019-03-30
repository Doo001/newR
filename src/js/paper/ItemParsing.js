import React from 'react';
import PropTypes  from 'prop-types'
import {Edu, Q} from "js/quantum";
import {getSubject} from "js/subjects";
import {HtmlWithTex} from 'js/widgets/html_with_tex';
import {EduDesc} from "js/quantum";
import {ItemClassDesc} from "js/subjects";
import "css/itemParsing.scss"
import FormulaKit from './formulaKit'
import Select, {Option, OptGroup} from 'rc-select';

export class ItemTypeSwitcher extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            value: this.props.type,
            edu: this.props.edu
        };
        this.ItemClassDescs = ItemClassDesc.allForEduTestType(this.props.edu,this.props.type)
        if (this.props.showAll) {
            this.ItemClassDescs.unshift({
                type: getSubject().id * 1000,
                name: '所有'
            })
        }
    }
	componentWillReceiveProps(nextProps) {
        if (nextProps.edu !== this.props.edu) {
            this.ItemClassDescs = ItemClassDesc.allForEduTestType(nextProps.edu,nextProps.type)
            if (this.props.showAll) {
                this.ItemClassDescs.unshift({
                    type: getSubject().id * 1000,
                    name: '所有'
                })
            }
            this.setState({value: nextProps.type});
        }
    }

    handleClick=(value) =>{

    	this.setState({
            value
        })
    	if (value === this.props.type) {
            return;
        }
        this.props.onTypeChanged(value);
    }
    

    render() {

        return (
            <Col xs>
                <label style={{'marginRight': '10px'}}>题型</label>
                <Select style={{ width: "70%" }} onChange={this.handleClick} showSearch={false} optionLabelProp="children" value={this.state.value}>
                    {

                        this.ItemClassDescs.map((item, index) => (<Option key={item.type} value={item.type}>{item.name}</Option>))
                    }
                </Select>
            </Col>
        );

    }
}


export class ItemClassSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.classes = [];
        this.state = {
            value: this.props.showAll? 0: ''
        };

    }

    componentDidMount() {
        Q.get('/general/getDict', { query: {type: 6}})
            .done(data => {
                this.classes = data;
                if (this.props.showAll) {
                    this.classes.unshift({
                        code: 0,
                        name: '所有'
                    })
                }
                this.setState({
                    value: data[0].code
                })
            })
    }
    handleClick=(value) =>{
    	this.setState({
            value
    	})
    }
    
    render() {
	        return (
                <Col xs>
                    <label style={{'marginRight': '10px'}}>来源</label>
                    <Select style={{ width: "70%" }} onChange={this.handleClick} showSearch={false} optionLabelProp="children" value={this.state.value}>
                        {

                            this.classes.map((item, index) => (<Option key={`type${index}${item.code}`} value={item.code}>{item.name}</Option>))
                        }
                    </Select>
                </Col>
	        );
    	}
}
export class EduSwitcher extends React.Component {
	constructor(props){
        super(props);
        this.edus = EduDesc.kAll;
   	}
   	state = {
        edu2:this.props.edu
    }

    handleClick=(value)=> {
    	this.setState({
    		edu2:value
    	})
        this.props.onEduChanged(+value);
    }

    render() {
        return (
            <Col xs>
                <label style={{'marginRight': '10px'}}>学段</label>
                <Select style={{ width: "70%" }} onChange={this.handleClick} showSearch={false} optionLabelProp="children" value={this.state.edu2}>
                    {
                        this.edus.map((item, index) => (<Option key={`year${index}`} value={item.edu}>{item.name}</Option>))
                    }
                </Select>
            </Col>
        );
    }

}

export class YearSwitch extends React.Component {
    constructor(props) {
        super(props)
        this.years = []
        for(let i= new Date().getFullYear(); i > 2000; i--) {
            this.years.push({
                name:i,
                val:i
            })
        }
        this.years.unshift({ name: '所有年份', val: 0})
    }
    state = {
        year: this.props.year === undefined ? 0: this.props.year
    }
    changeYear = value => {
        this.setState({
            year: value
        }, () => {
            this.props.yearChange(value)
        })
    }
    render() {
        let { year } = this.state;
        return (
            <Col xs>
                <label style={{'marginRight': '10px'}}>年份</label>
                <Select style={{ width: "70%" }} onChange={this.changeYear} showSearch={false} optionLabelProp="children" value={year}>
                    {
                        this.years.map((item, index) => (<Option key={`year${index}`} value={item.val}>{item.name}</Option>))
                    }
                </Select>
            </Col>
        );
    }

}

export class AreaSelected extends React.Component {
    constructor(props) {
        super(props)
        this.provinces = {};
    }
    state = {
        province: '',
        city: ''
    }
    componentDidMount() {
        Q.get('/general/getCity')
            .done(data => {
                data.forEach(val => {
                    this.provinces[val.province_name] = val.city
                })
                this.forceUpdate()
            })
    }
    changeProvince = (value) => {
        this.setState({
            province: value,
            city: ''
        }, () => {
            this.props.onFilterChange(this.state)
        })
    }
    changeCity = value => {
        this.setState({
            city: value
        }, () => {
            this.props.onFilterChange(this.state)
        })
    }
    render() {
        let { province, city } = this.state;
        let provinceOpt = [];
        for (let key in this.provinces) {
            provinceOpt.push(<Option key={key} value={key}>{key}</Option>)
        }

        let cityOpt = province ? this.provinces[province].map((item, index) => (<Option key={`city${index}`} value={item.city_name}>{item.city_name}</Option>)): []

        if (this.props.showAll) {
            cityOpt.unshift(<Option key={'cityall'} value=''>所有</Option>)
            provinceOpt.unshift(<Option key={'provinceall'} value=''>所有</Option>)
        }
        return (
            <Row>
                {
                    this.props.hiddenYear? null:  <YearSwitch yearChange={this.props.yearChange}/>
                }

                <Col xs>
                    <label style={{'marginRight': '10px'}}>省份</label>
                    <Select style={{ width: "70%" }} onChange={this.changeProvince} showSearch={false} optionLabelProp="children" value={province}>
                        {
                            provinceOpt
                        }
                    </Select>
                </Col>
                <Col xs>
                    <label style={{'marginRight': '10px'}}>城市</label>
                    <Select style={{ width: "70%" }} onChange={this.changeCity} showSearch={false} optionLabelProp="children" value={city}>
                        {
                            cityOpt
                        }
                    </Select>
                </Col>
            </Row>
        )
    }
}

export default class ItemParsing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewHtml: '',
            parseResult: null,
            eduYuanLai: Edu.kDefault,
			edu:this.props.edu||Global.user.edu,
            type: getSubject().getItemTypeDescs(Edu.kDefault)[0].type,
            idarr:[],
            itemID:'',
            year: [0]
        };
        this._resultStatusTimer = null;
        this.gGoodToLeave = true;
    }
    

    parseInput() {
        const json = {
            action: 'parse',
            data: this._getRawData(),
        };
        if (!json.data) {
            return;
        }

        Q.post('/api/item', {json, defaultFail: false})
            .done((item) => {
                this.setState({previewHtml: item, parseResult: true});
                if (this._resultStatusTimer !== null) {
                    clearTimeout(this._resultStatusTimer);
                }
                this._resultStatusTimer = setTimeout(this.handleParseStatusTimeout.bind(this), 1000);
            })
            .fail((jqXHR, statusText, errorThrown) => {
                const error = Q.jsonedError(jqXHR, statusText, errorThrown);
                this.setState({previewHtml: error.message});
            })
        ;
        document.getElementById('tilLeft').style.display='none';
    }

    nextStep() {
        const json = {
            action: 'save',
            data: this._getRawData(),
        };
        if (!json.data) {
            return;
        }

        Q.post('/api/item', {json, defaultFail: false})
        // should goto typesetting or some other page
            .done((item) => {
                window.gGoodToLeave = true;
                if (this.props.saveCallback) {
                    this.props.saveCallback(item);
                } else {
                    location.href = `/item/${item}/typeset`;
                }
            })
            .fail((jqXHR, statusText, errorThrown) => {
                const error = Q.jsonedError(jqXHR, statusText, errorThrown);
                this.setState({previewHtml: error.message});
            })
        ;
    }
    
    save = ()=>{
    	const json = {
            action: 'save',
            data: this._getRawData(),
        };
        if (!json.data) {
            return; 
        }
        
    	Q.post('/api/item', { json, defaultFail: false })
	    .done((item) => {
            $('.close').trigger('click')
	        if (this.props.saveCallback) {
                this.props.saveCallback(item);
                return ;
            }
            window.gGoodToLeave = true;

            let Idarr=[];
            Idarr.push(item);
            this.setState({
            	idarr:Idarr 
            },()=>{
            	if(this.props.idGoFather){
            		this.props.idGoFather(this.state.idarr);
            	} else {
                    location.href = `/item/${item}/typeset`;
                }
            })
        })
	    .fail((jqXHR, statusText, errorThrown) => {
			console.log('后台错误：'+errorThrown)
        })
    }

    setGoodToLeave = (bool) => {
        this.gGoodToLeave = bool;
    }

    _getRawData() {
        const data = {edu: this.state.edu, type: this.state.type, year: this.state.year, province: this.state.province, city: this.state.city};
        const keys = ['class_'];
        if (!this.props.isPaper) {
            keys.forEach((key) => {
                data[key] = this.refs[key].state.value || 0;
            });
            data.classes = [data.class_];
            delete data.class_;
        } else {
            data.classes = [];
        }


        Object.assign(data, this.refs.inputZone.getData());

        return data;
    }

    handleParseStatusTimeout() {
        this._resultStatusTimer = null;
        this.setState({parseResult: null});
    }

    handleEduChange(newEdu) {
        if (newEdu === this.state.edu) {
            return;
        }
        this.setState({
            edu: newEdu,
            type: getSubject().getItemTypeDescs(newEdu)[0].type,
        });
    }
    yearChange = year => {
        this.state.year = [year]
    }
    changeArea = state => {
        this.state.city = [state.city]
        this.state.province = [state.province]
    }
    _renderInputZone() {

    }

    render() {
        let parseStatus = '';
        let { isPaper } = this.props;
        if (this.state.parseResult === true) {
            parseStatus = <span className="glyphicon glyphicon-ok"/>;
        }
        return (
            <div id="item-parsing">
                <div className="item-preview-pane" >
                	<p className="tilLeft" id="tilLeft">请在右侧输入题目内容并解析</p>
                    <HtmlWithTex html={this.state.previewHtml} ref="preview"/>
                </div>
                <div className="item-input-pane form-horizontal">
                    <div style={{"width": "100%","backgroundColor":"white","padding": "10px 0"}}>
                        <Row style={{"marginBottom": "10px"}}>
                            {
                                !isPaper? <EduSwitcher
                                    edu={this.state.edu}
                                    onEduChanged={this.handleEduChange.bind(this)} ref="edu"
                                />:null
                            }

                            <ItemTypeSwitcher
                                ref="type" type={this.state.type}
                                onTypeChanged={type => this.setState({type})}
                                edu={this.state.edu}
                            />
                            {
                                !isPaper? <ItemClassSwitcher edu2={this.props.edu} edu={this.state.edu} eduYL={this.state.eduYuanLai} ref="class_"/>: null
                            }

                        </Row>
                        {
                            !isPaper? <AreaSelected onFilterChange={this.changeArea} yearChange = {this.yearChange}/>: null
                        }

                    </div>

                    {this._renderInputZone()}
                    <div className="op-zone parsing-op-zone">
                        <button
                            className="btn btn-default jieXi btbCommon" data-action="parse"
                            onClick={this.parseInput.bind(this)}
                        > 解析 {parseStatus}
                        </button>
                        <button className="btn btn-default  savebtb btbCommon" id="saveSengle"  onClick={this.save.bind(this)}>
                            保存
                        </button>
                        
                    </div>
                    <div>
                        <p className="parsing-note">
                            
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}
ItemClassDesc.propTypes = {
    isPaper: PropTypes.bool // 试卷页面只显示题型
}