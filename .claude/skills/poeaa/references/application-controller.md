# Application Controller

**Camada:** Web Presentation
**Complexidade:** Complexa
**Intenção:** Ponto centralizado para tratar navegação entre telas e fluxo da aplicação.

---

## Quando Usar

- Aplicações com fluxo de navegação complexo entre múltiplas telas/etapas
- Wizards e formulários multi-etapas com regras de transição
- Quando usuários diferentes devem ver fluxos diferentes com base no contexto
- Aplicações com lógica complexa de "qual tela mostrar a seguir"

## Quando NÃO Usar

- Aplicações simples com fluxo linear sem condicionais (use Page Controller)
- APIs REST sem estado sem estado de navegação (Front Controller é suficiente)
- Quando a lógica de navegação pode ser expressa com roteamento simples

## Estrutura Mínima (TypeScript)

```typescript
// Application Controller: controla o fluxo entre telas
class OnboardingController {
  // Determina a próxima tela com base no estado atual do usuário
  nextStep(user: User, currentStep: OnboardingStep): OnboardingStep {
    if (currentStep === OnboardingStep.WELCOME) {
      return OnboardingStep.PROFILE_SETUP
    }

    if (currentStep === OnboardingStep.PROFILE_SETUP) {
      return user.needsEmailVerification()
        ? OnboardingStep.EMAIL_VERIFICATION
        : OnboardingStep.COMPLETED
    }

    if (currentStep === OnboardingStep.EMAIL_VERIFICATION) {
      return OnboardingStep.COMPLETED
    }

    return OnboardingStep.COMPLETED
  }

  // Verifica se o usuário pode acessar uma determinada tela
  canAccess(user: User, step: OnboardingStep): boolean {
    if (step === OnboardingStep.EMAIL_VERIFICATION) {
      return user.hasCompletedProfileSetup()
    }
    return true
  }

  // Retorna a view correta para o passo atual
  getView(step: OnboardingStep): string {
    const views: Record<OnboardingStep, string> = {
      [OnboardingStep.WELCOME]: 'onboarding/welcome',
      [OnboardingStep.PROFILE_SETUP]: 'onboarding/profile',
      [OnboardingStep.EMAIL_VERIFICATION]: 'onboarding/verify-email',
      [OnboardingStep.COMPLETED]: 'onboarding/completed',
    }
    return views[step]
  }
}
```

## Relacionado com

- [front-controller.md](front-controller.md): depende — Application Controller determina o destino; Front Controller executa o dispatch
- [page-controller.md](page-controller.md): complementa — Application Controller decide qual Page Controller ativar em cada passo do fluxo

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
