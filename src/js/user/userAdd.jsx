import React from 'react';
import { setCurrentNav, UserRole, UserModule, UserPermission } from './common';
import { Row, Col } from 'react-flexbox-grid'
import axios from 'js/utils/api';
import { showAlert } from 'js/widgets/alert';
import Select, {Option, OptGroup} from 'rc-select';
import 'rc-select/assets/index.css';


export class UserAdd extends React.Component {
	state={
		markLisk:[],
		res:{},
		emailV:"",
		eduGrade:[],
		roleArr:[],
		selVal:"请选择身份",
		selCode:20,
		eduArr:[],
		eduNow:[],
		eduData:[],
		proArr:[],
		proNow:[],
		proData:[],
		schArr:[],
		schArrConst:[],
		schNow:[],
		schData:[],
		mouArr:[],
		mouNow:[],
		mouData:[],
		
		itemArr:[],
		paperArr:[],
		palnArr:[],
		mapArr:[],
		userArr:[],
		allTrue:[],
		
	}
	
	componentDidMount() {
		setCurrentNav('添加');
		let userId=this.props.params.id;
		//身份字典	
    	axios.get(`/author/dict/role`)
 		.then(res => {
 			this.setState({
 				roleArr:res
 			})
        })
    	.catch((err)=>{
    		console.log(err)
    	});	
    	//初高中字典	
    	axios.get(`/author/dict/grade`)
 		.then(res => {
 			res.map(v=>{
 				v.flag=false;
 				return v
 			})
 			this.setState({
 				eduArr:res,
 			})
        })
    	.catch((err)=>{
    		console.log(err)
    	});	
	    //个性化字典
	    axios.get(`/author/dict/project `)
     		.then(res => {
     			res.map(v=>{
	 				v.flag=false;
	 				return v
	 			})
	 			this.setState({
	 				proArr:res,
	 			})
	        })
	    	.catch((err)=>{
	    		console.log(err)
	    	});
	    //学校字典
	    axios.get(`/author/dict/school `)
     		.then(res => {
     			res.map(v=>{
	 				v.flag=false;
	 				return v
	 			})
	 			this.setState({
	 				schArr:res,
	 				schArrConst:res,
	 			})
	        })
	    	.catch((err)=>{
	    		console.log(err)
	    	});
	    	
	    //权限字典
	    axios.get(`/author/dict/moudel `)
     		.then(res => {
     			res.map(v=>{
	 				v.flag=false;
	 				return v
	 			})
     			let itemArr=[],paperArr=[],palnArr=[],mapArr=[],userArr=[]
     			
     			res.map(v=>{
     				if(v.code>10&&v.code<20){
     					//题目
     					itemArr.push(v)
     				}else if(v.code>20&&v.code<30){
     					//试卷
     					paperArr.push(v)
     				}else if(v.code>30&&v.code<40){
     					//教案
     					palnArr.push(v)
     				}else if(v.code>40&&v.code<50){
     					//图谱
     					mapArr.push(v)
     				}else{
     					//用户
     					userArr.push(v)
     				}
     			})
	 			this.setState({itemArr,paperArr,palnArr,mapArr,userArr,mouArr:res})
	        })
	    	.catch((err)=>{
	    		console.log(err)
	    	});
	    
		//获取用户信息
		if(userId){
			axios.get(`/author/user/${userId}`)
     		.then(res => {
     			this.state.roleArr.map(v=>{
     				if(res.role==v.value){
     					this.setState({
     						selCode:v.code
     					})
     				}
     			})
     			this.setState({
     				res:res,
     				emailV:res.email,
     				selVal:res.role,
     				eduNow:res.grades,
     				eduData:res.grades,
     				proNow:res.projects,
     				proData:res.projects,
     				schNow:res.schools,
     				schData:res.schools,
     				mouNow:res.moudelList,
     				mouData:res.moudelList,
     			},()=>{
     				console.log(this.state.selVal, this.state.selCode)
     				//学段
     				let eduNewArr=this.state.eduArr;
     				eduNewArr.map(v=>{
     					let eduNew=this.state.eduNow.some(n=>n.code==v.code)
     					if(eduNew){
     						v.flag=true;
     					}
     				})
     				//个性化
     				let proNewArr=this.state.proArr;
     				proNewArr.map(v=>{
     					let proNew=this.state.proNow.some(n=>n.code==v.code)
     					if(proNew){
     						v.flag=true;
     					}
     				})
     				//学校
     				let schNewArr=this.state.schArr;
     				schNewArr.map(v=>{
     					let schNew=this.state.schNow.some(n=>n.code==v.code)
     					if(schNew){
     						v.flag=true;
     					}
     				})
     				//权限
     				let mouNewArr=this.state.mouArr;
     				mouNewArr.map(v=>{
     					let mouNew=this.state.mouNow.some(n=>n.code==v.code)
     					if(mouNew){
     						v.flag=true;
     					}
     				})
     				
     				this.setState({
     					eduArr:eduNewArr,
     					proArr:proNewArr,
     					schArr:schNewArr,
     					mouArr:mouNewArr
     				},()=>{
     					eduNewArr=[];proNewArr=[];schNewArr=[];mouNewArr=[];
     				})
     			})
	        })
	    	.catch((err)=>{
	    		console.log(err)
	    	});
		}
	}
	//=======================================================================
	//改身份	
	pageFn =(value,option:arrRole)=>{
   		this.setState({
   			selVal:value,
   			selCode:option.key,
   		})
	}
	
