# Fator 05 — Build, Release, Run

**Regra deMGoncalves:** [044 - Separação de Build, Release, Run](../../../rules/044_separacao-build-release-run.md)
**Questão:** Três estágios separados e imutáveis (Build → Release → Run)?

## O que é

O processo de deploy deve ser separado em três estágios distintos e imutáveis:

- **Build**: compila código + dependências → artefato executável
- **Release**: Build + Config → release imutável com ID único
- **Run**: executa a release no ambiente de runtime

**Cada release é imutável — correções exigem nova release.**

## Critérios de Conformidade

- [ ] Estágio **Build** produz artefato executável sem dependências de configuração de ambiente
- [ ] Estágio **Release** é imutável — correções exigem nova release com novo ID
- [ ] Toda release possui **identificador único** (timestamp, hash, número sequencial)

## ❌ Violação

```bash
# Build + Run misturados ❌
ssh prod-server
cd /app
git pull origin main  # alteração direta em prod
npm install
npm start

# Release mutável ❌
# Modificar código em release já deployada
vim /app/src/config.js  # violação
```

## ✅ Conforme

```bash
# Pipeline CI/CD com 3 estágios separados ✅

# 1. Build (CI)
npm run build
# → Saída: dist/bundle.js

# 2. Release (CI + Deploy)
docker build -t myapp:v1.2.3 .  # Build
docker tag myapp:v1.2.3 myapp:release-456  # ID da Release
docker push myapp:release-456

# 3. Run (Prod)
kubectl set image deployment/myapp app=myapp:release-456
# Release imutável — rollback = deploy da release anterior
```

## Codetag quando violado

```typescript
// FIXME: Config sendo alterada em runtime — deve estar no estágio de release
if (process.env.NODE_ENV === 'production') {
  config.apiUrl = 'https://api.prod.com';  # violação
}
```
