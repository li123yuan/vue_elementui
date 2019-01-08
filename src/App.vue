<template>
    <div id="app">
        <!--导航条-->
        <el-menu class="el-menu-demo" mode="horizontal"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1"><router-link to="/makeUpgradePack">制作升级包</router-link></el-menu-item>
            <!--<el-menu-item index="2"><router-link to="/listUser">用户</router-link></el-menu-item>-->
            <el-menu-item index="3"><router-link to="/aboutUs">关于我们</router-link></el-menu-item>
        </el-menu>
        <br>
        <router-view></router-view>

    </div>
</template>

<style>
a {
  text-decoration: none;
}
</style>