	//改初高中
	eduFn=(edu)=>{
		let arr=this.state.eduArr;
		arr.map(v=>{
			if(v.code==edu){
				v.flag=!v.flag
				return v;
			}
		})
		this.setState({
			eduArr:arr,
			eduData:arr.filter(v=>v.flag==true),
		})
	}
	//改个性化
	proFn=(id)=>{
		let arr=this.state.proArr;
		arr.map(v=>{
			if(v.code==id){
				v.flag=!v.flag
				return v;
			}
		})
		this.setState({
			proArr:arr,
			proData:arr.filter(v=>v.flag==true)
		})
	}
	//改学校
	checkFn=(id)=>{
		let arr=this.state.schArr;
		arr.map(v=>{
			if(v.code==id){
				v.flag=!v.flag
				return v;
			}
		})
		this.setState({
			schArr:arr,
			schData:this.state.schArrConst.filter(v=>v.flag==true)
		})
	}
	//全选
	checkAll=()=>{
		let arrSh=this.state.schArr;
		let num=arrSh.filter(v=>v.flag==false).length;
		
		if(num>0){
			arrSh.map(v=>{
				v.flag=true;
			})
			this.setState({
				schArr:arrSh,
				schData:this.state.schArrConst.map(v=>{
					v.flag=true;
					return v
				})
			},()=>{
				console.log( this.state.schData )
			})
		}else{
			arrSh.map(v=>{
				v.flag=false;
			})
			this.state.schArrConst.map(v=>v.flag=false)
			this.setState({
				schArr:arrSh,
				schData:[]
			},()=>{
				console.log( this.state.schData )
			})
		}
	}
	
	//字母过滤
	choose=(word)=>{
		let arr=this.state.schArrConst;
		let wordArr=arr.filter(v=>v.pinyin!=null? v.pinyin.substr(0,1)==word.toLowerCase():null )
		this.setState({
			schArr:wordArr
		})
	}
	//全部
	chooseAll=()=>{
		this.setState({
			schArr:this.state.schArrConst
		})
	}
	
	//改邮箱
	emailFn=(ev)=>{
		this.setState({
			emailV:ev.target.value,
		})
	}
	//改权限
	permissionFn=(arr,arrName)=>{
		let num=arr.filter(v=>v.flag==false).length;
		if(num>0){
			arr.map(v=>{
				v.flag=true;
			})
			this.setState({
				arrName:arr,
				mouData:this.state.mouArr.filter(v=>v.flag==true),
			},()=>{console.log(this.state.mouData)})
		}else{
			arr.map(v=>{
				v.flag=false;
			})
			this.setState({
				mouData:this.state.mouArr.filter(v=>v.flag==true),
				arrName:arr,
			},()=>{
				console.log(this.state.mouData)
			})
		}
	}
	//改权限 Alone
	perAloneFn=(id,arr,arrNme)=>{
		arr.map(v=>{
			if(v.code==id){
				v.flag=!v.flag
			}
			return v;
		})
		this.setState({
			arrNme:arr,
			mouData:this.state.mouArr.filter(v=>v.flag==true)
		})
		
	}
	
	cancel=()=>{
		history.go(-1)
	}

