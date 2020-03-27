import './Layout.css';
import React, { Component, Fragment } from 'react';
import Header from './Header';
import Content from './Content';
import { test, getKSHChart, delOneLayer,editOneLayer,getShareById,editKSHChartPosition,editKSHChartData,editLayerSortNum,editLayerSortTopOrBottom,delOneOtherLayer,getSpecify,editOneOtherLayer,getBgIndex,getOtherLayer,addOneOtherLayer} from '../api/api';
import LeftComponentList from './leftComponents/LeftComponentList';
import Config from './Config';
import DeleteItemModal from './ModelCom/DeleteItemModal';
import EditItemModal from './ModelCom/EditItemModal';
import ShareItemModal from './ModelCom/ShareItemModal';
import ContentBottom from './content/ContentBottom';
import $ from 'jquery';
import store from '../redux/store';
import { chartOption,showChartsOption} from '../utils/chart';
import { notification, Modal, Button } from 'antd';
import { selectGetOneMainLayer, addMainLayer, selectPostOneMainLayer } from '../api/apiAxios';
import {
  updateShowLayerFieldVal,
  replaceShowLayerFieldVal,
  replaceAllShowLayerFieldVal,
  delCptOptionsList,
  editCptOptionsList,
  saveShowPageData,
  replaceGlobalBg,
  replaceOptionsList,
} from '../redux/actions/showLayerDatas';
import { Redirect } from 'react-router-dom';

import PageSetting from '../style-config/page-setting/PageSetting';

const chartData = require('../datasource/chartDatas.json');

class Layout extends Component {
  constructor(props) {
    super(props);
    // window.parent.document.getElementById("dataShow").topicEditor("",0);
    console.log(window);
    this.state = {
      cptIndex: -1, //当前选中的组件
      cptType: '', //当前组件的类型
      cptKey: '', //当前组件对应的时间戳的值
      cptKeyList: [], //保存每个组件的基本信息,用来显示组件的先后顺序
      cptPropertyList: [], //所有组件基本属性的数组
      cptChartIdList: [], //保存所有前图层对应的接口的id值和cttype
      cptPropertyObj: store.getState().showLayerDatas.showDatas, //当前点击的图层的基本属性
      globalBg: {
          bgColor: 'rgba(15, 42, 67,1)',
          bjWidth: 1470,
          bjHeight: 937,
          bgImageName:"none",
          bgImageIntegerUrl:"",
          mainKey:-1
      }, //中间dom的属性
      nameData:{},//保存当前页面的基本信息
      shareId:1,//当前页面需要的shareid
      kshId:1,//当前的kshId
      scale:1,//当前内容的缩放比例
    };
  }
  componentDidMount() {
    this.initLeftDatas2();
    window['initEditPage'] = () => {
      this.initLeftDatas2();
    }
  }

