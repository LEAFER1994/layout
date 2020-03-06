/*
 * @Author: your name
 * @Date: 2020-01-06 12:08:04
 * @LastEditTime: 2020-02-28 18:10:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \layout\src\utils\chart.js
 */
import store from '../redux/store';
import {getSpecify} from '../api/api';
// import dmapgl  from './dmap-gl-dev.js';
import {
    addCptOptionsList,
    editCptOptionsList
} from '../redux/actions/showLayerDatas';

let chartTestData = require('../datasource/chartTestData.json');
let mapTestData = require('../datasource/mapTestData.json');
// import 'http://172.26.50.89/TileServer/dmap4.0/css/dmap4.0.css';

const chartData = require('../datasource/chartDatas.json');
/**
 * @description: 创建一个对应的图表
 * @param  {String} chartName 图标的拼音首字母小写
 * @param  {Number} id 生成的图表对应的当前时间戳的id
 * @param  {Layout} _this  代表layout组件的this
 * @param  {String} chartState 代表当前图表是改变数据还是不改变数据   noUpdate不改变数据   update 改变数据
 * @return:  正常添加一个图表,否则就是移动位置改变大小，如果没有找到当前图表对应的接口id直接返回
 */
export function chartOption(chartName, id, _this, chartState,otherObj) {
    var arr = window.arr ? window.arr : [];
    var mapObjArr = window.mapObjArr ? window.mapObjArr : [];
    var flag = false; //是否存在
    var addIndex = _this.state.cptChartIdList.length-1;
     //如果存在进行更新大小或者替换数据,不存在请求数据加载图层
    if (arr) {
        arr.forEach(function (e, item) {
            if (e == id) {
                flag = true;
                return false;
            }
        });
    }
    if(otherObj&&otherObj.state=="leftAdd"){
        let layerObj = otherObj.data;
        if (!flag) {
            arr.push(id);
            window.arr = arr;
            addChart(layerObj,id,addIndex,_this);     
        }else{
                let newOptions = store.getState().showLayerDatas.cptOptionsList[_this.state.cptIndex].layerOption;
                let tempThisObj = document.getElementById(id);

                var thType = layerObj.thType;
                if("0" == thType){//图表
                    var e_instance = tempThisObj.getAttribute("_echarts_instance_");
                    if (chartState == "update") {
                        new window.dmapgl.commonlyCharts(id, {
                            data: newOptions
                        });
                    } else {
                        if(window.echarts.getInstanceById(e_instance)){
                            window.echarts.getInstanceById(e_instance).resize();
                        }
                    }
                }else if("1" == thType){//wms或wfs
                    let mapObj = mapObjArr[_this.state.cptIndex]
                    if(mapObj&&mapObj.layerId == id){
                        if (chartState == "update") {
                                
                        } else {
                            if(mapObj.layerMap){
                                mapObj.layerMap.resize();
                            }
                        }
                    }
                }      
        }
    }else{
        let layerType = "chart";
        let chartId = 101;
        chartData.map(item => {
            if (item.id == chartName) {
                layerType = item.layerType;
                chartId = item.chartId;
            }
        })
        var layerObj = document.getElementById(id).parentNode;
        if (!flag) {
            if(layerType=="text"||layerType=="border"||layerType=="iframe"){
                arr.push(id);
                mapObjArr.push({
                    layerId: id,
                    layerMap: {}
                });
                window.arr = arr;
                window.mapObjArr = mapObjArr;
                let tempSaveObj = {};
                if(layerType=="border"){
                    // layerObj.style.border = "1px solid red";
                    layerObj.style.borderWidth = '1px';
                    layerObj.style.borderStyle = 'solid';
                    layerObj.style.borderColor = 'red';
                    tempSaveObj = {
                        borderWidth:'1',
                        borderStyle:'solid',
                        borderColor:'rgba(255, 47, 3 ,1)'
                    }
                }else if(layerType=="text"){
                    tempSaveObj = {
                        textCenter:'标题',
                        fontFamily:'auto',
                        fontSize:30,
                        fontColor:'rgba(255,255,255,1)',
                        fontWeight:'normal',
                        textAlign:"center",
                        writingMode:"horizontal-tb",
                        hyperlinkCenter:"",
                        isNewWindow:false,
                    };
                }else if(layerType=="iframe"){
                    tempSaveObj = {
                        iframeUrl:""
                    }
                }
                store.dispatch(addCptOptionsList(chartId,tempSaveObj));
                _this.updateGlobalEditData();
            }else if(layerType=="chart"||layerType=="map"||layerType=="chartMap"){
                        let tempIndex = Math.ceil(Math.random()*3)-1;
                        var data = chartTestData[tempIndex];
                        var a;
                        var map;
                        var tempMap = null;
                        if (layerType == "map"||layerType=="chartMap") {
                            store.dispatch(addCptOptionsList(chartId, []))
                            map = new window.dmapgl.Map({
                                container :id,
                                zoom : 8,
                                minZoom : 8,
                                maxZoom : 20,
                                fadeDuration : 0,
                                center : [ 503428.7804260254, 345586.30670166016 ],
                                preserveDrawingBuffer:true,
                                style : 'zyzx://formal_blue/styles/style.json',
                                //style : 'zyzx://zhengwu20181130/p12/resources/styles/root-'+theme+'.json', //verctor_20180717   zhengwu_light  zhengwu_streets  zhengwu_dark
                                //localIdeographFontFamily : ' "Microsoft YaHei Bold","Microsoft YaHei Regular","SimSun,Regular"',
                            });
                            map.on('load', function() {
                                getSpecify(chartId).then(result => {
                                    let tempOptionObj = {
                                        cptIndex:addIndex,
                                        layerOption:result
                                      }
                                      store.dispatch(editCptOptionsList(tempOptionObj));
                                      _this.updateGlobalEditData();
                                }).catch(error => {
                                    console.info(error);     
                                });
                            });
                        } else if (layerType == "chart") {
                                a = new window.dmapgl.commonlyCharts(id, {
                                    data: data
                                });
                                store.dispatch(addCptOptionsList(chartId, data))
                        }
                        arr.push(id);
                        mapObjArr.push({
                            layerId: id,
                            layerMap: map
                        });
                        window.arr = arr;
                        window.mapObjArr = mapObjArr;
            }else{
                
            }
        } else {
            if(layerType=="text"||layerType=="border"){
                
            }else if(layerType=="chart"||layerType=="map"||layerType=="chartMap"){
                let newOptions = store.getState().showLayerDatas.cptOptionsList[_this.state.cptIndex].layerOption;
                let tempThisObj = document.getElementById(id);
                if (layerType == "chart") {
                    var e_instance = tempThisObj.getAttribute("_echarts_instance_");
                    if (chartState == "update") {
                        new window.dmapgl.commonlyCharts(id, {
                            data: newOptions
                        });
                    } else {
                        if(window.echarts.getInstanceById(e_instance)){
                            window.echarts.getInstanceById(e_instance).resize();
                        }
                    }
                } else if (layerType == "map"||layerType=="chartMap") {
                    let mapObj = mapObjArr[_this.state.cptIndex]
                    if(mapObj.layerId == id){
                        if (chartState == "update") {
                                
                        } else {
                            if(mapObj.layerMap){
                                mapObj.layerMap.resize();
                            }
                        }
                    }
                }     
            }else{
                
            }
        }
    }
}




