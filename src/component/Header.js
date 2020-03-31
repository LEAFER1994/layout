import React, { Component } from "react";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as html2canvas from "html2canvas";
import { addPageImage, addOneOtherLayer, getShareDesc } from "../api/api";
import ShareItemModal from "./ModelCom/ShareItemModal";
import store from "../redux/store";
import "../index.css";
import {
  faCheckSquare,
  faFont,
  faBars,
  faChartBar,
  faChartLine,
  faChartPie,
  faChartArea,
  faEllipsisH,
  faMapPin,
  faTextWidth,
  faTextHeight,
  faBus,
  faOutdent
} from "@fortawesome/fontawesome-free-solid";
import { Button, Tooltip } from "antd";
import "antd/dist/antd.css";
fontawesome.library.add(
  faCheckSquare,
  faFont,
  faBars,
  faChartBar,
  faChartLine,
  faChartPie,
  faChartArea,
  faEllipsisH,
  faMapPin,
  faTextWidth,
  faTextHeight,
  faBus,
  faOutdent
);
let otherDefaultData = require('../datasource/otherDefaultData.json');
class Header extends Component {
  constructor(props) {
    super(props);
    const tempCharsStr = "chart";
    const tempTextStr = "text";
    const tempBorderStr = "border";
    const tempIframeStr = "iframe";
    const otherStr = "otherLayer";
    this.state = {
      shareUrl: "",
      nameData: {},
      otype: "chart",
      ttype: "all",
      chart: {
        all: [
          { id: "jbzt", text: "基本柱图", layerType: "chart" },
          { id: "ddzzt", text: "堆叠柱状图", layerType: "chart" },
          { id: "ddtxt", text: "堆叠条形图", layerType: "chart" },
          { id: "zxzt", text: "折线柱图", layerType: "chart" },
          { id: "zftxt", text: "正负条形图", layerType: "chart" },
          { id: "jtpbt", text: "阶梯瀑布图", layerType: "chart" },
          { id: "jbzxt", text: "基本折线图", layerType: "chart" },
          { id: "ddzxt", text: "基本折线图", layerType: "chart" },
          { id: "pbt", text: "瀑布图", layerType: "chart" },
          { id: "ysfdzxt", text: "颜色分段折线图", layerType: "chart" },
          { id: "jbmjt", text: "基本面积图", layerType: "chart" },
          { id: "ddmjt", text: "堆叠面积图", layerType: "chart" },
          { id: "jbbt", text: "基本饼图", layerType: "chart" },
          { id: "yhbt", text: "圆环饼图", layerType: "chart" },
          { id: "zbzbbt", text: "指标占比饼图", layerType: "chart" },
          { id: "mgt", text: "玫瑰图", layerType: "chart" },
          { id: "qpt", text: "气泡图", layerType: "chart" },
          { id: "sdt", text: "散点图", layerType: "chart" },
          { id: "ldt", text: "雷达图", layerType: "chart" },
          { id: "ldot", text: "漏斗图", layerType: "chart" },
          { id: "ybp", text: "仪表盘", layerType: "chart" },
          { id: "xxzt", text: "象形柱图", layerType: "chart" }
        ],
        bar: [
          { id: "jbzt", text: "基本柱图", layerType: "chart" },
          { id: "ddzzt", text: "堆叠柱状图", layerType: "chart" },
          { id: "ddtxt", text: "堆叠条形图", layerType: "chart" },
          { id: "zxzt", text: "折线柱图", layerType: "chart" },
          { id: "zftxt", text: "正负条形图", layerType: "chart" },
          { id: "jtpbt", text: "阶梯瀑布图" }
        ],
        line: [
          { id: "jbzxt", text: "基本折线图", layerType: "chart" },
          { id: "ddzxt", text: "基本折线图", layerType: "chart" },
          { id: "pbt", text: "瀑布图", layerType: "chart" },
          { id: "ysfdzxt", text: "颜色分段折线图" }
        ],
        area: [
          { id: "jbmjt", text: "基本面积图", layerType: "chart" },
          { id: "ddmjt", text: "堆叠面积图" }
        ],
        pie: [
          { id: "jbbt", text: "基本饼图", layerType: "chart" },
          { id: "yhbt", text: "圆环饼图", layerType: "chart" },
          { id: "zbzbbt", text: "指标占比饼图", layerType: "chart" },
          { id: "mgt", text: "玫瑰图" }
        ],
        other: [
          { id: "qpt", text: "气泡图", layerType: "chart" },
          { id: "sdt", text: "散点图", layerType: "chart" },
          { id: "ldt", text: "雷达图", layerType: "chart" },
          { id: "ldot", text: "漏斗图", layerType: "chart" },
          { id: "ybp", text: "仪表盘", layerType: "chart" },
          { id: "xxzt", text: "象形柱图" }
        ],
        map: [
          { id: "generalPointStyle", text: "点样式", layerType: "map" },
          { id: "generalLineStyle", text: "线样式", layerType: "map" },
          { id: "generalSurfaceStyle", text: "面样式", layerType: "map" }
        ],
        countMap: [
          { id: "mapPie", text: "地图饼状图", layerType: "chartMap" },
          { id: "mapFan", text: "地图扇形图", layerType: "chartMap" },
          { id: "mapBar", text: "地图柱状图", layerType: "chartMap" }
        ]
      },
      otherLayer: {
        text: [
          { id: "singleRowText", text: "单行文本", layerType: "text" },
          { id: "multiLineText", text: "多行文本", layerType: "text" },
          { id: "moreRowText", text: "当前时间", layerType: "text" }
        ],
        border: [{ id: "singleBorder", text: "背景边框", layerType: "border" }],
        iframe: [{ id: "iframeCenter", text: "嵌入页面", layerType: "iframe" }],
        other: [
          { id: 'singleImage', text: '单独图片', layerType: 'image' },
          { id: "baseTable", text: "表格数据", layerType: "table" },
          { id: "iframeCenter", text: "嵌入页面", layerType: "iframe" },
          { id: "singleBorder", text: "背景边框", layerType: "border" },
          { id: "singleDecorate", text: "装饰", layerType: "decorate" }
        ]
      },
      //生成对应的UIstate
      layerDatas: [
        {
          typeName: "chart",
          refName: "basicChart",
          titleName: "基础图表",
          IconObj: faChartBar,
          leftIconLists: [
            {
              prevName: "all",
              thisType: tempCharsStr,
              titleName: "所有",
              IconObj: faBars
            },
            {
              prevName: "bar",
              thisType: tempCharsStr,
              titleName: "柱状图",
              IconObj: faChartBar
            },
            {
              prevName: "line",
              thisType: tempCharsStr,
              titleName: "折线图",
              IconObj: faChartLine
            },
            {
              prevName: "area",
              thisType: tempCharsStr,
              titleName: "面积图",
              IconObj: faChartArea
            },
            {
              prevName: "pie",
              thisType: tempCharsStr,
              titleName: "饼状图",
              IconObj: faChartPie
            },
            {
              prevName: "other",
              thisType: tempCharsStr,
              titleName: "其他",
              IconObj: faEllipsisH
            },
            {
              prevName: "map",
              thisType: tempCharsStr,
              titleName: "地图",
              IconObj: faMapPin
            },
            {
              prevName: "countMap",
              thisType: tempCharsStr,
              titleName: "统计地图",
              IconObj: faMapPin
            }
          ]
        },
        {
          typeName: "otherLayer",
          refName: "otherLayer",
          titleName: "其他图层",
          IconObj: faFont,
          leftIconLists: [
            {
              prevName: "text",
              thisType: otherStr,
              titleName: "文本",
              IconObj: faFont
            },
            /*  {
              prevName: 'border',
              thisType: otherStr,
              titleName: '背景边框',
              IconObj: faBus,
            },
            {
              prevName: 'iframe',
              thisType: otherStr,
              titleName: '嵌套页面',
              IconObj: faBus,
            }, */
            {
              prevName: "other",
              thisType: otherStr,
              titleName: "其他图层",
              IconObj: faOutdent
            }
          ]
        }
      ]
    };
  }

