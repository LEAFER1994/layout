//let otherDefaultData = require('../datasource/otherDefaultData.json');
export function getDefaultLayerData(layerType,layerId) {
    let returnObj = {};
    let isDefault = false;
    //let defaulaData = otherDefaultData[layerType];
    if (layerType === "text") {
        let tempTextObj = {
            "textCenter": {
                "value": "标题"
            },
            "dataSourceUrl":"",
            "dataSourceUrlFlag":false,
            "backgroundColor": "rgba(255,255,255,0)",
            "fontFamily": "auto",
            "fontSize": 30,
            "fontColor": "rgba(255,255,255,1)",
            "fontWeight": "normal",
            "textAlign": "center",
            "writingMode": "horizontal-tb",
            "title":"",
            "titleFlag":false,
            "playSpeed": 4,
            "playFlag": false,
            "precision":0,
            "precisionFlag":false,
            "prefix":"",
            "prefixFlag":false,
            "suffix":"",
            "suffixFlag":false,

        };
      let textCenterVal = "标题";
      if (layerId === "multiLineText") {
        textCenterVal = "这是一个可以换行的文本.......";
      } else if (layerId === "moreRowText") {
        textCenterVal = "";
      }else if(layerId === "rollText"){
          textCenterVal = "滚动文字.......";
          //tempTextObj['playSpeed'] = 4;
          tempTextObj['playFlag'] = true;
      }else if(layerId === "Statistic"){
          textCenterVal = "123456";
          tempTextObj['titleFlag'] = true;
          tempTextObj['precisionFlag'] = true;
          tempTextObj['prefixFlag'] = true;
          tempTextObj['suffixFlag'] = true;
      }

      tempTextObj.textCenter.value = textCenterVal;
      returnObj = tempTextObj;
    } else if (layerType === "media") {
      if(layerId === "iframeCenter"){
        returnObj = {
            "iframeUrl": ""
        };
      }else if (layerId === "singleImage") {
        returnObj = {
            "backgroundImage": "https://img.alicdn.com/tfs/TB1J3GkgeH2gK0jSZJnXXaT1FXa-600-360.png",
            "repeat": "no-repeat",
            "radius": 0,
            "urlConfig": {
                "url": "",
                "ifBlank": true
            }
        };
      }else if (layerId === "singleVideo") {
          returnObj = {
              "url": "",
              "autoplay": true,
              "loop": true,
              "controls": true,
              "muted": false
          };
      }else{
          isDefault = true;
      }
    } else if (layerType === "table"){
      if (layerId === "baseTable") {
        returnObj = {
            "data": [{
                "name": "John Brown",
                "age": 32,
                "address": "家"
            }, {
                "name": "Jim Green",
                "age": 42,
                "address": "家"
            }, {
                "name": "Joe Black",
                "age": 32,
                "address": "家"
            }],
            "columns": [{
                "title": "Name",
                "dataIndex": "name"
            }, {
                "title": "Age",
                "dataIndex": "age"
            }, {
                "title": "Address",
                "dataIndex": "address"
            }],
            "config": {
                "table": {
                    "header": {
                        "textAlign": "center",
                        "textStyle": {
                            "fontFamily": "Microsoft Yahei",
                            "fontWeight": "bold",
                            "fontSize": 14,
                            "color": "#983e3e"
                        },
                        "borderStyle": {
                            "width": 2,
                            "color": "#fff"
                        },
                        "backgroundColor": "#1d232c",
                        "lineHeight": 42
                    },
                    "pageSize": 1,
                    "textStyle": {
                        "fontFamily": "Microsoft Yahei",
                        "fontWeight": "bold",
                        "fontSize": 14,
                        "color": "#983e3e"
                    },
                    "ZebraLine": {
                        "isZebra": false,
                        "backgroundColor": "#3c8d40",
                        "lineHeight": 20,
                        "textAlign": "center"
                    },
                    "zebraBackground": "rgba(4, 25, 40, 0.18)",
                    "borderStyle": {
                        "width": 1,
                        "color": "#983e3e"
                    },
                    "padding": {
                        "top": 12,
                        "bottom": 12,
                        "left": 16,
                        "right": 16
                    }
                },
                "pagination": {},
                "columns": {}
            }
        };
      }else{
          isDefault = true;
      }
    } else if (layerType === "interaction") {
      if (layerId === "fullScreen") {
        returnObj = {
            "color":"rgba(255,255,255,1)",
            "size":50
        };
      }else if (layerId === "button") {
          returnObj = {
              "text": "按钮",
              "bgcolor":"rgba(1,170,237,1)",
              "font": {
                  "family": "Microsoft Yahei",
                  "size": 30,
                  "color": "#983e3e",
                  "weight": "bold",
                  "textAlign": "center",
                  "writingMode": "horizontal-tb"
              },
              "hyperlink": {
                  "url": "",
                  "isNewWindow": true
              }
          };
      }else{
          isDefault = true;
      }
    } else if (layerType === "material"){
      if(layerId === "singleBorder"){
        returnObj = {
            "borderImage": "border/border1.png",
            "borderWidth": 10
        };
      }else if (layerId === "singleDecorate") {
        returnObj = {
            "decorateImage": "decorate/zs1.gif"
        };
      }else if(layerId === 'singleIcon'){
          returnObj = {
              "iconImage": "chart-bar",
              "iconColor": "rgba(10,115,255,1)"
          };
      }else if(layerId === 'singleLiquid'){
          returnObj = {
              "textCenter": {
                  "value": 25.00
              },
              "url":"",
              "format": "百分比",
              "font": {
                  "size": 60,
                  "color": "rgba(255,255,255,1)"
              },
              "liquid": {
                  "fill": "rgba(111,149,247,1)",
                  "stroke": "rgba(88,131,247,1)",
                  "lineWidth": 1
              }
          };
      }else if(layerId === 'singleGauge'){
          returnObj = {
              "textCenter": {
                  "value": 75.00
              },
              "url":"",
              "format": "进度",
              "font": {
                  "size": 60,
                  "color": "rgba(255,255,255,1)"
              },
              "gauge": {
                  "beginColor": "rgba(180,226,255,1)",
                  "endColor": "rgba(149,152,255,1)"
              }
          };
      }else if(layerId === 'singleRingProgress'){
          returnObj = {
              "textCenter": {
                  "value": 75.00
              },
              "url":"",
              "format": "进度",
              "font": {
                  "size": 60,
                  "color": "rgba(255,255,255,1)"
              },
              "ringProgress": {
                  "radius":0.98,
                  "innerRadius":0.85,
                  "fill": "rgba(81,126,247,1)",
                  "stroke": "rgba(81,126,247,1)",
                  "lineWidth": 1
              }
          };
      }else if(layerId === 'singleBarProgress'){
          returnObj = {
              "textCenter": {
                  "value": 75.00
              },
              "url":"",
              "barProgress": {
                  "status":"normal",
                  "strokeColor": "rgba(81,126,247,1)",
                  "strokeWidth": 10
              }
          };
      }else{
          isDefault = true;
      }
    }
    if(isDefault){
      returnObj = {
          "textCenter": {
              "value": "标题"
          },
          "fontFamily": "auto",
          "fontSize": 30,
          "fontColor": "rgba(255,255,255,1)",
          "fontWeight": "normal",
          "textAlign": "center",
          "writingMode": "horizontal-tb",
          "hyperlinkCenter": "",
          "isNewWindow": false
      };
    }
    return returnObj;
}