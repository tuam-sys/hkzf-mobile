import React from "react";
// 导入封装好的NavHeader组件

// 导入axios
import axios from "axios";

import NavHeader from '../../components/NavHeader'
// 导入样式
// import './index.scss'
import styles from './index.module.css'
import { Link } from "react-router-dom";
// 导入Toast
import { Toast } from "antd-mobile";

// 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL

// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {
    state = {
        // 小区下的房源列表
        houseList: [],
        isShowList: false
    }
    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap() {
        /* 
            1 获取当前定位城市。
            2 使用地址解析器解析当前城市坐标。
            3 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11。
            4 在地图中展示该城市，并添加比例尺和平移缩放控件。
        */

        // 获取当前地图实例
        const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
        // console.log(label, value)

        // 初始化地图实例
        const map = new BMapGL.Map('container')
        // 作用：能够在其他方法中通过this来获取到地图对象
        this.map = map
        // 设置中心点坐标
        // const point = new window.BMapGL.Point(116.404, 39.915)

        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async (point) => {
            if(point){
                // 初始化地图
                map.centerAndZoom(point, 11);
                // 添加常用控件
                map.addControl(new BMapGL.ZoomControl())
                map.addControl(new BMapGL.ScaleControl())

                // 调用 renderOverlays 方法
                this.renderOverlays(value)
                
                /*  渲染所有区的覆盖物
                    1 获取房源数据。
                    2 遍历数据，创建覆盖物，给每个覆盖物添加唯一标识（后面要用）。
                    3 给覆盖物添加单击事件。
                    4 在单击事件中，获取到当前单击项的唯一标识。
                    5 放大地图（级别为13），调用 clearOverlays() 方法清除当前覆盖物。
                */
                // const res = await axios.get('http://localhost:8080/area/map?id=' + value)
                // // console.log('房源数据：', res)
                // res.data.body.map(item => {
                //     // 为每一条数据创建覆盖物
                //     /*  绘制房源覆盖物
                //         1 调用 Label 的 setContent() 方法，传入 HTML 结构，修改 HTML 内容的样式。
                //         2 调用 setStyle() 修改覆盖物样式。
                //         3 给文本覆盖物添加单击事件。

                //         <div class="${styles.bubble}">
                //         <p class="${styles.name}">${name}</p>
                //         <p>${num}套</p>
                //         </div>
                //     */
                //     const { coord: {longitude, latitude}, label: areaName, count, value } = item
                //     // 创建覆盖物
                //     const areaPoint = new BMapGL.Point(longitude, latitude)
                //     const opts = {
                //         position: areaPoint,
                //         offset: new BMapGL.Size(35, -35)
                //     }

                //     // 说明：设置setContnet后，第一个参数中设置的文本内容就失效了，因此直接清空即可
                //     const label = new BMapGL.Label('', opts)

                //     // 给label对象添加一个唯一标识
                //     label.id = value

                //     // 设置房源覆盖物内容
                //     label.setContent(`<div class="${styles.bubble}">
                //                         <p class="${styles.name}">${areaName}</p>
                //                         <p>${count}套</p>
                //                     </div>`)
                //     // 设置样式
                //     label.setStyle(labelStyle)

                //     // 添加单击事件
                //     label.addEventListener('click', () => {
                //         console.log('房源覆盖物被点击了', label.id)
                //         // 放大地图，以当前点击的覆盖物为中心放大地图
                //         // 第一个参数：坐标对象
                //         // 第二个参数：放大级别
                //         map.centerAndZoom(areaPoint, 13);

                //         // 清除当前覆盖物信息
                //         map.clearOverlays()
                //         // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题  现在已经修复
                //         // setTimeout(() => {
                //         //     // 清除当前覆盖物信息
                //         //     map.clearOverlays()
                //         // }, 0)
                //     })

                //     // 添加覆盖物到地图中
                //     map.addOverlay(label)
                // })
                
            }
        }, label)

        this.map.addEventListener('movestart', () => {
            // console.log('move start')
            if(this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }

    // 渲染覆盖物入口
    // 1 接收区域 id 参数，获取该区域下的房源数据
    // 2 获取房源类型以及下级地图缩放级别
    async renderOverlays(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)
            const res = await axios.get('http://localhost:8080/area/map?id=' + id)
            // 关闭loading
            Toast.hide()
            // console.log('房源数据：', res)
            const data = res.data.body

            // 调用getTypeAndZoom方法获取级别和类型
            const {nextZoom, type} = this.getTypeAndZoom()

            data.forEach(item => {
                // 创建覆盖物
                this.createOverlays(item, nextZoom, type)
            })
        } catch(e) {
            Toast.hide()
        }
    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区   -> 11 ，范围：>=10 <12
    // 镇   -> 13 ，范围：>=12 <14
    // 小区 -> 15 ，范围：>=14 <16
    getTypeAndZoom() {
        // 调用地图的getZoom方法，来获取当前缩放级别
        const zoom = this.map.getZoom()
        let nextZoom, type
        // console.log('当前地图缩放级别', zoom)
        if(zoom >= 10 && zoom < 12) {
            // 区
            nextZoom = 13
            // circle表示绘制圆形覆盖物（区、镇）
            type = 'circle'
        }
        else if(zoom >= 12 && zoom < 14) {
            // 镇
            nextZoom = 15
            type = 'circle'
        }
        else if(zoom >= 14 && zoom < 16) {
            // 小区
            type = 'rect'
        }
        return {
            nextZoom, 
            type
        }
    }

    // 创建覆盖物
    createOverlays(data, zoom, type) {
        const { coord: {longitude, latitude}, label: areaName, count, value } = data
        // 创建坐标对象
        const areaPoint = new BMapGL.Point(longitude, latitude)
        if(type === 'circle') {
            // 区和镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        }
        else {
            // 镇
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建区、镇覆盖物
    createCircle(point, name, count, id, zoom) {
        // 创建覆盖物
        const opts = {
            position: point,
            offset: new BMapGL.Size(35, -35)
        }

        // 说明：设置setContnet后，第一个参数中设置的文本内容就失效了，因此直接清空即可
        const label = new BMapGL.Label('', opts)

        // 给label对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`<div class="${styles.bubble}">
                            <p class="${styles.name}">${name}</p>
                            <p>${count}套</p>
                        </div>`)
        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            // 调用renderOverlays方法，获取该区域下的房源数据
            this.renderOverlays(id)
            // 放大地图，以当前点击的覆盖物为中心放大地图
            // 第一个参数：坐标对象
            // 第二个参数：放大级别
            this.map.centerAndZoom(point, zoom);

            // 清除当前覆盖物信息
            this.map.clearOverlays()
            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题  现在已经修复
            // setTimeout(() => {
            //     // 清除当前覆盖物信息
            //     map.clearOverlays()
            // }, 0)
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }

    // 创建小区覆盖物
    createRect(point, name, count, id) {
        // 创建覆盖物
        const opts = {
            position: point,
            offset: new BMapGL.Size(-50, 28)
        }

        // 说明：设置setContnet后，第一个参数中设置的文本内容就失效了，因此直接清空即可
        const label = new BMapGL.Label('', opts)

        // 给label对象添加一个唯一标识
        // label.id = id

        // 设置房源覆盖物内容
        label.setContent(`<div class="${styles.rect}">
                            <span class="${styles.housename}">${name}</span>
                            <span class="${styles.housenum}">${count}套</span>
                            <i className="${styles.arrow}"></i>
                        </div>`)
        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', e => {
            /* 
                1 创建 Label 、设置样式、设置 HTML 内容，绑定单击事件。
                
                2 在单击事件中，获取该小区的房源数据。
                3 展示房源列表。
                4 渲染获取到的房源数据。

                5 调用地图 panBy() 方法，移动地图到中间位置。
                    公式：
                        垂直位移：(window.innerHeight - 330) / 2 - target.clientY
                        水平平移：window.innerWidth / 2 - target.clientX
                6 监听地图 movestart 事件，在地图移动时隐藏房源列表。
            */
            this.getHouseList(id)

            // 获取当前被点击项
            // 通过调用获取事件DOM对象的 获取在视口区域的位置
            const { x, y } = e.target.domElement.getBoundingClientRect()
            this.map.panBy(window.innerWidth / 2 - x, (window.innerHeight - 330) / 2 - y)

        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }

    // 获取小区的房源数据
    async getHouseList(id) {
        try {
            // 开启loading
            Toast.loading('加载中', 0, null, false)
            const res = await axios.get('http://localhost:8080/houses?cityId=' + id)
            // 关闭loading
            Toast.hide()
            // console.log('小区的房源数据', res)
            this.setState({
                houseList: res.data.body.list,
                isShowList: true
            })
        } catch(e) {
            // 关闭loading
            Toast.hide()
        }
    }

    // 封装渲染房屋列表的方法
    renderHouseList() {
        return this.state.houseList.map(item => (
                <div className={styles.houses} key={item.houseCode}>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <div className={styles.desc}>{item.desc}</div>
                        <div>
                            {item.tags.map((tag, index) => {
                                const tagClass = 'tag' + (index + 1)
                                return (
                                    <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>{tag}</span>
                                )
                            })}
                        </div>
                        <div className={styles.price}>
                            <span className={styles.priceNum}>{item.price}</span> 元/月
                        </div>
                    </div>
                </div>
            ))
    }

    render() {
        return <div className={styles.map}>
            {/* <div className={styles.test}>测试样式覆盖问题</div> */}
            {/* 顶部导航栏组件 */}
            <NavHeader>地图找房</NavHeader>
            {/* 地图容器元素 */}
            <div id="container" className={styles.container}></div>

            {/* 房源列表 */}
            <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <Link className={styles.titleMore} to="/home/list">更多房源</Link>
                </div>

                <div className={styles.houseItem}>
                    {/* 房屋结构 */}
                    {this.renderHouseList()}
                </div>
            </div>
        </div>
    }
}