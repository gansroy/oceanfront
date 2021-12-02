#!/usr/bin/env python3

import os.path
import sys

from glob import glob
from typing import Sequence, Tuple
from xml.dom import minidom


class LoadError(Exception):
    """An SVG icon load error."""


def load_svg(path: str) -> Tuple[str, Sequence[str]]:
    if not os.path.exists(path):
        raise LoadError(f"Icon file not found: {path}")

    name = os.path.basename(path)
    p = name.rfind(".")
    if p > 0:
        name = name[:p]

    try:
        doc = minidom.parse(path)
    except e:
        raise LoadError(f"Error loading SVG: {path}")    
    if doc.documentElement.tagName != "svg":
        raise LoadError(f"Expected 'svg' root element: {path}")

    paths = []
    for elt in doc.documentElement.getElementsByTagName("path"):
        if elt.getAttribute("fill") == "none":
            continue
        paths.append(elt.getAttribute("d"))
    if not paths:
        raise LoadError(f"No paths found: {path}")

    return name, paths


if __name__ == "__main__":
    if len(sys.argv) > 1:
        paths = sys.argv[1:]
    else:
        paths = glob("*.svg")
    if not paths:
        print("No icons found", file=sys.stderr)
        sys.exit(1)

    icons = {}
    for path in paths:
        try:
            name, icon = load_svg(path)
        except LoadError as e:
            print(str(e), file=sys.stderr)
        icons[name] = icon

    print(icons)