    initLeftDatas(){
      let tempTestData = {
        "username":"public",
        "data":[{
          "id": 4,
          "parentid": 2,
          "name": "断裂分布图",
          "type": "THEMEVERTBAR_SORT",
          "service": "KSH",
          "layername": "test",
          "renderer": null,
          "thType": "0",
          "type2": null,
          "desp": "",
          "isText": null,
          "showType": null,
          "realtimeupdate": null,
          "serialize": "{\"col\":1,\"row\":5,\"size_x\":2,\"size_y\":2}",
          "show": null,
          "layerPosition":'{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"bg","cptType":""}'
      }, {
          "id": 0,
          "parentid": 2,
          "name": "水污染",
          "type": null,
          "service": "KSH",
          "layername": "testV4_水污染",
          "renderer": "<GROUPRENDERER><SIMPLERENDERER name=\"一般点样式\" minscale=\"1e-20\" maxscale=\"100000000000000000000\"><GROUPRENDERER  styleName=\"circle\" fuhaokuName=\"基础符号库\"><SIMPLEMARKERSYMBOL antialiasing=\"true\" color=\"102,255,43\" overlap=\"true\" shadow=\"0,0,0\" transparency=\"1.0\" type=\"circle\" outline=\"102,255,43\" usecentroid=\"true\" width=\"3\"></SIMPLEMARKERSYMBOL></GROUPRENDERER></SIMPLERENDERER></GROUPRENDERER>",
          "thType": "1",
          "type2": null,
          "desp": "",
          "isText": null,
          "showType": null,
          "realtimeupdate": "false",
          "serialize": "{\"col\":1,\"row\":1,\"size_x\":3,\"size_y\":2}",
          "show": "1",
          "layerPosition":'{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"bg","cptType":""}'
      }, {
          "id": 0,
          "parentid": 2,
          "name": "泥石流沟",
          "type": null,
          "service": "CCC",
          "layername": "泥石流沟",
          "renderer": "<GROUPRENDERER><SIMPLERENDERER name=\"一般点样式\" minscale=\"1e-20\" maxscale=\"100000000000000000000\"><GROUPRENDERER  styleName=\"square\" fuhaokuName=\"基础符号库\"><SIMPLEMARKERSYMBOL antialiasing=\"true\" color=\"204,255,43\" overlap=\"true\" shadow=\"0,0,0\" transparency=\"1.0\" type=\"square\" outline=\"204,255,43\" usecentroid=\"true\" width=\"3\"></SIMPLEMARKERSYMBOL></GROUPRENDERER></SIMPLERENDERER></GROUPRENDERER>",
          "thType": "1",
          "type2": null,
          "desp": "",
          "isText": null,
          "showType": null,
          "realtimeupdate": "false",
          "serialize": "{\"col\":4,\"row\":1,\"size_x\":2,\"size_y\":2}",
          "show": "1",
          "layerPosition":'{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"bg","cptType":""}'
      }]
      }
      let resultObj = {
          "username": "public",
          "data": '[{"id":4,"parentid":2,"name":"断裂分布图","type":"THEMEVERTBAR_SORT","service":"KSH","layername":"test","renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":"{\"col\":1,\"row\":5,\"size_x\":2,\"size_y\":2}","show":null},{"id":0,"parentid":2,"name":"水污染","type":null,"service":"KSH","layername":"testV4_水污染","renderer":"<GROUPRENDERER><SIMPLERENDERER name=\"一般点样式\" minscale=\"1e-20\" maxscale=\"100000000000000000000\"><GROUPRENDERER  styleName=\"circle\" fuhaokuName=\"基础符号库\"><SIMPLEMARKERSYMBOL antialiasing=\"true\" color=\"102,255,43\" overlap=\"true\" shadow=\"0,0,0\" transparency=\"1.0\" type=\"circle\" outline=\"102,255,43\" usecentroid=\"true\" width=\"3\"></SIMPLEMARKERSYMBOL></GROUPRENDERER></SIMPLERENDERER></GROUPRENDERER>","thType":"1","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":"false","serialize":"{\"col\":1,\"row\":1,\"size_x\":3,\"size_y\":2}","show":"1"},{"id":0,"parentid":2,"name":"泥石流沟","type":null,"service":"CCC","layername":"泥石流沟","renderer":"<GROUPRENDERER><SIMPLERENDERER name=\"一般点样式\" minscale=\"1e-20\" maxscale=\"100000000000000000000\"><GROUPRENDERER  styleName=\"square\" fuhaokuName=\"基础符号库\"><SIMPLEMARKERSYMBOL antialiasing=\"true\" color=\"204,255,43\" overlap=\"true\" shadow=\"0,0,0\" transparency=\"1.0\" type=\"square\" outline=\"204,255,43\" usecentroid=\"true\" width=\"3\"></SIMPLEMARKERSYMBOL></GROUPRENDERER></SIMPLERENDERER></GROUPRENDERER>","thType":"1","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":"false","serialize":"{\"col\":4,\"row\":1,\"size_x\":2,\"size_y\":2}","show":"1"}]'
      }
      // let showObjArr = JSON.parse(resultObj.data);
      let tempCptKeyList = [];
      let tempCptPropertyList = [];
      let tempCptChartIdList = [];
      let timeKey = new Date().getTime().toString();  
      tempTestData.data.map((item,index) => {
        timeKey++;
        tempCptKeyList.push({ key: timeKey, id: item.name, title: item.layername,layerType:item.thType,simpleType:''});
        tempCptPropertyList.push(JSON.parse(item.layerPosition));
        tempCptChartIdList.push({
            chartId:item.id,
            thType:item.thType,
            timeKey:timeKey
        });   
      })
      this.setState({
          cptIndex: -1,
          cptType: '',
          cptKey: '',
          cptKeyList: tempCptKeyList,
          cptPropertyList:tempCptPropertyList,
          userName:tempTestData.username,
          cptPropertyObj: { 
              type: 'bg',//具体的类型：    text chart border
              cptType: ''
          },
          cptChartIdList:tempCptChartIdList
      }, () => {
          {   
            showChartsOption(tempCptChartIdList);
          }
      });

    }
    /**
     * @description: 加载默认所需的数据
     * @param {type} 
     * @return: 
     */
    initLeftDatas2(){
        let _this = this;
        var shareId = 1;
        let shareIdVal = window.parent.document.getElementById('shareID');
        if(shareIdVal){
          shareId = shareIdVal.value;
        }
        let kshId = 1;
        let kshIdObj = window.parent.document.getElementById('kshID');
        kshIdObj?kshId=kshIdObj.value:kshId=1;
        this.setState({
          shareId:shareId,
          kshId:kshId
        },() => {
          getBgIndex({
            "shareid" : shareId
          })
          .then(result => {
              if(result.n <= 0){
                  let bgObj = {
                    name: 'bg',
                    type: 'bg',
                    tabid: 0,
                    shareid: shareId,
                    json:  JSON.stringify({
                        bgColor: 'rgba(15, 42, 67,1)',
                        bjWidth: 1470,
                        bjHeight: 937,
                        bgImageName:"none",
                        bgImageIntegerUrl:"",
                    }),
                    sortNum:0
                  }
                  addOneOtherLayer(bgObj)
                  .then(res => {
                    if(result.n==1){
                        console.log("背景添加成功")
                    }
                  }).catch(error => console.log(error));
              }
                getShareById(shareId)
                .then(result => {
                    _this.initLayer(result[0],shareId,kshId)
                }).catch(error => {
                    console.info(error);      
                });
          }).catch(error => console.log(error));
        })
    }
    initLayer(nameDataObj,shareId,kshId){
        let _this = this;
        let getKshObj = {
          id: kshId,
          tablename: nameDataObj.KSHNAME
        }
        let OtherLayerObj = {
          "shareid" :shareId
        }
        getKSHChart(getKshObj).then(res => {
          let tempData = JSON.parse(res.data);
          let tempCptKeyList = [];
          let tempCptPropertyList = [];
          let tempCptChartIdList = [];
          let timeKey = new Date().getTime().toString();  
              tempData.map((item,index) => {
                timeKey++;
                let tempLayerPosition = item.layerPosition;
                let sortNumChart = item.sortNum;
                let thType = item.thType;
                let vVal = "";
                if(thType==="0"){
                  vVal = item.id;
                }else if(thType==="1"){
                  vVal = item.service+"；"+item.layername+"；"+item.name;
                }
                item.vVal = vVal;
                let tempCptChartObj = {
                    chartId:item.id,
                    thType:item.thType,
                    timeKey:timeKey,
                    mainKey:item.mainKey,
                    addState:'leftAdd',
                    layerObj:item,
                    layerData:{},
                    sortNum:sortNumChart,
                };
                if(tempLayerPosition!==""){
                  tempLayerPosition = JSON.parse(tempLayerPosition)
                }else{
                  tempLayerPosition=JSON.parse('{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"rotate":0,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"chart","cptType":""}')
                }
                tempLayerPosition.type = "chart";
                tempLayerPosition.sortNum = sortNumChart;
                tempCptKeyList.push({ key: timeKey, id: item.name, title: item.layername,layerType:item.thType,simpleType:'', sortNum:sortNumChart});
                tempCptPropertyList.push(tempLayerPosition);
                tempCptChartIdList.push(tempCptChartObj);   
              })
              getOtherLayer(OtherLayerObj)
                    .then(result => {
                      let resultData = result.list
                      if(resultData&&resultData.length>0){
                        let bgObj = {};
                        resultData.map((layerItem,layerIndex) => {
                          timeKey++;
                          let sinSoreNum = layerItem.SORTNUM;
                          let layerId = layerItem.CELLTYPEID;
                          let layerType = layerItem.CELLTYPE;
                          let layerName = layerItem.CELLNAME;
                          let layerJsonObj = JSON.parse(layerItem.CELLJSON);
                          let mainKey = layerItem.ID;
                          if(layerType==="bg"){
                            layerJsonObj.mainKey = mainKey;
                            bgObj = layerJsonObj;
                          }else{
                              let positionObj = layerJsonObj.positionObj;
                              let tempCptChartObj = {
                                    chartId:-1,
                                    thType:layerType,
                                    timeKey:timeKey,
                                    mainKey:layerItem.ID,
                                    addState:'headerAdd',
                                    layerObj:layerItem,
                                    layerData:layerJsonObj,
                                    sortNum:sinSoreNum,
                                };
                                if(!positionObj&&positionObj===""){
                                  positionObj=JSON.parse(`{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"rotate":0,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"${layerType}","cptType":"${layerItem.CELLNAME}"}`)
                                }
                                positionObj.sortNum = sinSoreNum;
                                tempCptKeyList.push({ key: timeKey, id: layerId, title: layerName,layerType:layerType,simpleType:'',sortNum:sinSoreNum});
                                tempCptPropertyList.push(positionObj);
                                tempCptChartIdList.push(tempCptChartObj); 
                          }
                        })
                        if(!bgObj.hasOwnProperty("bgColor")){
                              bgObj = {
                                bgColor: 'rgba(15, 42, 67,1)',
                                bjWidth: 1470,
                                bjHeight: 937,
                                bjImage:'none',
                                bgImageName:"无",
                                bgImageIntegerUrl:"",
                                uploadImage:"",
                                mainKey:-1
                            }
                        }
                        store.dispatch(replaceGlobalBg(bgObj));
                        if(tempCptKeyList.length>1){
                          tempCptKeyList = tempCptKeyList.sort(this.compare("sortNum"));
                          tempCptPropertyList = tempCptPropertyList.sort(this.compare("sortNum"));
                          tempCptChartIdList = tempCptChartIdList.sort(this.compare("sortNum"));
                        }
                        _this.setState({
                          globalBg: bgObj,
                          cptIndex: -1,
                          cptType: '',
                          cptKey: '',
                          cptKeyList: tempCptKeyList,
                          cptPropertyList:tempCptPropertyList,
                          nameData:nameDataObj,
                          cptPropertyObj: { 
                              type: 'bg',//具体的类型：    text chart border
                              cptType: ''
                          },
                          cptChartIdList:tempCptChartIdList
                        }, () => {
                            showChartsOption(tempCptChartIdList);
                        });
                      }
                    })
                    .catch(error => console.info(error));
        }).catch(error => console.info(error));
    }