export function showChartsOption(chartsList){
    if(chartsList&&chartsList[0]){
        var arr = window.arr ? window.arr : [];
        var mapObjArr = window.mapObjArr ? window.mapObjArr : [];
        chartsList.map((item,index) => {
            let data = item.layerObj;
            let thType  = item.thType;
            let chartId = item.chartId;
            let layerData = item.layerData;
            let timeKey = item.timeKey.toString();
            let map = {};
            if(thType=="0"){
                store.dispatch(addCptOptionsList(chartId, []));
                getSpecify(chartId)
                        .then(function (result) {
                            if(result.data){
                                console.log("接口没有数据")
                            }else{
                                if(result&&result[0]){
                                    new window.dmapgl.commonlyCharts(timeKey, {
                                        data: result
                                    });
                                }
                            }
                            let tempOptionObj = {
                                cptIndex:index,
                                layerOption:result
                            }
                            store.dispatch(editCptOptionsList(tempOptionObj));
                        
                }).catch(e => console.log("error", e)); 
            }else if(thType=="1"){
                let dataShow = data.show;
                map = new window.dmapgl.Map({
                    container :timeKey,
                    zoom : 8,
                    minZoom : 8,
                    maxZoom : 20,
                    fadeDuration : 0,
                    center : [ 503428.7804260254, 345586.30670166016 ],
                    preserveDrawingBuffer:true,
                    style : 'zyzx://formal_blue/styles/style.json',
                    //style : 'zyzx://zhengwu20181130/p12/resources/styles/root-'+theme+'.json', //verctor_20180717   zhengwu_light  zhengwu_streets  zhengwu_dark
                    //localIdeographFontFamily : ' "Microsoft YaHei Bold","Microsoft YaHei Regular","SimSun,Regular"',
                });
                store.dispatch(addCptOptionsList(chartId, []));
                if(dataShow == "1"||dataShow == "2"){
                    map.on('load', function() {
                        getSpecify(chartId).then(result => {
                            let tempOptionObj = {
                                cptIndex:index,
                                layerOption:result
                              }
                             store.dispatch(editCptOptionsList(tempOptionObj));
                        }).catch(error => {
                            console.info(error);     
                        });
                    });
                }
            }else if(thType=="text"||thType=="border"||thType=="iframe"){
                let tempSaveObj = {};
                if(thType=="border"){
                    var layerObj = document.getElementById(timeKey).parentNode;
                    layerObj.style.borderWidth = layerData.borderWidth+"px";
                    layerObj.style.borderStyle = layerData.borderStyle;
                    layerObj.style.borderColor = layerData.borderColor;
                    tempSaveObj = {
                        borderWidth:layerData.borderWidth,
                        borderStyle:layerData.borderStyle,
                        borderColor:layerData.borderColor
                    }
                }else if(thType=="text"){
                    tempSaveObj = {
                        textCenter:layerData.textCenter,
                        fontFamily:layerData.fontFamily,
                        fontSize:layerData.fontSize,
                        fontColor:layerData.fontColor,
                        fontWeight:layerData.fontWeight,
                        textAlign:layerData.textAlign,
                        writingMode:layerData.writingMode,
                        hyperlinkCenter:layerData.hyperlinkCenter,
                        isNewWindow:layerData.isNewWindow,
                    };
                }else if(thType=="iframe"){
                    tempSaveObj = {
                        iframeUrl:layerData.iframeUrl,
                    }
                }
                store.dispatch(addCptOptionsList(chartId,tempSaveObj));
            } 
            arr.push(timeKey);
            mapObjArr.push({
                layerId: timeKey,
                layerMap:map
            });  
              
        })
        window.mapObjArr = mapObjArr;
        window.arr = arr;
    }
}

