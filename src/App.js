import React from 'react';

/* 
  1 安装：yarn add react-router-dom
  2 导入路由组件：Router / Route / Link
  3 在 pages 文件夹中创建 Home/index.js 和 CityList/index.js 两个组件(页面)
  4 使用 Route 组件配置首页和城市选择页面
*/

import {BrowserRouter as Router, Route} from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList';
import Map from './pages/Map'
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path='/' exact render={() => (<Redirect to='/home'></Redirect>)} />
        {/* 配置路由 */}
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
      </div>
    </Router>
  );
}

export default App;
