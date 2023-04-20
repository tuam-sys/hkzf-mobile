import React from "react";
// 导入axios
import axios from "axios";
// 导入NavBar
import { Toast } from "antd-mobile";
// 导入List组件
import {List, AutoSizer} from 'react-virtualized'
// 导入NavHeader组件
import NavHeader from "../../components/NavHeader";
// 导入样式
import './index.scss'
// 导入CSSModules的文件
import styles from './index.module.css'


// 导入utils中获取当前定位城市的方法
import { getCurrentCity } from "../../utils";


// 数据格式化的方法
// list: [{}, {}]
const formatCityData = (list) => {
    const cityList = {}
    // const cityIndex = []

    // 1 遍历list数组
    list.forEach(item => {
        // 2 获取每一个城市的首字母
        const first = item.short.substr(0, 1)
        // console.log(first)
        // 3 判断cityList是否有该分类
        if(cityList[first]) {
            // 4 如果有，直接往该分类中push数据
            cityList[first].push(item)
        }
        else {
            // 5 如果没有，就先创建一个数组，然后把当前城市信息添加到数组中
            cityList[first] = [item]
        }
    })
    // console.log(cityList)
    // 获取索引数据
    const cityIndex = Object.keys(cityList).sort()
    // console.log(cityIndex)
    return {
        cityList,
        cityIndex
    }
}

/* 渲染城市列表数据
  1 将获取到的 cityList 和 cityIndex  添加为组件的状态数据。
  2 修改 List 组件的 rowCount 为 cityIndex 的长度。
  3 将 rowRenderer 函数，添加到组件中，以便在函数中获取到状态数据 cityList 和 cityIndex。
  4 修改 List 组件的 rowRenderer 为组件中的 rowRenderer 方法。
  5 修改 rowRenderer 方法中渲染的每行结构和样式。
  6 修改 List 组件的 rowHeight 为函数，动态计算每一行的高度（因为每一行高度都不相同）。
  
  <div key={key} style={style} className="city">
    <div className="title">S</div>
    <div className="name">上海</div>
  </div>
*/

