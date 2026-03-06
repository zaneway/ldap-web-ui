import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ username: string; realName?: string } | null>(null)

  function setToken(value: string | null) {
    token.value = value
  }

  function setUser(value: { username: string; realName?: string } | null) {
    user.value = value
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, setToken, setUser, logout }
})
