// ❌ Seis parâmetros posicionais — viola a rule 033 (máximo 3).
// Correto em: parameter-object.valid.js

function createUser(name, email, street, city, zipCode, country) {}

// Dois problemas:
//
// 1. A ordem vira fonte de bug. `createUser(name, email, city, street, ...)`
//    compila, roda e grava dados trocados — nenhum tipo impede.
//
// 2. `street`, `city`, `zipCode` e `country` andam sempre juntos: é um Data
//    Clump (rule 053). Remover um deles deixa os outros sem sentido, o que
//    é o teste definitivo de que formam um conceito ainda não nomeado.
//
// O sintoma se espalha: toda função que recebe endereço repete os quatro
// parâmetros, e cada uma revalida o CEP por conta própria (rule 021).
