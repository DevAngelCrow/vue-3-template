<template>
  <div class="w-full h-full flex flex-col">
    <AppLoader v-if="storeLoader.loader" />
    <AppSideBar :show="sideBar.sideBar" />
    <div class="w-full min-h-screen flex flex-col">
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
<script setup>
import AppLoader from '../components/AppLoader.vue';
import AppHeader from '../components/AppHeader.vue';
import AppMainContent from '../components/AppMainContent.vue';
import AppFooter from '../components/AppFooter.vue';
import AppSideBar from '../components/AppSideBar.vue';
import { useLoaderStore } from '../store/useLoaderStore';
import { useLayoutStore } from '../store/useLayoutStore';

const storeLoader = useLoaderStore();
const sideBar = useLayoutStore();
</script>
