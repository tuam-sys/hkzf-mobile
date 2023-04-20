// import React from 'react'
// import { TabBar } from 'antd-mobile'
// import {
//   Route,
//   Switch,
//   useHistory,
//   useLocation,
//   MemoryRouter as Router,
// } from 'react-router-dom'
// import {
//   AppOutline,
//   MessageOutline,
//   UnorderedListOutline,
//   UserOutline,
// } from 'antd-mobile-icons'

// import './index.css'

// export function Bottom() {
//   const history = useHistory()
//   const location = useLocation()
//   const { pathname } = location

//   const setRouteActive = (value) => {
//     history.push(value)
//   }

//   const tabs = [
//     {
//       key: '/home/index',
//       title: '首页',
//       icon: <AppOutline />,
//     },
//     {
//       key: '/home/list',
//       title: '找房',
//       icon: <UnorderedListOutline />,
//     },
//     {
//       key: '/home/news',
//       title: '资讯',
//       icon: <MessageOutline />,
//     },
//     {
//       key: '/home/profile',
//       title: '我的',
//       icon: <UserOutline />,
//     },
//   ]

//   return (
//     <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} className='tabbar'>
//       {tabs.map(item => (
//         <TabBar.Item tintColor='red' key={item.key} icon={item.icon} title={item.title} className='tabitem' />
//       ))}
//     </TabBar>
//   )
// }

// // export default () => {
// //   return (
// //     <Router initialEntries={['/home']}>
// //       <div className={styles.app}>
// //         <div className={styles.top}>
// //           <NavBar>配合路由使用</NavBar>
// //         </div>
// //         <div className={styles.body}>
// //           <Switch>
// //             <Route exact path='/home/index'>
// //               <Home />
// //             </Route>
// //             <Route exact path='/home/list'>
// //               <Todo />
// //             </Route>
// //             <Route exact path='/home/news'>
// //               <Message />
// //             </Route>
// //             <Route exact path='/home/profile'>
// //               <PersonalCenter />
// //             </Route>
// //           </Switch>
// //         </div>
// //         <div className={styles.bottom}>
// //           <Bottom />
// //         </div>
// //       </div>
// //     </Router>
// //   )
// // }