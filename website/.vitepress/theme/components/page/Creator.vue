<script setup>
/**
 * Cartão do criador — Sobre.dc.html, seção 01, no arranjo da página de time
 * do typesafe: a janela com foto no centro e as janelas de fatos
 * (`Window.vue`) espalhadas em volta dela, em duas colunas desencontradas
 * (`#left` e `#right`), cada janela deslocada um pouco da vizinha, sem
 * nunca encostar na foto.
 */
defineProps({
  photo: { type: String, required: true },
  alt: { type: String, required: true },
})
</script>

<template>
  <div class="creator">
    <div class="side side-left"><slot name="left" /></div>
    <article class="s1-win card">
      <div class="s1-bar"><i /><b>creator.jpg</b></div>
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
    <div class="side side-right"><slot name="right" /></div>
  </div>
</template>

<style scoped>
.creator {
  display: grid;
  gap: 28px;
  width: 100%;
  align-items: start;
}

.card {
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
  line-height: 16px;
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

.side {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.side :deep(.content) {
  padding: 14px 16px 16px;
}

.side :deep(.text) {
  font-size: 14px;
  line-height: 21px;
}

.side :deep(.text ul) {
  list-style: square;
  margin: 0;
  padding-left: 18px;
}

/* Em tela larga, as colunas descem em alturas diferentes e as janelas
   alternam o recuo — o "espalhado em volta" da referência. O recuo sempre
   se afasta da foto (`translateX` para fora), e o vão de 48px entre as
   colunas garante que nenhuma janela encoste no cartão. */
@media (min-width: 1000px) {
  .creator {
    grid-template-columns: minmax(0, 280px) 400px minmax(0, 280px);
    justify-content: center;
    gap: 0 48px;
  }

  .side-left {
    padding-top: 72px;
  }

  .side-right {
    padding-top: 8px;
  }

  .side-left > :deep(:nth-child(even)) {
    transform: translateX(-32px);
  }

  .side-right > :deep(:nth-child(even)) {
    transform: translateX(32px);
  }
}
</style>
