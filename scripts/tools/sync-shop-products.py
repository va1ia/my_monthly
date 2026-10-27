#!/usr/bin/env python3
"""目录：1. 编号 SVG 扫描 2. 尺寸与版本清单生成 3. 命令行。"""
import argparse
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = Path('assets/images/shop/products')
MANIFEST = Path('content/shop/products.json')


def scan_products(root=ROOT):
    products = []
    slots = set()
    for path in sorted((root / ASSETS).glob('*.svg')):
        if path.is_symlink():
            continue
        match = re.match(r'^(\d+)-', path.name)
        if not match:
            raise ValueError(f'产品文件名需要编号前缀: {path.name}')
        slot = str(int(match[1]))
        if slot in slots:
            raise ValueError(f'产品编号重复: {slot}')
        slots.add(slot)
        svg = ET.parse(path).getroot()
        box = svg.get('viewBox', '').replace(',', ' ').split()
        width, height = float(box[2]), float(box[3])
        if width <= 0 or height <= 0:
            raise ValueError(f'产品 SVG 尺寸无效: {path.name}')
        products.append({'slot': slot, 'file': path.name, 'width': width, 'height': height,
                         'version': hashlib.sha256(path.read_bytes()).hexdigest()[:12]})
    return {'products': products}


def sync_manifest(root=ROOT, check=False):
    output = root / MANIFEST
    text = json.dumps(scan_products(root), ensure_ascii=False, indent=2) + '\n'
    if output.exists() and output.read_text(encoding='utf-8') == text:
        return False
    if check:
        raise ValueError('Shop 产品清单需要更新')
    temporary = output.with_suffix('.json.tmp')
    temporary.write_text(text, encoding='utf-8')
    temporary.replace(output)
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='按编号 SVG 自动更新 Shop 产品清单')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    print('Shop products updated.' if sync_manifest(check=args.check) else 'Shop products current.')