  compare(property){
         return function(obj1,obj2){
             var value1 = obj1[property];
             var value2 = obj2[property];
             return value1 - value2;     // 升序
         }
  }



  handleScriptCreate(obj) {
    this.setState({ scriptLoaded: false });
  }

  handleScriptError() {
    this.setState({ scriptError: true });
  }

  handleScriptLoad(obj) {
    this.setState({ scriptLoaded: true, scriptStatus: 'yes' });
  }

  /**
   * @description: 添加指定的图层
   * @param {type}
   * @return:
   */
  onClickAdd = ( layerObj , otherObj) => {
    const id = layerObj.id;
    const type = layerObj.layerType;
    const showTitle = layerObj.text;
    //const t = document.getElementById("chart_type").value;//暂时先从下拉列表获取图表类型，后续在更改
    const key = new Date().getTime().toString();
    const cptkObj = {
      key: key,
      id: id,
      title: showTitle,
      layerType: type,
      simpleType: layerObj.simpleType
    };

    const len = this.state.cptKeyList.length;
    let tempHeightValue = 350;
    if (type === 'text') {
      tempHeightValue = 80;
    }
    const cptpObj = {
      cptBorderObj: {
        width: 350,
        height: tempHeightValue,
        left: 450,
        top: 160,
        opacity: 1,
        rotate:0,
        layerBorderWidth: 0,
        layerBorderStyle: 'solid',
        layerBorderColor: 'rgb(0,0,0,1)'
      },
      type: type,
      cptType: id
    };
    //对当前基本内容的全部替换
    store.dispatch(replaceAllShowLayerFieldVal(cptpObj));
    let chartId = -1;
    chartData.map(item => {
      if (item.id == id) {
        chartId = item.chartId;
      }
    });
    let thType = "0";
    let layerTempObj = {};
    let layerData = {};
    let mainKey = -1;
    let addState = "leftAdd";
    let sortNum = otherObj.sortNum;
    addState = otherObj.state;
    if(otherObj&&otherObj.mainKey){
      mainKey = otherObj.mainKey;
    }
    if(otherObj&&otherObj.state==="leftAdd"){
        thType = otherObj.data.thType;
        layerTempObj = otherObj.data;
        chartId = otherObj.data.id;
    }else if(otherObj&&otherObj.state==="headerAdd"){
        otherObj.showVal = layerTempObj;
        layerData = otherObj.otherJson;
        thType = type;
    }
    let addChartObj = {
        chartId:chartId,
        thType:thType,
        layerObj:layerTempObj,
        mainKey:mainKey,
        addState:addState,
        timeKey:key,
        sortNum:sortNum,
        layerData:layerData,
    };
    this.setState(
      {
        cptIndex: len,
        cptType: id,
        cptKey: key,
        cptKeyList: [...this.state.cptKeyList, cptkObj],
        cptPropertyList: [...this.state.cptPropertyList, cptpObj],
        cptPropertyObj: cptpObj,
        cptChartIdList: [...this.state.cptChartIdList,addChartObj ]
      },
      () => {
          chartOption(id, key, this, 'noUpdate', otherObj);
      }
    );
  }

  /**
   * @description: 添加图表和地图之后可以进行将请求数据渲染图表和地图,或者是更新,用来将默认数据存放到store里面
   * @param updateState {String} 用来代表当前的执行是更新还是不更新,用来区分是不是需要重新加载图表和地图 
   * @return: 
   */
  updateChartsStyle(updateState){
    let cptIndex = this.state.cptIndex;
    let chartObj = this.state.cptChartIdList[cptIndex];
    let {addState,thType,layerObj,mainKey} = chartObj;
    let otherObj = {
      state:addState,
      data:layerObj,
      thType:thType,
      mainKey:mainKey   
    }
    chartOption(this.state.cptType, this.state.cptKey, this, updateState, otherObj);
  }

  /**
   * @description: 用来进行显示删除弹出框
   * @param layerIndex {int} 
   * @return: 
   */
  ondelItemPrev(layerIndex) {
    this.refs.delModal.setDefaultValue(layerIndex);
  }

  /**
   * @description: 点击图表或者地图的编辑按钮出现原先的编辑弹框,确定后成功会自动调用重新获取数据的方法
   * @param layerIndex {int} 
   * @return: 
   */
  editItemPrev(layerIndex){
    let chartObj = this.state.cptChartIdList[layerIndex];
    let layerObj = chartObj.layerObj
    let parentDom = window.parent.document;
    let prevDataShow = parentDom.getElementById("dataShow");
    var dataShow = prevDataShow.contentWindow.document;
    let hiddenDiv = dataShow.getElementsByClassName("oneDiv");
    if(hiddenDiv&&hiddenDiv.length>0){
      for(let i=0;i<hiddenDiv.length;i++){
        hiddenDiv[i].style.opacity = "0";
      }
    }
    layerObj.editState = "editPage";
    prevDataShow.style.zIndex = 11;
    prevDataShow.contentWindow.topicEditor(layerObj,1)
  }
  
