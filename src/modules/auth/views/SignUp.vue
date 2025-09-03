<template>
  <div class="min-w-[280px] w-full h-full bg-primary flex justify-center">
    <div
      class="min-w-[280px] w-[95%] bg-primary h-full flex justify-center mt-16"
    >
      <section
        id="card_informacion_personal"
        class="w-[80%] bg-surface-200 h-[400px] rounded-xl flex flex-col items-center align-top gap-10"
      >
        <div class="w-full mt-5">
          <AppTitle title="Registro" />
        </div>
        <div class="flex min-w-[280px] w-[85%] gap-6 flex-wrap">
          <AppInputText />
          <AppInputText />
          <AppSelect />
        </div>
        <div class="flex w-[85%] gap-6">
          <AppInputText class="!grow" />
          <AppSelect class="!grow" />
        </div>
        <div class="flex w-[85%] gap-6">
          <AppSelect />
          <AppSelect />
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts"></script>
<style scoped></style>
