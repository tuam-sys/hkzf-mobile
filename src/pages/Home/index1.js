import React from "react";

// 2-嵌套路由
// 2-1-导入路由
import {Route} from 'react-router-dom'
// 2-2-导入组件
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";
// 导入TabBar
// import { TabBar } from 'antd-mobile'
import {Bottom} from '../../components/TabBar/index.js'

export default class Home extends React.Component {
    state = {
        // 默认选中的TabBar菜单项
        selectedTab: 'redTab',
        // 用于控制TabBar的展示和隐藏。这个值应该是false，也就是不隐藏！
        hidden: false,
        // 全屏
        fullScreen: false
    }

    // 渲染每个 TabBar.Item 的内容


    render() {
        return (
            <div>
                {/* 2-3-渲染子路由 */}
                <Route path='/home/index' component={Index}></Route>
                <Route path='/home/list' component={HouseList}></Route>
                <Route path='/home/news' component={News}></Route>
                <Route path='/home/profile' component={Profile}></Route>

                {/* Tabbar */}
                <Bottom></Bottom>
                
            </div>
        )
    }
}