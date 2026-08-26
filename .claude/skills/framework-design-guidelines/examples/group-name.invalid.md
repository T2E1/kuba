# Nome de grupo por posição na arquitetura

Viola o objetivo declarado das guidelines — *clareza suficiente para saber de imediato o
que há dentro*. Correto em `group-name.valid.md`.

```
packages/
├── core/               ← ERRO: nomeia posição, não conteúdo
│   ├── echo/
│   ├── event/
│   ├── spark/
│   └── result/
├── common/             ← ERRO: o mesmo, com outra palavra
│   └── interpolate/
├── services/           ← ERRO: "service" não restringe nada
│   ├── router/
│   ├── renderer/
│   └── http/
├── utils/              ← ERRO: o depósito para onde vai o que não foi decidido
│   └── cookie/
├── events/             ← ERRO adicional: colide com o pacote dentro dele
│   └── event/            produz o caminho events/event
└── reactive/           ← ERRO pior: promete o que o código não faz
    └── dom/              dom não é reativo — repaint agenda, não observa
```

## Por que cada um falha

**`core`, `common`, `utils`** — respondem "onde fica na arquitetura", não "o que é". Falham
o teste de imediatismo: ninguém prevê encontrar `result` e `spark` dentro de `core/`.

**`services`** — `service` é uma das palavras que não restringe nada. Um roteador, um
renderizador e um cliente HTTP não compartilham assunto; compartilham a ausência de um.

**`events/event`** — viola diretamente o `DO NOT` de dar o mesmo nome a um namespace e a um
tipo dentro dele. O caminho carrega a palavra duas vezes e informa uma.

**`reactive/`** — o mais caro dos cinco. `core/` só é vago; `reactive/` é falso, e o leitor
confia nele. É a rule 035 em nível de pasta.

## O sintoma por trás

Todo nome desta lista foi escolhido depois de um recorte por **camada arquitetural**. Camada
não tem assunto próprio — só posição — então não há nome bom disponível.

A correção não é procurar sinônimos melhores de `core`: é reagrupar pelo que os membros de
fato fazem. Quando o grupo tem assunto, o nome aparece sozinho.

```
messaging/    echo, event        ← o grupo ganhou assunto, e o nome veio junto
navigation/   router, renderer
```
