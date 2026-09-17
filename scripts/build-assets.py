#!/usr/bin/env python3
"""Reduz os dois arquivos mais pesados da página, e grava o resultado em `static/`.

A página é HTML estático: numa visita fria, a fonte e o favicon respondiam por
82% dos bytes. Nenhum dos dois muda de aparência aqui — o que sai é peso que o
desenho nunca usou.

  fonte    eixo wght cortado de 100–900 para 400–560, que são os quatro
           meio-pesos do desenho (400 corpo, 460 disponibilidade, 500 rótulo,
           560 nome), e glifos limitados ao `unicode-range` que o app.css já
           declara. A origem é o subset latino do @fontsource-variable/inter.
           As setas → e ← continuam fora daqui: são símbolos do sprite.

  favicon  o .ico trazia 16, 32, 48, 64, 128 e 256px. O navegador baixa o
           arquivo inteiro e usa um. Os três tamanhos grandes existiam para um
           caso que o apple-touch-icon.png já cobre.

Uso:  python3 scripts/build-assets.py [--check]
      --check não escreve nada, só relata o que faria.

Requer: python3 -m pip install fonttools brotli pillow
"""

import argparse
import io
import os
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "static" / "fonts" / "inter-latin-wght-normal.woff2"
ICON = ROOT / "static" / "favicon.ico"

# Os mesmos pontos de código do @font-face em src/app.css. Mexeu num, mexe no outro.
UNICODES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FEFF,U+FFFD"
)
WGHT_MIN, WGHT_MAX = 400, 560
ICO_SIZES = [16, 32, 48]


def kb(n: int) -> str:
    return f"{n / 1024:.1f}KB"


def shrink_font(check: bool) -> tuple[int, int]:
    before = FONT.stat().st_size
    font = TTFont(FONT)

    # Subset antes de instanciar: o caminho inverso faz o fontTools tropeçar numa
    # variação órfã (`KeyError: 'space.tf'`) dentro do gvar já estreitado.
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)

    # Instancing parcial: mantém o eixo, estreita a faixa. Os quatro pesos do
    # desenho continuam existindo; some a interpolação que ninguém pede.
    instantiateVariableFont(font, {"wght": (WGHT_MIN, WGHT_MAX)}, inplace=True, updateFontNames=False)

    buffer = io.BytesIO()
    font.flavor = "woff2"
    font.save(buffer)
    after = len(buffer.getvalue())

    if not check:
        FONT.write_bytes(buffer.getvalue())

    return before, after


def shrink_icon(check: bool) -> tuple[int, int]:
    before = ICON.stat().st_size
    image = Image.open(ICON)
    # A maior entrada do arquivo é a fonte do redimensionamento, para os
    # tamanhos pequenos saírem do desenho mais detalhado que existe.
    image.size = max(image.ico.sizes())
    base = image.convert("RGBA")

    buffer = io.BytesIO()
    base.save(buffer, format="ICO", sizes=[(s, s) for s in ICO_SIZES])
    after = len(buffer.getvalue())

    if not check:
        ICON.write_bytes(buffer.getvalue())

    return before, after


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="não escreve, só relata")
    args = parser.parse_args()

    font_before, font_after = shrink_font(args.check)
    icon_before, icon_after = shrink_icon(args.check)

    verb = "ficaria" if args.check else "ficou"
    print(f"fonte    {kb(font_before)} → {kb(font_after)}  ({verb} {font_before - font_after} bytes menor)")
    print(f"favicon  {kb(icon_before)} → {kb(icon_after)}  ({verb} {icon_before - icon_after} bytes menor)")
    total = (font_before + icon_before) - (font_after + icon_after)
    print(f"total    {kb(total)} a menos numa visita fria")
    return 0


if __name__ == "__main__":
    sys.exit(main())
