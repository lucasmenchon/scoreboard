<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <div class="container">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px 0;
}
</style>