	sureSave=()=>{
		if(!this.state.emailV){
			showAlert('请输入邮箱','danger')
			return;
		}else{
			console.log(this.state.emailV)
			let	q reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
			if(!reg.test( this.state.emailV )){
				showAlert('邮箱格式不正确','danger')
				return;
			}
		}
		if(!this.state.role){
			showAlert('请选择身份','danger')
			return;
		}
		if(!this.state.eduData){
			showAlert('请选择学段','danger')
			return;
		}
		if(!this.state.proData){
			showAlert('请选择项目','danger')
			return;
		}
		if(!this.state.schData){
			showAlert('请选择学校','danger')
			return;
		}
		if(!this.state.mouData){
			showAlert('请选择权限','danger')
			return;
		}
		
		let graArrCode=[],proArrCode=[],schArrCode=[],mouArrCode=[]
		let data_gra=this.state.eduData.map(v=>graArrCode.push(v.code))
		let data_pro=this.state.proData.map(v=>proArrCode.push(v.code))
		let data_sch=this.state.schData.map(v=>schArrCode.push(v.code))
		let data_mou=this.state.mouData.map(v=>mouArrCode.push(v.code))
		
		axios.post(`/author/saveUser`,{
			id:this.props.params.id||"",
			email:this.state.emailV,
			role:this.state.selCode,
			state: +this.props.params.state,
			grades:data_gra,
			projects:data_pro,
			schools:data_sch,
			moudels:data_mou,
		})
 		.then(res => {
 			graArrCode=[],proArrCode=[],schArrCode=[],mouArrCode=[]
 			console.log(res)
        })
    	.catch((err)=>{
    		graArrCode=[],proArrCode=[],schArrCode=[],mouArrCode=[]
    		console.log(err)
    	});	
	}
	
