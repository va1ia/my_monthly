#!/usr/bin/env python3
"""目录：1. 素材扫描及排序 2. 清单写入 3. 命令行入口。仅使用 Python 标准库。"""
import argparse
import hashlib
import json
import re
import math
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = Path('assets/images/home/logo-marquee')
MANIFEST = Path('content/home/logo-marquee.json')
EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'}


def logo_dimensions(path):
    """SVG 导出尺寸保留用户原有视觉比例；其他格式使用兼容默认值。"""
    if path.suffix.lower() == '.svg':
        try:
            svg = ET.parse(path).getroot()
            viewbox = svg.get('viewBox', '').replace(',', ' ').split()
            def dimension(attribute, index):
                value = svg.get(attribute, '')
                if re.fullmatch(r'\d+(?:\.\d+)?(?:px)?', value):
                    return float(value.removesuffix('px'))
                return float(viewbox[index])
            width, height = dimension('width', 2), dimension('height', 3)
            if all(math.isfinite(value) and value > 0 for value in (width, height)):
                return {'width': width, 'height': height}
        except (ET.ParseError, ValueError, IndexError):
            pass
    return {'width': 120, 'height': 44}


def scan_logos(root=ROOT):
    def order(path):
        match = re.match(r'^(\d+)-', path.stem)
        return (int(match[1]) if match else float('inf'), path.name.casefold())
    files = sorted((p for p in (root / ASSETS).iterdir()
                    if p.is_file() and not p.is_symlink() and not p.name.startswith('.')
                    and p.suffix.lower() in EXTENSIONS), key=order)
    logos = []
    for path in files:
        label = re.sub(r'^\d+-', '', path.stem).replace('-', ' ').replace('_', ' ').title()
        label = label.replace('Abc News', 'ABC News').replace('Duo', 'DUO')
        logos.append({'file': path.name, 'name': label,
                      'version': hashlib.sha256(path.read_bytes()).hexdigest()[:12],
                      **logo_dimensions(path)})
    return {'logos': logos}


def sync_manifest(root=ROOT):
    output = root / MANIFEST
    text = json.dumps(scan_logos(root), ensure_ascii=False, indent=2) + '\n'
    if output.exists() and output.read_text(encoding='utf-8') == text:
        return False
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix('.json.tmp')
    temporary.write_text(text, encoding='utf-8')
    temporary.replace(output)
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='按 logo 文件名生成 marquee 清单')
    parser.add_argument('--check', action='store_true', help='检查已生成清单是否与文件夹一致')
    args = parser.parse_args()
    if args.check:
        expected = json.dumps(scan_logos(), ensure_ascii=False, indent=2) + '\n'
        raise SystemExit(0 if (ROOT / MANIFEST).exists() and (ROOT / MANIFEST).read_text(encoding='utf-8') == expected else 1)
    print('Logo manifest updated.' if sync_manifest() else 'Logo manifest already current.')
