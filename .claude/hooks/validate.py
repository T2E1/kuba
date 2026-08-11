#!/usr/bin/env python3
"""Roda os validadores das quatro camadas do .claude/ e reporta só o que falhou.

Os scripts não vivem aqui: são extraídos do bloco de código de cada STANDARD.md e
executados. Uma cópia neste arquivo divergiria do padrão que ela deveria verificar —
é a rule 021 aplicada a ferramenta.

Disparado por UserPromptSubmit. Silencioso quando tudo passa: o que ele imprime entra
no contexto, e contexto gasto para dizer "está tudo bem" é contexto desperdiçado.
"""

import re
import subprocess
import sys
from pathlib import Path

CLAUDE = Path(__file__).resolve().parent.parent
BLOCO = re.compile(r"```bash\n(?:python3 - <<'PY'\n(?P<py>.*?)\nPY|(?P<sh>.*?))\n```", re.S)

CAMADAS = ["rules", "skills", "agents", "commands"]


def extrai(camada):
    """Devolve (interpretador, script) do STANDARD.md da camada, ou None."""
    padrao = CLAUDE / camada / "STANDARD.md"
    if not padrao.is_file():
        return None
    achado = BLOCO.search(padrao.read_text())
    if not achado:
        return None
    if achado.group("py"):
        return "python3", achado.group("py")
    return "bash", achado.group("sh")


def roda(camada):
    """Devolve a saída do validador quando ele falha, ou None quando passa."""
    extraido = extrai(camada)
    if not extraido:
        return f"{camada}: STANDARD.md sem bloco de validação"
    interpretador, script = extraido
    resultado = subprocess.run(
        [interpretador, "-c", script] if interpretador == "python3" else [interpretador, "-c", script],
        cwd=CLAUDE,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if resultado.returncode == 0 and "falta" not in resultado.stdout and "inexistente" not in resultado.stdout:
        return None
    return f"{camada}:\n{resultado.stdout.strip() or resultado.stderr.strip()}"


def main():
    falhas = [f for f in (roda(c) for c in CAMADAS) if f]
    if not falhas:
        return 0
    print("O .claude/ tem violações do próprio padrão. Corrija antes de seguir:\n")
    print("\n\n".join(falhas))
    return 0  # avisa, não bloqueia: quem decide o que fazer é quem está trabalhando


if __name__ == "__main__":
    sys.exit(main())