	render() {
		let arrRole=this.state.roleArr;
		return(
		<Row center="xs">
			<Col xs={8} className="userBox">
				<Row className="emailRow RowAlone">
					<Col xs={1} className="til">邮箱</Col>
					<Col xs={11}><input type="text" className="nameInput" value={this.state.emailV} onChange={this.emailFn}/></Col>
				</Row>
				<Row start="xs" className="roleRow RowAlone">
					<Col xs={1} className="til">身份</Col>
					<Col xs={11} start="xs">
						<Select
							placeholder="请选择身份"
							showSearch={false}
                            value={this.state.selVal}
                           	id="my-select"
                            style={{ width: 120 }}
                            optionLabelProp="children"
                            optionFilterProp="text"
                            onChange={this.pageFn}
                            backfill
                        >
                           {arrRole.map(v=>(<Option key={v.code} value={v.value}>{v.value}</Option>))}
                       </Select>
					</Col>
				</Row>
				<Row start="xs" className="eduRow RowAloneBtn">
					<Col xs={1} className="til">
						<p className="tilName">学段</p>
						<p className="tilDeatil">(可多选)</p>
					</Col>
					<Col xs={11}>
						{this.state.eduArr.map(v=><button style={{ background: v.flag?"#FFEDB2":"transparent" }} name="eduArr" onClick={()=>this.eduFn(v.code)} key={v.code}>{v.value}</button> )}
					</Col>
				</Row>
				<Row start="xs" className="projectRow RowAloneBtn">
					<Col xs={1} className="til">
						<p className="tilName">项目</p>
						<p className="tilDeatil">(可多选)</p>
					</Col>
					<Col xs={11}>
						{this.state.proArr.map(v=><button style={{ background: v.flag?"#FFEDB2":"transparent" }} onClick={()=>this.proFn(v.code)} key={v.code}>{v.value}</button> )}
					</Col>
				</Row>
				
				<Row start="xs" className="schoolRow">
					<Col xs={1} className="til">所属学校</Col>
					<Col xs={11}>
						<p className="wordFilter">
							<em onClick={()=>this.choose('A')}>A</em><em onClick={()=>this.choose('B')}>B</em><em onClick={()=>this.choose('C')}>C</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('D')}>D</em>
							<em onClick={()=>this.choose('E')}>E</em><em onClick={()=>this.choose('F')}>F</em><em onClick={()=>this.choose('G')}>G</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('H')}>H</em>
							<em onClick={()=>this.choose('I')}>I</em><em onClick={()=>this.choose('J')}>J</em><em onClick={()=>this.choose('K')}>K</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('L')}>L</em>
							<em onClick={()=>this.choose('M')}>M</em><em onClick={()=>this.choose('N')}>N</em><em onClick={()=>this.choose('O')}>O</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('P')}>P</em>
							<em onClick={()=>this.choose('Q')}>Q</em><em onClick={()=>this.choose('R')}>R</em><em onClick={()=>this.choose('S')}>S</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('T')}>T</em>
							<em onClick={()=>this.choose('U')}>U</em><em onClick={()=>this.choose('V')}>V</em><em onClick={()=>this.choose('W')}>W</em><em style={{marginRight:'8px'}} onClick={()=>this.choose('X')}>X</em>
							<em onClick={()=>this.choose('Y')}>Y</em><em onClick={()=>this.choose('Z')}>Z</em>
							<em style={{ marginLeft:'15px' }} onClick={this.chooseAll}>全部</em>							
							<span onClick={this.checkAll}>全选</span></p>
						<Row className="schoolBox"  start="xs" start="sm" start="md">
							{ this.state.schArr.length?'': <p className="tilNone">暂无匹配中的学校</p>}
							{this.state.schArr.map((v,i)=>
									<Col xs={4} sm={4} md={4}>
										<label htmlFor={v.code}><input type="checkbox" id={v.code} checked={v.flag} onChange={()=>this.checkFn(v.code)}/>{v.value}</label>
									</Col>
							)}
						</Row>
					</Col>
				</Row>
				
				<Row start="xs" start="sm" start="md" className="permissionRow">
					<Col xs={1} className="til">权限</Col>
					<Col xs={11} className="cont">
						<Row start="xs" start="sm" start="md">
							<Col xs={2} sm={2} md={2}>
								<label htmlFor="timu"><input id='timu' checked={this.state.itemArr.filter(v=>v.flag==false).length==0} onChange={()=>this.permissionFn(this.state.itemArr,'itemArr')} type="checkbox"/>题目管理</label>
								{this.state.itemArr.map((v,i)=><label htmlFor={v.code+1000}><input onChange={()=>this.perAloneFn(v.code,this.state.itemArr,'itemArr')} type="checkbox" id={v.code+1000} checked={v.flag}/>{v.value}</label>)}
							</Col>
							<Col xs={2} sm={2} md={2}>
								<label htmlFor="shijuan"><input checked={this.state.paperArr.filter(v=>v.flag==false).length==0} id='shijuan' onChange={()=>this.permissionFn(this.state.paperArr)} type="checkbox"/>试卷管理</label>
								{this.state.paperArr.map((v,i)=><label htmlFor={v.code+1000}><input onChange={()=>this.perAloneFn(v.code,this.state.paperArr,'paperArr')} type="checkbox" id={v.code+1000} checked={v.flag}/>{v.value}</label>)}
							</Col>
							<Col xs={2} sm={2} md={2}>
								<label htmlFor="jiaoan"><input checked={this.state.palnArr.filter(v=>v.flag==false).length==0} id='jiaoan'  onChange={()=>this.permissionFn(this.state.palnArr)} type="checkbox"/>教案管理</label>
								{this.state.palnArr.map((v,i)=><label htmlFor={v.code+1000}><input onChange={()=>this.perAloneFn(v.code,this.state.palnArr,'palnArr')} type="checkbox" id={v.code+1000} checked={v.flag}/>{v.value}</label>)}
							</Col>
							<Col xs={2} sm={2} md={2}>
								<label htmlFor="tupu"><input checked={this.state.mapArr.filter(v=>v.flag==false).length==0} id='tupu'  onChange={()=>this.permissionFn(this.state.mapArr)} type="checkbox"/>图谱管理</label>
								{this.state.mapArr.map((v,i)=><label htmlFor={v.code+1000}><input onChange={()=>this.perAloneFn(v.code,this.state.mapArr,'mapArr')} type="checkbox" id={v.code+1000} checked={v.flag}/>{v.value}</label>)}
								
							</Col>
							<Col xs={2} sm={2} md={2}>
								<label htmlFor="yonghu"><input checked={this.state.userArr.filter(v=>v.flag==false).length==0} id='yonghu' onChange={()=>this.permissionFn(this.state.userArr)} type="checkbox"/>用户管理</label>
								{this.state.userArr.map((v,i)=><label htmlFor={v.code+1000}><input onChange={()=>this.perAloneFn(v.code,this.state.userArr,'userArr')} type="checkbox" id={v.code+1000} checked={v.flag}/>{v.value}</label>)}
							</Col>
						</Row>
						
					</Col>
				</Row>
				
				<div className="btnRow">
					<div className="centerBtn">
						<button className="sureBtn" onClick={this.sureSave}>确定</button>
						<button className="cancelBtn" onClick={this.cancel}>取消</button>
					</div>
				</div>
				
			</Col>
			<div className="bottomL">
				<p className="til">&copy; 2018 优能中学教育</p>
				<p className="detail1">(Release: dev, Git Version: 278f7e22)</p>
				<p className="detail2">建议您使用360、Google Chrome，分辨率1280*800及以上浏览本网站，获得更好用户体验</p>
			</div>
		</Row>)
	}
}


