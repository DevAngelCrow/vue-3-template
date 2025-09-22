<template>
  <div
    class="loader-container fade-in"
    style="background: rgba(0, 0, 0, 0.3); z-index: 9999"
  >
    <div class="Loader"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineOptions({ name: 'AppLoader' });

const bloquearTeclado = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

const bloquearCursor = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

onMounted(() => {
  document.addEventListener('keydown', bloquearTeclado);
  document.addEventListener('click', bloquearCursor);
});

onUnmounted(() => {
  document.removeEventListener('keydown', bloquearTeclado);
  document.removeEventListener('click', bloquearCursor);
});
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Contenedor principal con fondo semi-transparente */
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.4s ease-in-out,
    visibility 0.4s ease-in-out;
}

.Loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25vmin;
  height: 25vmin;
  max-width: 200px;
  max-height: 200px;
  transform: scale(0.8);
  transition: transform 0.3s ease-out;
}

.loader-container.fade-in .Loader {
  animation: scaleIn 0.5s ease-out forwards;
}

.loader-container.fade-out .Loader {
  animation: scaleOut 0.3s ease-in forwards;
}

.Loader:before,
.Loader:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation-duration: 1.8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  filter: drop-shadow(0 0 7px rgba(12, 74, 110, 0.75));
}

.Loader:before {
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 0 17px #0c4a6e;
  animation-name: pulsA;
}

.Loader:after {
  width: calc(100% - 34px);
  height: calc(100% - 34px);
  top: 17px;
  left: 17px;
  box-shadow: 0 0 0 0 #0c4a6e;
  animation-name: pulsB;
}

@keyframes pulsA {
  0% {
    box-shadow: inset 0 0 0 17px #0c4a6e;
    opacity: 1;
  }

  50%,
  100% {
    box-shadow: inset 0 0 0 0 #0c4a6e;
    opacity: 0;
  }
}

@keyframes pulsB {
  0%,
  50% {
    box-shadow: 0 0 0 0 #0c4a6e;
    opacity: 0;
  }

  100% {
    box-shadow: 0 0 0 17px #0c4a6e;
    opacity: 1;
  }
}

/* Animaciones de entrada y salida */
@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(2px);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    backdrop-filter: blur(2px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.5);
    opacity: 0;
  }
}
</style>
