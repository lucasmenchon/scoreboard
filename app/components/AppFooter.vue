<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="footer-text">
        <img src="/favicon.svg" alt="" width="14" height="14" style="vertical-align: -2px;" /> Scoreboard &mdash; Made with <i class="fas fa-heart" style="color: var(--danger);"></i> &amp; Vue 3 + Nuxt 4
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: rgba(15, 15, 35, 0.95);
  border-top: 1px solid var(--border-color);
  padding: 16px 0;
  margin-top: auto;
}

.footer-inner {
  text-align: center;
}

.footer-text {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.footer-text i {
  margin: 0 2px;
}
</style>
