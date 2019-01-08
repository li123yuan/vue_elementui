import VueRouter from 'vue-router'
import AddBlog from './components/aboutUs'
import UpdateBlog from './components/updateBlog'
import ListBlog from './components/ListBlog'
import HomePage from './components/HomePage'
import ListUser from './components/listUser'
import MakeUpgradePack from './components/makeUpgradePack'

// 1、创建路由对象
var router = new VueRouter({
    routes: [
        { path: '/listBlog', component: ListBlog },
        { path: '/addBlog', component: AddBlog },
        { path: '/updateBlog/:id', component: UpdateBlog },
        { path: '/', component: HomePage },
        { path: '/listUser', component: ListUser },
        { path: '/makeUpgradePack', component: MakeUpgradePack }
    ]
})

// 2、把路由对象暴露出去
export default router