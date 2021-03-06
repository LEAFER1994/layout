import React, { Component } from "react";
import { Collapse, Button, message,Tabs, Icon} from "antd";
import { getAllZTT, getShareById, addOneLayer } from "../../api/api";
import $ from 'jquery';
import "./LeftComponentList.scss";
const { Panel } = Collapse;
const { TabPane } = Tabs;
/*
 * 样式面板组件
 */
class LeftComponentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentData: [],
      nameData: [],
      left: 0,
      top: 0,
      ComponentList: [],
      cptIndex: [],
      tabsKey:1,
      tabKeys: [
        {
          serialNumber: '1',
          tabCname: '图表',
          IconEname: 'apple',
          defaultSelect: true,
        },
        {
          serialNumber: '2',
          tabCname: '位置',
          IconEname: 'android',
          defaultSelect: false
        }
      ],
      moveBottom:[
        {
          cid:1,
          cname:'上移',
          flag:-1,
        },
        {
          cid:2,
          cname:'下移',
          flag:1,
        },
        {
          cid:3,
          cname:'置顶',
          flag:'top',
        },
        {
          cid:4,
          cname:'置底',
          flag:'bottom',
        }
      ]
    };
  }

  componentWillReceiveProps(newProps) {
    let nameData = newProps.nameData;
    if (nameData) {
      this.setState({
        nameData: nameData,
        ComponentList: newProps.ComponentList,
        cptIndex: newProps.cptIndex
      });
    }
  }

  componentDidMount() {
    this.initLeftDatas();
  }

  moveShowLayer(event, updateState) {
    let ComponentList = this.state.ComponentList;
    let cptIndex = this.state.cptIndex;
    let updateIndex = -1;
    let maxIndex = this.state.ComponentList.length - 1;
    if (ComponentList.length > 0 && cptIndex !== -1) {
      if (updateState === 1) {
        if (cptIndex < maxIndex ) {
          updateIndex = cptIndex + 1;
        } else {
          console.log("已经到底了");
          return;
        }
      } else if (updateState === -1) {
        if (cptIndex > 0) {
          updateIndex = cptIndex - 1;
        } else {
          console.log("已经到顶了");
          return;
        }
      } else if(updateState === "top"){
        if (cptIndex > 0) {
          updateIndex = 0;
        } else {
          console.log("已经到顶了");
          return;
        }
      } else if(updateState === "bottom"){
        if (cptIndex < maxIndex ) {
          updateIndex = maxIndex;
        } else {
          console.log("已经到底了");
          return;
        }
      }
      this.props.selectSingleLayer(event, cptIndex, updateIndex,updateState);
    }
  }

  initLeftDatas() {
   /*  let tempArr = [
      {
        data:
        '[{"id":4,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMERING_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":2,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMEPIE_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":4,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMERING_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":2,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMEPIE_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":4,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMERING_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":2,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMEPIE_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":4,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMERING_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null},{"id":2,"parentid":1,"name":"京津冀年卡景点20190","type":"THEMEPIE_CHART","service":null,"layername":null,"renderer":null,"thType":"0","type2":null,"desp":"","isText":null,"showType":null,"realtimeupdate":null,"serialize":null,"show":null}]',
        service: {
          id: 1,
          name: "CCC"
        }
      }
    ];
     tempArr = tempArr.filter(item =>  item.data = JSON.parse(item.data));


    this.setState({
      componentData: tempArr,
    }); */
    getAllZTT()
      .then(result => {
        if (result && result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            let tempData = result[i].data;
            result[i].data = JSON.parse(tempData);
          }
        }
        this.setState({
          componentData: result
        });
      })
      .catch(function(e) {
        console.log("fetch fail");
      });
  }

  isAddLayer(thisThType, vVal) {
    let cptChartIdList = this.props.cptChartIdList;
    let isExist = false; //图层是否已存在，默认不存在
    cptChartIdList.map(item => {
      let layerObj = item.layerObj;
      let thType = layerObj.thType;
      if (
        (thisThType == thType && thType == "0" && vVal == layerObj.id) ||
        (thisThType == thType &&
          thType == "1" &&
          vVal ==
            layerObj.service + "；" + layerObj.layername + "；" + layerObj.name)
      ) {
        //图表
        isExist = true;
      }
    });
    return isExist;
  }

  onClickAdd(layerObj) {
    let _this = this;
    let pageLayerObj = this.state.nameData;
    let thType = layerObj.thType;
    let vVal = "-1";
    if (thType == "0") {
      vVal = layerObj.id;
    } else if (thType == "1") {
      vVal =
        layerObj.service + "；" + layerObj.layername + "；" + layerObj.name;
    }
    let isExist = this.isAddLayer(thType, vVal);
    if (isExist) {
      message.info("当前图表已存在");
      return;
    }
    layerObj.vVal = vVal;
    let sortNum = this.props.comLength + 1;
    let addLayerObj = {
      type: thType,
      //pid: window.parent.document.getElementById("kshID").value,
      pid:layerObj.parentid,
      kshname: pageLayerObj.KSHNAME,
      kshid: pageLayerObj.ID,
      v: vVal,
      layerPosition:
        '{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"opacity":1,"rotate":0,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"chart","cptType":""}',
      sortNum: sortNum
    };
    addOneLayer(addLayerObj)
      .then(res => {
        _this.props.onClickAdd(
          {
            id: layerObj.type,
            layerType: "chart",
            text: layerObj.name,
          },
          {
            data: layerObj,
            state: "leftAdd",
            mainKey: res.mainKey,
            sortNum: sortNum
          }
        );
      })
      .catch(error => {
        console.info(error);
      });
  }
 /**
   * @description: 基本设置和数据设置之间的切换
   * @param {Integer} key 表示当前是那个设置
   * @return:
   */
  switchTabs = (key) => {
    this.setState(
      {
        tabsKey: parseInt(key)
      });
  }
  /**
   * 从xml中解析类型
   */
  selectType = (renderer) =>{
    var $xmlDoc = $($.parseXML(renderer));
    var typeShow = "";
    // 获得节点
    $xmlDoc.find("SIMPLERENDERER").each(function () {
      typeShow = $(this).attr("name");
    });
    return typeShow;
  }
  render() {
    let {tabKeys,cptIndex,ComponentList:listData,componentData,left,top,moveBottom} = this.state;
    return (
      <div className="custom-left-list">
        <div className="custom-left-list-tools">
          <span>图层数据</span>
        </div>
        <div className="custom-left-list-p">
            <Tabs defaultActiveKey='1' size='large' onChange={this.switchTabs}>
                  {tabKeys.map(item => {
                    if (item.serialNumber == 1) {
                      return (
                        <TabPane
                          tab={
                            <span>
                              {item.tabCname}
                            </span>
                          }
                          key={item.serialNumber}>
                            <Collapse expandIconPosition="right" bordered={false}>
                                  {componentData.map((bigDataItem, bigIndex) => {
                                    return (
                                      <Panel header={bigDataItem.service.name} key={bigIndex}>
                                        {bigDataItem.data.map((item, index) => {
                                          let img = 'img/emp/none.png',name = '未识别类型图表';
                                          if (item.thType == '1'){
                                            name = this.selectType(item.renderer);
                                            item.type = name;
                                          }
                                          switch (item.type) {
                                            case "一般点样式":
                                              img = "img/emp/wms_yibandianyangshi.png";
                                              break;
                                            case "栅格点样式":
                                              img = "img/emp/wms_yibandianyangshi.png";
                                              break;
                                            case "字体点样式":
                                              img = "img/emp/wms_yibandianyangshi.png";
                                              break;
                                            case "一般线样式":
                                              img = "img/emp/wms_yibanxianyangshi.png";
                                              break;
                                            case "一般面样式":
                                              img = "img/emp/wms_yibanmianyangshi.png";
                                              break;
                                            case "范围点样式":
                                              img = "img/emp/sLdiv_fanweidian.png";
                                              break;
                                            case "范围线样式":
                                              img = "img/emp/sLdiv_fanweixian.png";
                                              break;
                                            case "范围面样式":
                                              img = "img/emp/sLmap-wms-fanweimianyangshitu.png";
                                              break;
                                            case "精准点样式":
                                              img = "img/emp/wms-jinzhundianyangshitu.png";
                                              break;
                                            case "精准线样式":
                                              img = "img/emp/wms-jingzhunxianyangshi.png";
                                              break;
                                            case "精准面样式":
                                              img = "img/emp/jzm.png";
                                              break;
                                            case "RESULTMAP":
                                              name = '复合图';
                                              img = "img/emp/sLdiv_fuhetu.png";
                                              break;
                                            case "THEMEHALFCIRCLE":
                                              name = '半圆图';
                                              img = "img/emp/sLdiv_banyuan.jpg";
                                              break;
                                            case "THEMEPIE":
                                              name = '饼图';
                                              img = "img/emp/sLmap_bingzhuangtu.jpg";
                                              break;
                                            case "THEMECIRCULAR":
                                              name = '圆环图';
                                              img = "img/emp/sLmap_yuanhuantu.jpg";
                                              break;
                                            case "THEMEFAN":
                                              name = '扇形图';
                                              img = "img/emp/sLmap_shanxingtu.jpg";
                                              break;
                                            case "THEMECIRCLE":
                                              name = '圆形图';
                                              img = "img/emp/sLdiv_yuanxingtu.jpg";
                                              break;
                                            case "THEMEBAR":
                                              name = '柱状图';
                                              img = "img/emp/sLmap_zhuzhuangtu.jpg";
                                              break;
                                            case "THEMESCATTER":
                                              name = '散点图';
                                              img = "img/emp/sLmap_shandian.png";
                                              break;
                                            case "THEMEVERTBAR":
                                              name = '叠加柱状图';
                                              img = "img/emp/sLmap_diejiazhuzhuangtu.png";
                                              break;
                                            case "THEMEGRID":
                                              name = '数据网格图';
                                              img = "img/emp/sLmap_shujugewangtu.jpg";
                                              break;
                                            case "THEMEFANGW":
                                              name = '格网扇形图';
                                              img = "img/emp/sLmap_gewangshanxingtu.jpg";
                                              break;
                                            case "THEMEHALFCIRCLEGW":
                                              name = '格网半圆图';
                                              img = "img/emp/sLmap_gewangbanyuantu.png";
                                              break;
                                            case "THEMECIRCLEGW":
                                              name = '格网圆形图';
                                              img = "img/emp/sLmap_gewangyuanxingtu.png";
                                              break;
                                            case "THEMEPIE_CHART":
                                              name = '一般饼状图';
                                              img = "img/emp/sLdiv_bingzhuangtu.jpg";
                                              break;
                                            case "THEMELINE_CHART":
                                              name = '一般折线图';
                                              img = "img/emp/sLdiv_zhexietu.jpg";
                                              break;
                                            case "THEMEHISTOGRAM":
                                              name = '一般柱状图';
                                              img = "img/emp/sLdiv_zhuzhuangtu.jpg";
                                              break;
                                            case "THEMERING_CHART":
                                              name = '一般圆环图';
                                              img = "img/emp/sLdiv_yibanyuanhuantu.jpg";
                                              break;
                                            case "RLTLayer":
                                              name = '数据热点图';
                                              img = "img/emp/sLdiv_redianshuju.jpg";
                                              break;
                                            case "复合图":
                                              name = '复合图';
                                              img = "img/emp/sLdiv_fuhetu.png";
                                              break;
                                            case "THEMEFUNNEL_CHART":
                                              name = '漏斗图';
                                              img = "img/emp/sLdiv_loudoutu.jpg";
                                              break;
                                            case "THEMEPYRAMID_CHART":
                                              name = '金字塔图';
                                              img = "img/emp/sLdiv_jinzitatu.jpg";
                                              break;
                                            case "THEMEVERTBAR_SORT":
                                              name = '一般叠加柱状图';
                                              img = "img/emp/sLdiv_diejiazhuzhuangtu.jpg";
                                              break;
                                            case "THEMERADAR_CHART":
                                              name = '一般雷达图';
                                              img = "img/emp/sLdiv_leidatu.jpg";
                                              break;
                                            case "THEMEOD":
                                              name = 'OD图';
                                              img = "img/emp/sLmap_odtu.png";
                                              break;
                                            case "PointRLLayer":
                                              name = '点热力图';
                                              img = "img/emp/sLdiv_redianshuju.jpg";
                                              break;
                                            case "3DLINES":
                                              name = '三维线';
                                              img = "img/emp/line.gif";
                                              break;
                                            case "COLORSCALE":
                                              name = '等级颜色图';
                                              img = "img/emp/sLdiv_yansedengji.png";
                                              break;
                                            case "3DBAR":
                                              name = '三维柱';
                                              img = "img/emp/sLdiv_3dzhuzhuangtu.png";
                                              break;
                                            case "GRID":
                                              name = '网格图';
                                              img = "img/emp/gwt.jpg";
                                              break;
                                            case "THEMEDASHBOARD":
                                              name = '仪表盘';
                                              img = "img/emp/sLdiv_yibiaopan.png";
                                              break;
                                            case "THEMEHSANDIAN_CHART":
                                              name = '散点图';
                                              img = "img/emp/sLdiv_sandiantu.png";
                                              break;
                                            case "3DARC":
                                              name = '3D弧形图';
                                              img = "img/emp/sLdiv_3dhuxingtu.png";
                                              break;
                                            case "3Dheatmap":
                                              name = '3D热力图';
                                              img = "img/emp/sLdiv_3Dheatmap.jpg";
                                              break;
                                            case "qipao":
                                              name = '气泡图';
                                              img = "img/emp/qipao.png";
                                              break;
                                            case "路径动画":
                                              name = '路径动画';
                                              img = "img/emp/lujingdonghua.png";
                                              break;
                                            case "等值线图":
                                              name = '等值线图';
                                              img = "img/emp/dengzhixian.png";
                                              break;
                                          }
                                          return (
                                            <div className="showLayerName">
                                              <img className="showLayerName" src={'../'+img} title={name}></img>
                                              <div onClick={this.onClickAdd.bind(this, item)} title={item.name}>
                                                {item.name}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </Panel>
                                    );
                                  })}
                                </Collapse>
                        </TabPane>
                        );
                    } else {
                      return (
                        <TabPane
                          tab={
                            <span>
                             {/*  <Icon type={item.IconEname} /> */}
                              {item.tabCname}
                            </span>
                          }
                          key={item.serialNumber}>
                             <div className="custom-left-list-p-count">
                              <span>图层（{listData ? listData.length : 0}）个</span>{" "}
                            </div>
                            <div className="move-button">
                              {
                                moveBottom.map(item => {
                                    return (
                                      <Button
                                        size="small"
                                        onClick={event => {
                                          this.moveShowLayer(event, item.flag);
                                        }}
                                      key={item.cid}>
                                      {item.cname}
                                      </Button>
                                    )
                                })
                              }
                            </div>
                            <div >
                              {listData
                                ? listData.map((item, layerIndex) => {
                                    return (
                                      <div
                                        key={layerIndex}
                                        style={{
                                          backgroundColor: layerIndex === cptIndex ? "#2483ff" : ""
                                        }}
                                        onClick={event => {
                                          this.props.singleSwitchLayer(event, layerIndex);
                                        }}>
                                        <div className={'custom-left-move-name'}  name={item.key}>
                                          {item.title}
                                        </div>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </TabPane>
                      );
                    }
                  })}
           </Tabs>

        </div>
      </div>
    );
  }
}
export default LeftComponentList;