  /**
   * @description:  删除的提示框点击确定的时候，用来删出数据库里面的数据,删除成功后调用方法删除程序里面的图标
   * @param delIndex {int} 
   * @return: 
   */
  deleteDataBaseOneLayer = delIndex => {
    let _this = this;
    let cptIndex = delIndex;
    let chartObj = this.state.cptChartIdList[cptIndex];
    let queryId = chartObj.chartId;
    let layerObj = chartObj.layerObj;
    let thType = chartObj.thType;
    let kshPageName = '';
    let nameData = this.state.nameData;
    if(nameData){
          kshPageName = nameData.KSHNAME;
    }else{
          console.info("获取全局的页面名称失败")
    }
    if(thType==="0"||thType==="1"){
            let sendStrVal = "{\"delete\":[";
            if (thType === "0") {//图表
              sendStrVal += "{\"id\":" + queryId + "},"
            } else if (thType === "1") {
              let mapNames = layerObj.vVal.split("；");
              sendStrVal += "{\"service\":\"" + mapNames[0] + "\",\"name\":\"" + mapNames[2] + "\",\"layername\":\"" + mapNames[1] + "\"},"
            }
            sendStrVal = sendStrVal.substring(0, sendStrVal.length - 1) + "]}";
          let delObj = {
              str: sendStrVal,
              name: kshPageName
          }
          delOneLayer(delObj).then(result => {
            if(result.flag>0){
              _this.ondelItem(cptIndex);
              Modal.success({
                title: '',
                content: '删除图层成功',
            });
            }else{
              Modal.error({
                title: '',
                content: '删除图层失败',
              });
            }
        }).catch(error => {
          Modal.error({
                title: '',
                content: '删除图层失败,请求接口出错',
            });
            console.info(error);
        })
    }else{// if(thType==="text"||thType==="border"||thType==="iframe")
      let mainKey = chartObj.mainKey;
      let delObj = {
        id:mainKey,
      }
      delOneOtherLayer(delObj)
      .then(result => {
        if(result.flag==1){
            _this.ondelItem(cptIndex);
            Modal.success({
              title: '',
              content: '删除图层成功',
          });
        }else{
          Modal.error({
            title: '',
            content: '删除图层失败',
          });
        }
      })
      .catch(error => console.log(error))
    }
  }
  /**
   * @description: 删除指定的图层
   * @param {number} layerIndex 当前图层对应的index值
   * @return:
   */
  ondelItem(layerIndex) {
    let cptkList = this.state.cptKeyList;
    let cptChartIdList = this.state.cptChartIdList;
    let cptpList = this.state.cptPropertyList;
    let arr = window.arr ? window.arr : [];
    let mapObjArr = window.mapObjArr ? window.mapObjArr : [];
    cptkList.splice(layerIndex, 1);
    cptpList.splice(layerIndex, 1);
    cptChartIdList.splice(layerIndex, 1);
    if (arr.length > 0) {
      arr.splice(layerIndex, 1);
      mapObjArr.splice(layerIndex, 1);
      window.arr = arr;
      window.mapObjArr = mapObjArr;
    }
    const cptpObj = cptpList[0]
      ? cptpList[0]
      : {
          cptBorderObj: {
            //边框属性
            width: 350,
            height: 260,
            left: 450,
            top: 160,
            rotate:0,
            opacity: this.state.cptPropertyObj.cptBorderObj.opacity,
            layerBorderWidth: 0,
            layerBorderStyle: 'solid',
            layerBorderColor: 'rgb(0,0,0,1)'
          },
          type: 'bg',
          cptType: 'bg'
        };
    //对当前基本内容的全部替换
    store.dispatch(replaceAllShowLayerFieldVal(cptpObj));
    //将option在store的集合里面删掉
    store.dispatch(delCptOptionsList(layerIndex));
    this.setState(
      {
        cptIndex: -1,
        cptKey: '',
        cptType: cptpObj.cptType ? cptpObj.cptType : '',
        cptKeyList: cptkList,
        cptPropertyList: cptpList,
        cptPropertyObj: cptpObj,
        cptChartIdList: cptChartIdList
      });
  }
 
 

  /**
   * @description: 将存放在集合里面的数据进行更新
   * @param {type}
   * @return:
   */
  updateLayerPosition(layerIndex, type, fieldArr) {
    let tempCptObj = this.state.cptPropertyList[layerIndex];
    if (type == 'multi') {
      fieldArr.forEach(item => {
        let fieldEname = item.fieldEname;
        let fieldValue = item.fieldValue;
        store.dispatch(
          updateShowLayerFieldVal({ fieldEname: fieldEname, fieldValue: fieldValue, layerType: 'chart' })
        );
        tempCptObj.cptBorderObj[fieldEname] =fieldValue;
      });
    }
    this.state.cptPropertyList[layerIndex] = tempCptObj;
    this.setState({
      cptPropertyList: this.state.cptPropertyList //所有组件属性集合
    });
  }

  handleResizeMove = e => {
    var index = parseInt(e.target.parentNode.parentNode.getAttribute('index'));
    // index = this.state.cptIndex;
    const width = e.rect.width;
    const height = e.rect.height;
    // const left = e.x0;
    // const top = e.y0;
    // console.log(e);
    var prevObjStyle = e.target.parentNode.style;
    const left = parseInt(prevObjStyle.left);
    const top = parseInt(prevObjStyle.top);
    const layerBorderWidth = parseInt(prevObjStyle.borderWidth);
    const layerBorderStyle = prevObjStyle.borderStyle;
    const layerBorderColor = prevObjStyle.borderColor;
    const opacity = this.state.cptPropertyObj.cptBorderObj.opacity;
    let cptpList = this.state.cptPropertyList;
    const t = cptpList[index].cptType ? cptpList[index].cptType : 'bg';
    const type = cptpList[index].type ? cptpList[index].type : 'bg';
    let cptpObj = {
      cptBorderObj: {
        width,
        height,
        left,
        top,
        opacity,
        rotate:0,
        layerBorderWidth,
        layerBorderStyle,
        layerBorderColor
      },
      type: type,
      cptType: t
    };
    cptpList[index] = cptpObj;
    //对当前基本内容的全部替换
    store.dispatch(replaceAllShowLayerFieldVal(cptpObj));
    this.setState(
      {
        cptIndex: index,
        cptPropertyList: cptpList,
        cptPropertyObj: cptpObj
      },
      () => {
          this.updateChartsStyle("noUpdate");
      }
    );
  };