/* react-virtualized 基本使用
  1 安装：yarn add react-virtualized 。
  2 在项目入口文件 index.js 中导入样式文件（只导入一次即可）。
  3 打开文档，点击 List 组件，进入 List 的文档中。
  4 翻到文档最底部，将示例代码拷贝到项目中。
  5 分析示例代码。
*/
// 列表数据的数据源
// const list = Array(100).fill('react-virtualized')

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
    switch(letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            // 指定右侧字母索引列表高亮的索引号
            activeIndex: 0
        }
        
        // 创建ref对象
        this.cityListComponent = React.createRef()
    }
    
    // 获取城市列表数据
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        // console.log('城市列表数据：', res)
        const {cityList, cityIndex} = formatCityData(res.data.body)

        /* 
        1 获取热门城市数据
        2 将数据添加到 cityList 中
        3 将索引添加到 cityIndex 中
        */
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        // console.log('热门城市数据：', hotRes)
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')

        // 获取当前定位城市
        const curCity = await getCurrentCity()

        /* 
        1 将当前定位城市数据添加到 cityList 中
        2 将当前定位城市的索引添加到 cityIndex 中
        */
        cityList['#'] = [curCity]
        cityIndex.unshift('#')
        // console.log(cityIndex, cityList, curCity)
        this.setState({
            cityList: cityList,
            cityIndex: cityIndex
        })
    }

    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在 List 中是可见的
        style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
        }) => {
        // 获取每一行的字母索引
        const {cityIndex, cityList} = this.state
        const letter = cityIndex[index]
        // console.log(letter)
        // 获取指定字母索引下的城市列表数据
        // console.log(cityList[letter])

        return (
        <div key={key} style={style} className='city'>
            <div className="title">{formatCityIndex(letter)}</div>
            {
                cityList[letter].map(item => <div className="name" key={item.value} onClick={() => this.changeCity(item)}>{item.label}</div>)
            }
        </div>
        )
    }

    // 创建动态计算每一行高度的方法
    getRowHeight = ({index}) => {
        // 索引标题高度 + 城市数量 * 城市名称的高度
        // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
        const {cityList, cityIndex} = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    /* 
        1 给索引列表项绑定点击事件。
        2 在点击事件中，通过 index 获取到当前项索引号。
        3 调用 List 组件的 scrollToRow 方法，让 List 组件滚动到指定行。

        3.1 在 constructor 中，调用 React.createRef() 创建 ref 对象。
        3.2 将创建好的 ref 对象，添加为 List 组件的 ref 属性。
        3.3 通过 ref 的 current 属性，获取到组件实例，再调用组件的 scrollToRow 方法。

        4 设置 List 组件的 scrollToAlignment 配置项值为 start，保证被点击行出现在页面顶部。
        5 对于点击索引无法正确定位的问题，调用 List 组件的 measureAllRows 方法，提前计算高度来解决。
  */

    // 封装渲染城市列表数据的方法
    renderCityIndex() {
        // 获取到cityIndex,并遍历其实现渲染
        const {cityIndex, activeIndex} = this.state
        return cityIndex.map((item, index) => <li 
                                                className="city-index-item" 
                                                key={item}
                                                onClick={() => {
                                                    // console.log('当前索引号：', index)
                                                    this.cityListComponent.current.scrollToRow(index)
                                                }}
                                              >
                <span className={index === activeIndex ? "index-active" : ""}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>)
    }

      /* 
        1 给 List 组件添加 onRowsRendered 配置项，用于获取当前列表渲染的行信息。
        2 通过参数 startIndex 获取到，起始行索引（也就是城市列表可视区最顶部一行的索引号）。
        3 判断 startIndex 和 activeIndex 是否相同（判断的目的是为了提升性能，避免不必要的 state 更新）。
        4 当 startIndex 和 activeIndex 不同时，更新状态 activeIndex 为 startIndex 的值。
    */
    // 用于获取List组件中渲染行的信息
    onRowsRendered = ({startIndex}) => {
        // console.log(startIndex)
        if(startIndex !== this.state.activeIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }

    /* 
        1 给城市列表项绑定点击事件。
        2 判断当前城市是否有房源数据（只有北/上/广/深四个城市有数据）。
        3 如果有房源数据，则保存当前城市数据到本地缓存中，并返回上一页。
        4 如果没有房源数据，则提示用户：该城市暂无房源数据，不执行任何操作。
    */

    changeCity({label, value}) {
        if(HOUSE_CITY.indexOf(label) > -1) {
            // 有
            localStorage.setItem('hkzf_city', JSON.stringify({label, value}))
            this.props.history.go(-1)
        }
        else {
            Toast.info('该城市暂无房源数据', 1, null, false)
        }
    }

    async componentDidMount() {
        await this.getCityList()
        // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
        // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用方法报错！
        // 解决：只要保证这个方法是在 获取到数据之后 调用的即可。
        this.cityListComponent.current.measureAllRows()
    }

    render() {
        return (
            <div id="citylist" className={styles.citylist}>
                {/* <div className="test">测试样式覆盖问题</div> */}
                {/* <div className={styles.test}>测试样式覆盖问题</div> */}
                {/* 顶部导航栏 */}
                <NavHeader>城市选择</NavHeader>

                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({width, height}) => (
                            <List
                                ref={this.cityListComponent}
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment="start"
                            />
                        )
                    }
                </AutoSizer>
                {/* 右侧索引列表 */}
                {/* 
                1 封装 renderCityIndex 方法，用来渲染城市索引列表。
                2 在方法中，获取到索引数组 cityIndex ，遍历 cityIndex ，渲染索引列表。
                3 将索引 hot 替换为 热。
                4 在 state 中添加状态 activeIndex ，指定当前高亮的索引。
                5 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件。
                */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
                
            </div>
        )
    }
}