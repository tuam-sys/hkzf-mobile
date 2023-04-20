import React from "react";

// 2-嵌套路由
// 2-1-导入路由
import {Route} from 'react-router-dom'
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";
// 导入TabBar
import { TabBar } from 'antd-mobile'

// 导入组件自己的样式文件
import './index.css'

// TabBar 数据
const tabItems = [
    {
      title: '首页',
      icon: 'icon-ind',
      path: '/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/list'
    },
    {
      title: '资讯',
      icon: 'icon-infom',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
]


/**
 * 问题：点击首页导航菜单，导航到 找房列表 页面时，找房菜单没有高亮
 * 
 * 原因：原来我们实现该功能的时候，只考虑了 点击以及第一次加载Home组件的情况，但是，我们没有
 * 考虑不重新加载 Home 组件时的路由切换，因为这种情况下，我们的代码没有覆盖到
 * 
 * 解决：
 *  思路：在 路由切换时，也执行 菜单高亮 的逻辑代码
 *  1 添加 componentDidUpdate 钩子函数
 *  2 在钩子函数中判断路由地址是否切换（因为路由切换的信息是通过props传递给组件的，所以，通过比较更新前后的两个props）
 *  3 在路由地址切换时，让 菜单高亮
 */

export default class Home extends React.Component {
    state = {
        // 默认选中的TabBar菜单项
        selectedTab: this.props.location.pathname
    }

    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }

    // 渲染 TabBar.Item
    renderTabBarItem() {
         return tabItems.map(item => (
                <TabBar.Item
                    title={item.title}
                    key={item.title}
                    icon={<i className={`iconfont ${item.icon}`} />}
                    selectedIcon={<i className={`iconfont ${item.icon}`} />}
                    selected={this.state.selectedTab === item.path}
                    onPress={() => {
                        this.setState({
                            selectedTab: item.path
                        })

                        // 路由切换
                        this.props.history.push(item.path)
                    }}
                >
                </TabBar.Item>
            )
        )
    }

    render() {
        return (
            <div className="home">
                {/* 2-3-渲染子路由 */}
                <Route exact path='/home' component={Index}></Route>
                <Route path='/home/list' component={HouseList}></Route>
                <Route path='/home/news' component={News}></Route>
                <Route path='/home/profile' component={Profile}></Route>

                {/* Tabbar */}
                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    {this.renderTabBarItem()}
                </TabBar>
            </div>
        )
    }
}