  /**
   * @description:  用面板修改图表的值
   * @param {Object} updateFieldObj 保存要修改的面板的index,属性英文名和值 和对应的类型
   * @return:
   */
  changeProperties = updateFieldObj => {
    const fieldValue = updateFieldObj.fieldValue;
    const fieldEname = updateFieldObj.fieldEname;
    let state = this.state;
    const cptIndex = state.cptIndex;
    const layerType = state.cptPropertyObj.type;
    let cptpList = state.cptPropertyList;
    let cptChartIdList = state.cptChartIdList;
    let cptOptionObj = store.getState().showLayerDatas.cptOptionsList[cptIndex];
    if(cptIndex === -1){
      store.dispatch(updateShowLayerFieldVal(updateFieldObj));
        let globalBg =  state.globalBg;
        globalBg[fieldEname] = fieldValue;
        this.setState(
          {
            globalBg: globalBg
          },() => {
            this.debounce(this.editBgConfig);
          }
        );
    }else{
      let cptKeyObj = state.cptKeyList[cptIndex];
      let otherLayerId = cptKeyObj.id;
      if (
        fieldEname === 'width' ||
        fieldEname === 'height' ||
        fieldEname === 'left' ||
        fieldEname === 'top' ||
        fieldEname === 'opacity' ||
        fieldEname === 'rotate' ||
        fieldEname === 'layerBorderWidth' ||
        fieldEname === 'layerBorderStyle' ||
        fieldEname === 'layerBorderColor'
      ) {
        store.dispatch(updateShowLayerFieldVal(updateFieldObj));
        var cptpObj = state.cptPropertyList[cptIndex];
        if (cptIndex !== -1) {
          cptpObj.cptBorderObj[fieldEname] = fieldValue;
          cptpList[cptIndex] = cptpObj;
        } else {
          cptpObj = store.getState().showLayerDatas.showDatas;
        }
        this.setState(
          {
            cptPropertyList: cptpList,
            cptPropertyObj: cptpObj
          },
          () => {
              this.updateChartsStyle("noUpdate")
              this.debounce(this.editDataBaseLayerPosition,cptIndex);
          }
        );
      } else {
          if(layerType==="table"){
            let layerData = cptChartIdList[cptIndex].layerData;
            if(fieldEname === "tablePageSize"){
              layerData.tableConfig.table.pageSize = fieldValue;
            } else if(fieldEname === "tableHeaderFontFamily"){
             layerData.tableConfig.table.header.textStyle.fontFamily = fieldValue
            } else if(fieldEname === "tableHeaderfontSize"){
              layerData.tableConfig.table.header.textStyle.fontSize = fieldValue
            } else if(fieldEname === "tableHeaderfontColor"){
              layerData.tableConfig.table.header.textStyle.color = fieldValue
             } else if(fieldEname === "tableHeaderfontWeight"){
               layerData.tableConfig.table.header.textStyle.fontWeight = fieldValue
             } else if(fieldEname === "tableHeaderBorderWidth"){
              layerData.tableConfig.table.header.borderStyle.width = fieldValue
             } else if(fieldEname === "tableHeaderBorderColor"){
               layerData.tableConfig.table.header.borderStyle.color = fieldValue
             } else if(fieldEname === "tableHeaderbgColor"){
              layerData.tableConfig.table.header.backgroundColor = fieldValue
             } else if(fieldEname === "tableHeaderTextAlign"){
               layerData.tableConfig.table.header.textAlign = fieldValue
             } else if(fieldEname === "tableBodyFontFamily"){
              layerData.tableConfig.table.textStyle.fontFamily = fieldValue
              } else if(fieldEname === "tableBodyfontSize"){
                layerData.tableConfig.table.textStyle.fontSize = fieldValue
              } else if(fieldEname === "tableBodyfontColor"){
                layerData.tableConfig.table.textStyle.color = fieldValue
              } else if(fieldEname === "tableBodyfontWeight"){
                layerData.tableConfig.table.textStyle.fontWeight = fieldValue
              } else if(fieldEname === "tableBodyBorderWidth"){
                layerData.tableConfig.table.borderStyle.width = fieldValue
              } else if(fieldEname === "tableBodyBorderColor"){
                layerData.tableConfig.table.borderStyle.color = fieldValue
              } else if(fieldEname === "tableBodybgColor"){
                layerData.tableConfig.table.backgroundColor = fieldValue
              } else if(fieldEname === "tableBodyTextAlign"){
                layerData.tableConfig.table.textAlign = fieldValue
              }
            cptOptionObj.layerOption  = layerData;
            cptChartIdList[cptIndex].layerData = layerData;
          }else if(layerType==="image"){
            if(otherLayerId==="singleImage"){
                if(fieldEname === 'url'||fieldEname === 'ifBlank'){
                  cptOptionObj.layerOption.urlConfig[fieldEname] = fieldValue;
                  cptChartIdList[cptIndex].layerData.urlConfig[fieldEname] = fieldValue;
                }else{
                  cptOptionObj.layerOption[fieldEname] = fieldValue;
                  cptChartIdList[cptIndex].layerData[fieldEname] = fieldValue;
                }
            }
          }else{
            cptOptionObj.layerOption[fieldEname] = fieldValue;
            cptChartIdList[cptIndex].layerData[fieldEname] = fieldValue;
          }
          this.setState({
            cptChartIdList:cptChartIdList
          },() => {
            let tempOptionObj = {
              cptIndex:cptIndex,
              layerOption:cptOptionObj.layerOption
            }
            store.dispatch(editCptOptionsList(tempOptionObj)); 
            if (layerType === 'chart') {         
              this.updateChartsStyle("update");
              this.debounce(this.editChartData,cptIndex,tempOptionObj)
            } else {
              this.debounce(this.editOtherLayer,cptOptionObj,cptChartIdList,cptIndex)
            }
          })
      }
    }
  }