/**
 * 添加图表
 * @param data 图表数据
 * @param n 序号
 */
function addChart(data,timeId,addIndex,_this){
    var thType = data.thType;
    var catalogId = data.id;
    var map = {};
	if("0" == thType){//图表
		var type1 = data.type?data.type:'';//图表类型（饼、柱。。等）
		// if('THEMEPIE_CHART' == type1 ||'THEMERING_CHART' == type1 ){
			/*
			 * 一般图表
			 * THEMEPIE_CHART（一般饼状图）
			 * THEMERING_CHART（一般圆环图）
			 */
            store.dispatch(addCptOptionsList(catalogId, []))
			getSpecify(catalogId).then(result => {
                var a = new window.dmapgl.commonlyCharts(timeId,{data:result});
                let tempOptionObj = {
                    cptIndex:addIndex,
                    layerOption:result
                  }
                 store.dispatch(editCptOptionsList(tempOptionObj));
                 _this.updateGlobalEditData();
            }).catch(error => {
                console.info(error);     
            });
		// }
	}else if("1" == thType){//wms或wfs
        var service = data.service;
		var layername = data.layername;
		var name = data.name;
		var renderer = data.renderer?data.renderer:'';//wms样式
		map = new window.dmapgl.Map({
			container :timeId,
			zoom : 8,
			minZoom : 8,
			maxZoom : 20,
			fadeDuration : 0,
			center : [ 503428.7804260254, 345586.30670166016 ],
			preserveDrawingBuffer:true,
			style : 'zyzx://formal_blue/styles/style.json',
			//style : 'zyzx://zhengwu20181130/p12/resources/styles/root-'+theme+'.json', //verctor_20180717   zhengwu_light  zhengwu_streets  zhengwu_dark
			//localIdeographFontFamily : ' "Microsoft YaHei Bold","Microsoft YaHei Regular","SimSun,Regular"',
        });
        store.dispatch(addCptOptionsList(catalogId, []))
		if(data.show == "1"||data.show == "2"){
			map.on('load', function() {
                getSpecify(catalogId).then(result => {
                    let tempOptionObj = {
                        cptIndex:addIndex,
                        layerOption:result
                      }
                     store.dispatch(editCptOptionsList(tempOptionObj));
                     _this.updateGlobalEditData();
                     initMapData(map,result);
                }).catch(error => {
                    console.info(error);     
                });
    		});
		}
    }
    var mapObjArr = window.mapObjArr ? window.mapObjArr : [];
    mapObjArr.push({
        layerId: timeId,
        layerMap:map
    });
    window.mapObjArr = mapObjArr;
}

/**
 * 将地图加载完之后,加载地图上面的数据
 * @param map 地图对象
 * @param data 地图加载的数据
 */
function initMapData(map,data){
    var userName = getCookie("userName");
	 /* var renderer = data.renderer;
 	var layername = userName+"."+data.layername;
	var rxml = $.parseXML(renderer);
	var group1 = $(rxml).find('GROUPRENDERER');
    var tagName = group1[0].firstChild.tagName;
    if('GROUPRENDERER' == tagName){

    }else{

    } */
}

//获取相应cookie的值
function getCookie(cookie_name){
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);//索引的长度
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1){
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;//这里容易出问题，所以请大家参考的时候自己好好研究一下
        var cookie_end = allcookies.indexOf(";", cookie_pos);
  
        if (cookie_end == -1){
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
    }
    return value;
}