  componentWillReceiveProps(newProps) {
    let nameData = newProps.nameData;
    if (nameData) {
      this.setState({
        nameData: nameData
      });
    }
  }

  /**
   * @description: 添加一个图层到对应的生成content组件的数据里
   * @param {type}
   * @return:
   */
  onClickAdd(layerObj) {
    let layerType = layerObj.layerType;
    let layerId = layerObj.id;
    var comLength = this.props.comLength + 1;
    let defaultShowVal = {};
    if (layerType === "text") {
      let textCenterVal = "标题";
      if (layerId === "multiLineText") {
        textCenterVal = "这是一个可以换行的文本.......";
      } else if (layerId === "moreRowText") {
        textCenterVal = "";
      }
      let tempTextObj = otherDefaultData.text;
      tempTextObj.textCenter.value = textCenterVal;
      defaultShowVal = tempTextObj;
    } else if (layerType === "border") {
      defaultShowVal = otherDefaultData.border;
    } else if (layerType === "iframe") {
      defaultShowVal = otherDefaultData.iframe;
    } else if (layerType === "image") {
      if (layerId === "singleImage") {
        defaultShowVal = otherDefaultData.singleImage;
      }
    } else if (layerType === "table") {
      defaultShowVal = otherDefaultData.table;
    } else if (layerType === "decorate"){
      defaultShowVal = otherDefaultData.decorate;
    }
    let defaultPosition = `{"cptBorderObj":{"width":280,"height":260,"left":450,"top":160,"rotate":0,"opacity":1,"layerBorderWidth":0,"layerBorderStyle":"solid","layerBorderColor":"rgba(0,0,0,1)"},"type":"${layerType}","cptType":"${layerId}"}`;
    defaultShowVal.positionObj = JSON.parse(defaultPosition);
    this.props.onClickAdd(layerObj, {
      data: {},
      state: "headerAdd",
      mainKey: -1,
      sortNum: comLength,
      otherJson: defaultShowVal
    });
    return;
    if (layerType !== "chart") {
      //layerType == 'text' || layerType == 'border' || layerType == 'iframe'
      let shareid = window.parent.document.getElementById("shareID").value;
      let layerName = layerType + comLength;
      // let showOption = store.getState().showLayerDatas.cptOptionsList[layerIndex].layerOption;
      let defaultLayerJson = "";
      defaultLayerJson = JSON.stringify(defaultShowVal);
      let otherData = {
        name: layerName,
        type: layerType,
        tabid: 0,
        shareid: shareid,
        json: defaultLayerJson,
        sortNum: comLength,
        cellTypeId: layerId
      };
      addOneOtherLayer(otherData)
        .then(result => {
          if (result.flag == 1) {
            this.props.onClickAdd(layerObj, {
              data: {},
              state: "headerAdd",
              mainKey: result.mainKey,
              sortNum: comLength,
              otherJson: defaultShowVal
            });
            console.log("图层添加成功");
          }
        })
        .catch(error => console.log(error));
    } else {
      this.props.onClickAdd(layerObj, {
        data: {},
        state: "headerAdd",
        mainKey: -1,
        sortNum: comLength,
        otherJson: defaultShowVal
      });
    }
  }