  /**
   * @description: 事件防抖提升性能
   * @param {type} 
   * @return: 
   */
  debounce = (...args) => {
    let delay = 300;
    let fn = args.shift();
    // 维护一个 timer
    let timer = null;
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  }
  /**
   * @description:  修改背景颜色的配置
   * @param {type} 
   * @return: 
   */
  editBgConfig = () => {
    let bgObj = this.state.globalBg;
    let editObj = {
      id: bgObj.mainKey,
      tabid: 0,
      json: JSON.stringify(bgObj)
    }
    editOneOtherLayer(editObj)
    .then(result => {
      if (result.n == "1") {
        console.info("编辑背景succeed");
      }else{
        console.info("编辑背景error");
      }
    }).catch(error =>  console.info("编辑背景error"));
  }
  /**
   * @description: 用来对每个图层的通用数据进行编辑
   * @param  {Array} args  [cptIndex]
   * @return: 
   */
  editDataBaseLayerPosition = (...args) => {
        let [cptIndex] = args;
        let thType = "0";
        let mainKey = -1;
        let state = this.state;
        let leftChartObj = state.cptChartIdList[cptIndex];
        if(leftChartObj){
          thType = leftChartObj.thType;
          mainKey = leftChartObj.mainKey;
        }
        let showDatas = store.getState().showLayerDatas.showDatas;
        if(thType==="0"||thType==="1"){
          let editObj = {
            "id" : mainKey,
            "positionData" : JSON.stringify(showDatas)
          }
          editKSHChartPosition(editObj)
          .then(result => {
            if (result.flag == "1") {
              console.info("编辑定位succeed");
            }else{
              console.info("编辑定位error");
            }
          }).catch(error =>  console.info("编辑定位error"));
        }else{
          // if(thType==="text"||thType==="border"||thType==="iframe"){
            let layerData = leftChartObj.layerData;
            layerData.positionObj = showDatas;
            let editObj = {
              id: mainKey,
              tabid: 0,
              json: JSON.stringify(layerData)
            }
            editOneOtherLayer(editObj)
            .then(result => {
              if (result.n == 1) {
                console.info("编辑定位succeed");
              }else{
                console.info("编辑定位error");
              }
            }).catch(error =>  console.info("编辑定位error"));
          // }
        }
  }

   /**
   * @description: 图表的图层进行右侧编辑的时候调用的方法
   * @param {Array} args  [cptOptionObj,cptChartIdList,cptIndex]
   * @return: 
   */
  editOtherLayer = (...args) => {
    let [cptOptionObj,cptChartIdList,cptIndex] = args;
    let layerOption = cptOptionObj.layerOption;
    layerOption.positionObj = store.getState().showLayerDatas.showDatas;
    let chartObj = cptChartIdList[cptIndex];
    let mainKey = chartObj.mainKey;
    let editObj = {
      id: mainKey,
      tabid: 0,
      json: JSON.stringify(layerOption)
    }
    editOneOtherLayer(editObj)
    .then(result => {
      if(result.n==1)
         console.info("编辑其他图层success")
    }).catch(error =>  console.info("编辑其他图层error"));
    this.editOtherLayer(cptOptionObj,cptChartIdList,cptIndex);
  }

  /**
   * @description: 图表的图层进行右侧编辑的时候调用的方法
   * @param {Array} args  [layerIndex,tempOptionObj]
   * @return: 
   */
  editChartData = (...args) => {
      let [layerIndex,tempOptionObj] = args;
      let chartObj = this.state.cptChartIdList[layerIndex];   
      let editJson = this.getEditJson(chartObj,tempOptionObj);
      this.editItemDataBaseOneLayer(layerIndex,editJson);
      let thType = "0";
      let leftChartObj = this.state.cptChartIdList[layerIndex];
      if(leftChartObj){
        thType = leftChartObj.thType;
      }
      let editObj = {
        thType : thType,
        data : editJson
      }
      editKSHChartData(editObj)
      .then(result => {
        if (result== "编辑成功!") {
        console.info("编辑图层成功");
        
        }else{
          console.info("编辑图层失败");
        }
        }).catch(error => {
          console.info("编辑图层失败");
      })
  }

   /**
   * @description: 一般图表的时候返回的json数据
   * @param {Object} chartObj 从layout里面获取到的当前节点的基本请求信息
   * @param {Object} tempOptionObj 用来编辑成功进行更新的optionos和queryId对象
   * @return:
   */
    getEditJson(chartObj,tempOptionObj) {
      let layerObj = chartObj.layerObj;
      let dataSource = tempOptionObj.layerOption[0];
      let resultLegend = dataSource.myLegend.result;
      let tablenameVal = dataSource.myDataSource.result[0].DS_INFO;
      let layerName = dataSource.mapInfor.result[0].NAME;
      let pid = "1"//window.parent.document.getElementById("kshID").value;
      let chartType = layerObj.type//"圆环统计图";
      let unitVal = "test";
      var baseMap = "RESULTLAYER";
      var desp = "";//描述
      let typeField = "OBJECTID";
      let chartPosition = "left";//图表位置
      let tongjituyszd ="运营商";
      let tempLegendData = [];//保存legend对象的数组
      let iscbtfVal = "";
    /*  resultLegend.forEach((legendItem,legendIndex) => {
        var colorVal = legendItem.color;
        var fieldName = legendItem.value;
        let istitlebox = "";
        let addTempObj = {};
        if (
          chartType == "THEMERING_CHART" ||
          chartType == "THEMEPIE_CHART" ||
          chartType == "THEMEFUNNEL_CHART" ||
          chartType == "THEMEPYRAMID_CHART"
        ) {
          istitlebox = typeField;
          iscbtfVal= tongjituyszd;
        } else {
          iscbtfVal= typeField;
          if (chartType == "THEMEHISTOGRAM" || chartType == "THEMEVERTBAR_SORT") {
            istitlebox = chartPosition;
          } else {
            istitlebox = "";
          }
        }
        addTempObj = {
          name: fieldName,
          isText: false,
          istitlebox: istitlebox,
          iscbtf: iscbtfVal,
          isfacebox: "",
          issizebox: "",
          minVal: 0,
          maxVal: 0,
          fieldname: fieldName,
          color: colorVal,
          unit: unitVal
        };
        tempLegendData.push(addTempObj);
      });
    let tempLegendStr = JSON.stringify(tempLegendData);
    var tempJsonDataObj = {
        maxSize:0,
        minSize:0,
        reference:unitVal,
        name:layerName,
        tablename:tablenameVal,
        type:chartType,
        pid:pid,
        id:layerObj.id,
        desp:desp,
        baseMap:baseMap,
        legend:tempLegendStr,
        type2:"null",
      }
      var tempJsonData = JSON.stringify(tempJsonDataObj);
      return tempJsonData; */
      var json = "{\"maxSize\":\"" + 0 + "\",\"minSize\":\"" + 0 + "\",\"reference\":\"" + unitVal + "\",\"name\":\"" + layerName + "\",\"tablename\":\"" + tablenameVal + "\",\"type\":\"" + chartType + "\",\"pid\":\"" + pid + "\",\"id\":\"" + layerObj.id + "\",\"desp\":\"" + desp + "\",\"baseMap\":\"" + baseMap + "\",\"legend\":[";

      for (var i = 0; i < resultLegend.length; i++) {
        json += "{";
        var color = resultLegend[i].color;
        var fieldname = resultLegend[i].value;
        var istitlebox = "";
        if (chartType == "THEMERING_CHART" || chartType == "THEMEPIE_CHART" || chartType=="THEMEFUNNEL_CHART"||chartType=="THEMEPYRAMID_CHART") {
          istitlebox = typeField;
          json += "\"name\":\"" + fieldname + "\",\"isText\":\"" + false + "\",\"istitlebox\":\"" + istitlebox + "\",\"iscbtf\":\"" + tongjituyszd + "\",\"isfacebox\":\"" + "" + "\",\"issizebox\":\"" + "" + "\",\"minVal\":0,\"maxVal\":0,\"fieldname\":\"" + fieldname + "\",\"color\":\"" + color + "\",\"unit\":\"" + unitVal + "\"},";
        } else {
          if(chartType=="THEMEHISTOGRAM"||chartType=="THEMEVERTBAR_SORT"){
            istitlebox = chartPosition;
            json+="\"name\":\""+fieldname+"\",\"isText\":\""+false+"\",\"istitlebox\":\""+istitlebox+"\",\"iscbtf\":\""+typeField+"\",\"isfacebox\":\""+""+"\",\"issizebox\":\""+""+"\",\"minVal\":0,\"maxVal\":0,\"fieldname\":\""+fieldname+"\",\"color\":\""+color+"\",\"unit\":\""+unitVal+"\"},";
          }else{
            json+="\"name\":\""+fieldname+"\",\"isText\":\""+false+"\",\"istitlebox\":\""+""+"\",\"iscbtf\":\""+typeField+"\",\"isfacebox\":\""+""+"\",\"issizebox\":\""+""+"\",\"minVal\":0,\"maxVal\":0,\"fieldname\":\""+fieldname+"\",\"color\":\""+color+"\",\"unit\":\""+unitVal+"\"},";
            
          }		}
      }
    
      json = json.substring(0, json.length - 1) + "],\"type2\":\"null\"}";
      return json;
    }

