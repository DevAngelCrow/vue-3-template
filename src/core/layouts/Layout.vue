<template>
  <div class="w-full h-full flex flex-col">
    <!-- <AppLoader v-if="showLoader" /> -->
    <AppSideBar :show="sideBar.sideBar" />
    <div class="w-full h-full flex flex-col overflow-auto">
      <section
        id="header-section"
        class="w-full h-[8%] min-h-[70px] flex-shrink-0 fixed top-0 left-0 z-50"
      >
        <AppHeader />
      </section>
      <section id="main-content-section" class="w-full flex-grow pt-[8vh]">
        <AppMainContent />
      </section>
      <section
        id="footer-section"
        class="w-full h-[6%] min-h-[50px] flex-shrink-0"
      >
        <AppFooter />
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import AppHeader from '../components/AppHeader.vue';
import AppMainContent from '../components/AppMainContent.vue';
import AppFooter from '../components/AppFooter.vue';
import AppSideBar from '../components/AppSideBar.vue';
import { useLayoutStore } from '../store/useLayoutStore';
import { useAuthStore } from '../store/useAuthStore';

const sideBar = useLayoutStore();
const useAuth = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!useAuth.user && !useAuth.token) {
    router.push({ name: 'login' });
  }
});
</script>