  handleChartMouseOver(obj) {
    const t = obj.currentTarget.getAttribute("t");
    const thisType = obj.currentTarget.getAttribute("thistype");
    this.setState({
      otype: thisType,
      ttype: t
    });
  }

  handleMenuMouseEnter(item) {
    let ttype = "all";
    let typeName = item.typeName;
    if (typeName == "otherLayer") {
      ttype = "text";
    }
    this.setState({
      otype: typeName,
      ttype: ttype
    });
  }

  savePagePrev = () => {
    this.props.savePagePrev();
  }

  outRollbackPage = () => {
    let _this = this;
    html2canvas(document.querySelector(".custom-content-p")).then(canvas => {
      _this.canvasToImage(canvas);
    });
  }

  canvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    // var kshid = $('.title2-t').attr('id');
    var kshid = this.state.nameData.ID;
    var name = "img" + kshid;
    this.addImg(image.src, name);
  }

  addImg(base64, name) {
    let PageImageObj = {
      base64: base64,
      name: name
    };
    getShareDesc()
      .then(result => {
        let rows = result.rows[0];
        //模拟点击全部可视化
        window.parent.document
          .getElementById("dataShow")
          .contentWindow.shareShow(rows);
        addPageImage(PageImageObj)
          .then(res => {
            this.returnPrePage();
          })
          .catch(error => {
            this.returnPrePage();
            console.info(error);
          });
      })
      .catch(error => console.log(error));
  }
  returnPrePage() {
    let parentDom = window.parent.document;
    let dataShow = parentDom.getElementById("dataShow");
    let dataShowEdit = parentDom.getElementById("dataShowEdit");
    let prevDataShow = dataShow.contentWindow.document;
    let hiddenDiv = prevDataShow.getElementsByClassName("oneDiv");
    if (hiddenDiv && hiddenDiv.length > 0) {
      for (let i = 0; i < hiddenDiv.length; i++) {
        hiddenDiv[i].style.opacity = "1";
      }
    }
    dataShowEdit.style.zIndex = 5;
    dataShow.style.zIndex = 10;
  }
  render() {
    let {ttype,otype,layerDatas} = this.state;
    let showData = [];
    let show = this.state[otype][ttype];
    if (show) {
      showData = show;
    }
    return (
      <div className="custom-header">
        <div className="custom-header-title">
          <Button
            className="outRollback"
            size="small"
            onClick={this.outRollbackPage}
          >
            我的可视化
          </Button>
        </div>
        <div className="custom-header-component">
          <ul className="custom-header-ul">
            {layerDatas.map((item, index) => {
              return (
                /* 顶部目录栏 */
                <li
                  key = {index}
                  className="custom-header-li"
                  onMouseEnter={e => {
                    this.handleMenuMouseEnter(item);
                  }}
                  title={item.titleName}
                  ref={item.refName}
                >
                  <FontAwesomeIcon icon={item.IconObj} />
                  <div className="custom-header-li-c">
                    <table className="custom-header-table">
                      <tbody className="custom-header-tbody">
                        <tr>
                          <td className="custom-header-sub-list left">
                            <ul className="custom-header-sub-ul">
                              {item.leftIconLists.map((iconItem, iconIndex) => {
                                return (
                                  /* 左侧tab栏 */
                                  <li
                                    key={iconIndex}
                                    className="custom-header-sub-li"
                                    t={iconItem.prevName}
                                    thistype={iconItem.thisType}
                                    title={iconItem.titleName}
                                    onMouseOver={this.handleChartMouseOver.bind(
                                      this
                                    )}
                                  >
                                    <div>
                                      <FontAwesomeIcon
                                        icon={iconItem.IconObj}
                                      />
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </td>
                          <td className="custom-header-sub-list">
                            <div className="custom-header-menu-c">
                              <ul className="custom-header-menu-ul">
                                {showData.map((item, i) => {
                                  const c = `custom-header-menu-li-bg ${item.id}bg`;
                                  item["simpleType"] = ttype;
                                  return (
                                    /* 每个具体的组件 */
                                    <li
                                      onClick={this.onClickAdd.bind(this, item)}
                                      className="custom-header-menu-li"
                                      type={item.layerType}
                                      id={item.id}
                                      title={item.text}
                                      key={item.id}
                                    >
                                      <div className={c}></div>
                                      <p className="custom-header-menu-li-txt">
                                        {item.text}
                                      </p>
                                    </li>
                                  );
                                })
                                // :true
                                }
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="custom-header-button">
          <Button
            type="primary"
            size="small"
            onClick={this.savePagePrev}
          >
            预览
          </Button>
        </div>
      </div>
    );
  }
}

export default Header;