    /**
    * @description: 点击当前图层的时候将当前图层选中,并将右侧配置项的内容进行同步   -- 暂时不使用
    * @param {type}
    * @return:
    */
    handleDown = e => {
        var index = parseInt(e.currentTarget.parentNode.parentNode.getAttribute('index'));
        // index = this.state.cptIndex;
        const id = e.currentTarget.firstElementChild.getAttribute('id');
        let cptkList = this.state.cptKeyList;
        let cptpList = this.state.cptPropertyList;
        const cptkObj = cptkList[index];
        const cptpObj = cptpList[index];
        const t = cptpObj.cptType ? cptpObj.cptType : 'bg';
        //更新strore里卖弄的数据
        store.dispatch(replaceAllShowLayerFieldVal(cptpObj));
        this.setState({
          cptIndex: index,
          cptKey: id,
          cptType: t,
          cptKeyList: cptkList, //组件集合
          cptPropertyList: cptpList, //所有组件属性集合
          cptPropertyObj: cptpObj
        });
    };
    /**
     * @description:  用来进行不同的图层之间索引的切换,更新当前点击的索引
     * @param {Integer} layerIndex 当前点击的图层的索引
     * @param {Strign} timeId 当前点击的图层的d
     * @return:
     */
    singleSwitchLayer = (event, layerIndex) => {
      if(layerIndex===-1){
        this.setState({ 
          cptIndex: layerIndex,
        });
      }else{
        let cptPropertyObj = this.state.cptPropertyList[layerIndex];
        event.stopPropagation();
        store.dispatch(replaceAllShowLayerFieldVal(this.state.cptPropertyList[layerIndex]));
        this.setState({ 
            cptIndex: layerIndex,
            cptPropertyObj:cptPropertyObj
        });
      }
    }

   /**
    * @description: 用来切换两个图层之间的先后顺序,上移和下移
    * @param {type}
    * @return:
    */
    selectSingleLayer = (event,layerIndex,updateIndex,stateVal) =>{
      event.stopPropagation();
      let state = this.state;
      let chartLists =state.cptChartIdList;
      let thisLayer = chartLists[layerIndex];
      if(stateVal===1||stateVal===-1){
        let updateState = -1;
        let updateLayer = chartLists[updateIndex];
        let thisAddState = thisLayer.addState;
        let updateAddState = updateLayer.addState;
        if(thisAddState==="leftAdd"&&updateAddState==="leftAdd"){
          updateState = 1;
        }else if(thisAddState==="headerAdd"&&updateAddState==="headerAdd"){
          updateState = 2;
        }else if(thisAddState==="leftAdd"&&updateAddState==="headerAdd"){
          updateState = 3;
        }else if(thisAddState==="headerAdd"&&updateAddState==="leftAdd"){
          updateState = 4;
        }
        let updateSortNumObj = {
          thisMainKey : thisLayer.mainKey,
          thisSortNum : thisLayer.sortNum,
          updateMainKey : updateLayer.mainKey,
          updateSortNum : updateLayer.sortNum,
          updateState:updateState,
        }
        editLayerSortNum(updateSortNumObj)
        .then( result => {
          if(result.flag===2){
            this.mainSwitchLayer(layerIndex,updateIndex,stateVal);
          }
        })
        .catch(error => console.log(error));
      }else if(stateVal==='top'||stateVal==='bottom'){
        let startIndex = 0;
        let endIndex = chartLists.length;
        let updateLayers = [];
        if(stateVal==="top"){
          endIndex = layerIndex-1;
        }else if(stateVal==="bottom"){
          startIndex = layerIndex+1;
        }
        updateLayers.push({
          addState:thisLayer.addState,
          mainKey:thisLayer.mainKey,
          updateIndex:updateIndex
        })
        for(let i=startIndex;i<endIndex;i++){
          let item = chartLists[i];
          let updateIndex = i;
          if(stateVal==="top"){
            updateIndex = i+1;
          }else if(stateVal==="bottom"){
            updateIndex = i-1;
          }
          updateLayers.push({
            addState:item.addState,
            mainKey:item.mainKey,
            updateIndex:updateIndex
          })
        }
        editLayerSortTopOrBottom({
          updateLayers:JSON.stringify(updateLayers)
        })
        .then( result => {
          if(result.flag===updateLayers.length){
            this.mainSwitchLayer(layerIndex,updateIndex,stateVal);
          }
        })
        .catch(error => console.log(error));
      }
    }

