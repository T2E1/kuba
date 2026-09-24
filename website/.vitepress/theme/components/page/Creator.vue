<script setup>
/**
 * Cartão do criador — Sobre.dc.html, seção 01: janela com foto, faixa preta
 * com o nome, papel em Silkscreen, bio e links em botões; as janelas de
 * fatos (`Window.vue`) entram pelo slot padrão, numa coluna ao lado.
 */
defineProps({
  photo: { type: String, required: true },
  alt: { type: String, required: true },
})
</script>

<template>
  <div class="creator">
    <article class="s1-win card">
      <div class="s1-bar"><i></i><b>creator.jpg</b></div>
      <div class="photo s1-dots">
        <img :src="photo" :alt="alt" width="400" height="360" loading="lazy" />
      </div>
      <h3 class="name"><slot name="name" /></h3>
      <div class="details">
        <p class="role"><slot name="role" /></p>
        <div class="s1-prose bio"><slot name="bio" /></div>
        <div class="links"><slot name="links" /></div>
      </div>
    </article>
    <div class="facts">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.creator {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 28px;
  width: 100%;
}

.card {
  flex: 0 1 400px;
  color: var(--s1-ink);
}

.photo {
  background-color: #f7c6d1;
  border-bottom: 2px solid var(--s1-line);
  aspect-ratio: 10 / 9;
  overflow: hidden;
}

/* O retrato entra em escala de cinza e multiplicado sobre o rosa
   pontilhado — o duotom das fotos do Tema, sem editar a imagem. */
.photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.1);
  mix-blend-mode: multiply;
}

.name {
  background: #111111;
  border: 0;
  color: #ffffff;
  font-family: var(--s1-font-base);
  font-size: 24px;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 0;
  padding: 12px 16px;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px 20px;
}

.role {
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  margin: 0;
  text-transform: lowercase;
}

.bio {
  font-size: 15px;
  line-height: 23px;
}

.links :deep(p) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
}

.links :deep(a) {
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-sm);
  color: var(--s1-ink);
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  padding: 6px 10px;
  text-decoration: none;
}

.facts {
  flex: 0 1 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.facts :deep(.content) {
  padding: 14px 16px 16px;
}
</style>
