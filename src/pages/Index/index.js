import React from "react";
// 导入组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// 导入axios
import axios from 'axios'
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式文件
import './index.scss'

// 导入utils中获取当前定位城市的方法
import { getCurrentCity } from "../../utils";

// 导航菜单数据
const navs=[{
    id:1,
    img:Nav1,
    title:"整租",
    path:"/home/list"
},{
    id:2,
    img:Nav2,
    title:"合租",
    path:"/home/list"
},{
    id:3,
    img:Nav3,
    title:"地图找房",
    path:"/home/list"
},{
    id:4,
    img:Nav4,
    title:"去出租",
    path:"/home/list"
}]

/*
    轮播图存在的两个问题：
    1 不会自动播放
    2 从其他路由返回的时候，高度不够

    原因：轮播图数据是动态加载的，加载完成前后轮播图数量不一致

    如何解决？？？
        1 在state中添加表示轮播图加载完成的数据
        2 在 轮播图数据加载完成时，修改该数据状态为 true
        3 只有在轮播图数据加载完成的情况下，才渲染 轮播图组件
*/

// 获取地理位置信息
// console.log(navigator.geolocation)
navigator.geolocation.getCurrentPosition(position => {
    console.log('hhh')
    console.log('当前位置信息：', position)
})

export default class Index extends React.Component {
    state = {
        // 轮播图状态数据
        swipers: [],
        isSwiperLoaded: false,

        // 租房小组数据
        groups: [],
        //最新资讯数据
        news: [],
        // 当前城市名称
        curCityName: '上海'
    }

    // 获取轮播图数据的方法
    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState(() => {
            return {
                swipers: res.data.body,
                isSwiperLoaded: true
            }
        })
    }

    // 获取租房小组数据
    async getGroups() {
        // const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        // 与上等同
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        // console.log(res)
        this.setState({
            groups: res.data.body
        })
    }

    // 获取最新资讯数据
    async getNews() {
        const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        // console.log(res)
        this.setState(() => {
            return {
                news: res.data.body
            }
        })
    }

    async componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        // 通过 IP 定位获取到当前城市名称
        // var curCity = new window.BMapGL.LocalCity();
        // curCity.get(async res => {
        //     // console.log('当前城市信息：', res)
        //     const result = await axios.get('http://localhost:8080/area/info?name=' + res.name)
        //     // console.log(result)
        //     this.setState({
        //         curCityName: result.data.body.label
        //     })
        // })

        const curCity = await getCurrentCity()
        this.setState({
            curCityName: curCity.label
        })
    }

    // 渲染轮播图
    renderSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://itcast.cn"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }

    // 渲染导航菜单
    renderNavs() {
        return navs.map(item => <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
            <img src={item.img} alt=""/>
            <h2>{item.title}</h2>
        </Flex.Item>
        )
    }

    // 渲染最新资讯
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" className="img" />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }

    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {
                        this.state.isSwiperLoaded
                            ? (
                                <Carousel
                                    //自动播放
                                    autoplay
                                    infinite
                                >
                                    {this.renderSwipers()}
                                </Carousel>
                            )
                            : ('')
                    }

                    {/* 搜索框 */}
                    <Flex className="search-box">
                        {/* 左侧白色区域 */}
                        <Flex className="search">
                            {/* 位置 */}
                            <div className="location" onClick={() => this.props.history.push('/citylist')}>
                                <span className="name">{this.state.curCityName}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            {/* 搜索表单 */}
                            <div className="form" onClick={() => this.props.history.push('/search')}>
                                <i className="iconfont icon-search"></i>
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        {/* 右侧地图图标 */}
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
                    </Flex>
                </div>
                {/* 导航菜单 */}
                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">
                        租房小组 <span className="more">更多</span>
                    </h3>
                    <Grid columnNum={2} square={false} hasLine={false} renderItem={item =>(
                            <Flex className='group-item' justity="around" key={item.id}>
                                <div className='desc'>
                                    <p className='title'>
                                        {item.title}
                                    </p>
                                    <span className='info'> 
                                        {item.desc}
                                    </span>
                                </div>
                                <img src={`http://localhost:8080${item.imgSrc}`}/>
                            </Flex>
                        )} data={this.state.groups} activeStyle={true} />
                </div>

                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title"></h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>

            </div>
        );
    }
}