    /**
     * @description: 数据库中字段更改成功后进行更换程序里面的图层顺序
     * @param {type} 
     * @return: 
     */
    mainSwitchLayer = (layerIndex,updateIndex,updateState) => {
      let arr = window.arr ? window.arr : [];
      let mapObjArr = window.mapObjArr ? window.mapObjArr : [];
      if (arr.length > 0) {
        window.arr =  this.replaceData(arr,layerIndex,updateIndex,updateState);
        window.mapObjArr =  this.replaceData(mapObjArr,layerIndex,updateIndex,updateState);
      }
      let cptOptionsList = store.getState().showLayerDatas.cptOptionsList;
      let tempOptionLists = [].concat(JSON.parse(JSON.stringify(cptOptionsList)));
      tempOptionLists = this.replaceData(tempOptionLists,layerIndex,updateIndex,updateState)
      store.dispatch(replaceOptionsList(tempOptionLists));
      let state = this.state;
      let cptPropertyList = state.cptPropertyList;
      let cptIndex = state.cptIndex;
      let cptType = state.cptType;
      let cptKey = state.cptKey;
      let cptKeyList = state.cptKeyList;
      let cptChartIdList = state.cptChartIdList;
      let cptPropertyObj = state.cptPropertyObj;
      let thisChartObj = cptChartIdList[layerIndex];
      cptIndex = updateIndex;
      cptType = thisChartObj.chartId;
      cptKey = thisChartObj.timeKey;
      cptPropertyObj = cptPropertyList[layerIndex];
      cptKeyList = this.replaceData(cptKeyList,layerIndex,updateIndex,updateState);
      cptPropertyList = this.replaceData(cptPropertyList,layerIndex,updateIndex,updateState);
      cptChartIdList = this.replaceData(cptChartIdList,layerIndex,updateIndex,updateState);
      this.setState({
        cptIndex: cptIndex,
        cptKey: cptKey,
        cptType:cptType,
        cptKeyList: cptKeyList,
        cptPropertyList: cptPropertyList,
        cptChartIdList: cptChartIdList,
        cptPropertyObj: cptPropertyObj,
      })
    }

    /**
     * @description: 替换数组两个位置的值
     * @param {type} 
     * @return: 
     */
    replaceData = (dataArrays,layerIndex,updateIndex,updateState) => {
      if(updateState==="top"||updateState==="bottom"){
        let tempObj = dataArrays[layerIndex];
        dataArrays.splice(layerIndex,1);
        if(updateState==="top"){
          dataArrays.unshift(tempObj);
        }else if(updateState==="bottom"){
          dataArrays.push(tempObj);
        }
      }else if(updateState===1||updateState===-1){
        [dataArrays[updateIndex],dataArrays[layerIndex]] = [dataArrays[layerIndex],dataArrays[updateIndex]];
      }
      return dataArrays;
    }

 
  /**
   * @description: 画布下方的滚动条控制中间的显示画布的缩放比例
   * @param {number} scaleValue
   * @return: 
   */  
  setContentScale = scaleValue => {
      this.setState({scale:scaleValue})
  }

  /**
   * @description: 将预览的对话框展示出来
   * @param {type} 
   * @return: 
   */
  savePagePrev = () =>{
    let preState = this.state;
    let nameData = preState.nameData;
    let sidVal = `${nameData.USERNAME}_${nameData.ID}_${preState.kshId}`;
    this.refs.shareModel.setDefaultValue(`http://121.8.161.110:8082/share/build/index.html?sid=${sidVal}`);
  }


  render() {
    let {cptIndex,nameData,cptKeyList,cptChartIdList,scale,cptPropertyObj,cptPropertyList,globalBg} = this.state;
    let {bjWidth,bjHeight,bgColor,bgImageName,bgImageIntegerUrl} = globalBg;
    return (
      <Fragment>
        <Header
          ref='Header'
          onClickAdd={this.onClickAdd}
          savePagePrev={this.savePagePrev}
          nameData={nameData}
          comLength={cptKeyList.length}
          cptChartIdList={cptChartIdList}
        />
        <div className='custom-content'>
           <LeftComponentList 
          ref="leftComponentList"
          nameData={nameData}
          ComponentList={cptKeyList}
          cptChartIdList={cptChartIdList}
          comLength={cptKeyList.length}
          cptIndex={cptIndex}
          onClickAdd={this.onClickAdd}
          singleSwitchLayer={this.singleSwitchLayer}
          selectSingleLayer={this.selectSingleLayer}/>
          <div className='custom-content-p'>
            <div  className={'custom-content-top'}>
                <div
                    className={'custom-content-canvs '+bgImageName}
                    style={{
                      height: bjHeight,
                      width: bjWidth,
                      left:'60px',
                      top:'60px',
                      backgroundColor: bgColor,
                      transform: `scale(${scale}) translate(0px, 0px)`,
                      backgroundImage:`url(${bgImageIntegerUrl})`
                    }}
                    onClick={event => {
                      this.singleSwitchLayer(event, -1);
                    }}>
                    <DeleteItemModal
                      ref="delModal"
                      delItem={this.deleteDataBaseOneLayer}
                    />
                    <ShareItemModal
                    ref="shareModel"
                    />
                    {cptKeyList.map((item, i) => {
                      let timeKey = item.key;
                      return (
                        <div
                          index={i}
                          key={timeKey}
                          onClick={event => {
                            this.singleSwitchLayer(event, i);
                          }}>
                          <Content
                            timeKey={timeKey}
                            cptIndex={cptIndex}
                            delIndex={i}
                            obj={cptPropertyList[i]}
                            keyData={item}
                            chartData={cptChartIdList[i]}
                            handleResizeMove={this.handleResizeMove}
                            handleDown={this.handleDown}
                            del={this.ondelItemPrev.bind(this, i)}
                            editItem={this.editItemPrev.bind(this,i)}
                            updateLayerPosition={this.updateLayerPosition.bind(this)}
                            editDataSource={this.debounce.bind(this,this.editDataBaseLayerPosition,i)}></Content>
                        </div>
                      );
                    })}
                </div>
            </div>
            <div 
              className={'custom-content-bottom'} >
                  <ContentBottom
                      value = {scale}
                      setContentScale = {this.setContentScale}
                  />
            </div>
          </div>
          
            <Config
              ref='rightConfig'
              changeProperties={this.changeProperties}
              cptPropertyObj={cptPropertyObj}
              cptIndex={cptIndex}
              cptChartData={cptChartIdList[cptIndex]}
              cptLayerAttr={cptKeyList[cptIndex]}
              globalBg={globalBg}
            />
            {/* <PageSetting
              ref='rightConfig'
              changeProperties={this.changeProperties}
              cptPropertyObj={cptPropertyObj}
              cptIndex={cptIndex}
              cptLayerAttr={cptKeyList[cptIndex]}></PageSetting> */}
        </div>
      </Fragment>
    );
  }
}

export default Layout;
