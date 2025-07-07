<template>
  <div class="w-full h-full">
    <AppLoader v-if="storeLoader.loader" />
    <AppSideBar :show="sideBar.sideBar" />
    <div class="w-full flex flex-col gap-0">
      <section id="header-section" class="w-full h-[10%]">
        <AppHeader />
      </section>
      <section id="main-content-section" class="w-full">
        <AppMainContent />
      </section>
      <section id="footer-section" class="w-full h-[8%]">
        <AppFooter />
      </section>
    </div>
  </div>
</template>
<script setup>
import AppLoader from "../components/AppLoader.vue";
import AppHeader from "../components/AppHeader.vue";
import AppMainContent from "../components/AppMainContent.vue";
import AppFooter from "../components/AppFooter.vue";
import AppSideBar from "../components/AppSideBar.vue";
import { useLoaderStore } from "../store/useLoaderStore";
import { useLayoutStore } from "../store/useLayoutStore";

const storeLoader = useLoaderStore();
const sideBar = useLayoutStore();
</script>
