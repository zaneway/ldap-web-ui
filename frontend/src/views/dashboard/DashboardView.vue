<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    <p>LDAP 运维管理系统 - 阶段一已就绪</p>
    <el-button @click="goLogin">返回登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
}
</style>
