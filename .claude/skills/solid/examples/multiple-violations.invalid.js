// ❌ Viola SRP (rule 010), OCP (rule 011) e DIP (rule 014) simultaneamente.
// Correto em: multiple-violations.valid.js

class UserManager {
  processUser(userId) {
    // DIP: instancia uma classe concreta dentro de código de alto nível.
    // A classe fica presa ao MySQL e impossível de testar sem banco real.
    const database = new MySQLDatabase()
    const user = database.findUser(userId)

    // OCP: ramifica por tipo. Cada tipo novo de usuário obriga a editar
    // este método — a classe não está fechada para modificação.
    if (user.type === 'premium') {
      this.processPremium(user)
    }
    if (user.type === 'basic') {
      this.processBasic(user)
    }
  }

  processPremium(user) {}
  processBasic(user) {}

  // SRP: enviar e-mail e registrar atividade são outras razões para mudar.
  // A classe muda quando muda o processamento, quando muda o template de
  // e-mail e quando muda o formato de log — três razões, uma classe.
  sendEmail(user) {}
  logActivity(user) {}
}
