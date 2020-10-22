/*
 * @Author: your name
 * @Date: 2020-03-20 09:37:00
 * @LastEditTime: 2020-03-26 16:30:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \layout\src\component\otherLayer\TextLayer.js
 */
import React, { Component } from 'react';
import FullScreen from './interactionLayer/FullScreen';
import Button from './interactionLayer/Button';
class InteractionLayer extends Component {
    static defaultProps = {
        layerData : {},
        layerSinId : "",
        timeKey : ""
    }

    constructor(props) {
        super(props);
        this.state = {
         }
    }
    render() {
       let {layerData,layerSinId} = this.props;
       if(layerSinId==="fullScreen"){
            return <FullScreen  layerData={layerData}  />
        }else if(layerSinId==="button"){
           return <Button  layerData={layerData}  />
       }else{
         return null
       }
    }

}

export default InteractionLayer;