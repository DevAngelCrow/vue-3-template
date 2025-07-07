<template>
  <div class="app-loader" style="background: rgba(0, 0, 0, 0.3); z-index: 2000">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const bloquearTeclado = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

const bloquearCursor = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

onMounted(() => {
  document.addEventListener("keydown", bloquearTeclado);
  document.addEventListener("click", bloquearCursor);
});

onUnmounted(() => {
  document.removeEventListener("keydown", bloquearTeclado);
  document.removeEventListener("click", bloquearCursor);
});
</script>

<style scoped>
.app-loader {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  color: #fff;
  position: relative;
  font-size: 11px;
  background: #fff;
  animation: escaleY 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 0;
  left: 2em;
  background: #fff;
  width: 1em;
  height: 4em;
  animation: escaleY 1s infinite ease-in-out;
}
.loader:before {
  left: -2em;
  animation-delay: -0.32s;
}

@keyframes escaleY {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
