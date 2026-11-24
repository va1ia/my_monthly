#!/usr/bin/env python3
"""目录：1. 输入核对 2. 逐帧合成 3. 网页视频与测量报告。
依赖：Pillow、FFmpeg（仅素材准备阶段）；不改写原始 JSON。
"""
import argparse
import base64
import gzip
import hashlib
import io
import json
import subprocess
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'components/pre-footer'
SIZE = (3440, 1080)  # 原帧 3439×1080；取编码需要的偶数宽度，仅横向调整 1px。
SKY = '#b8eafa'
GREEN = '#3d8054'


def read_part(name, expected=(3439, 1080, 24, 0)):
    path = SOURCE / name
    raw = path.read_bytes()
    data = json.loads(raw)
    if (data['w'], data['h'], data['fr'], data['ip']) != expected or not isinstance(data['op'], int) or data['op'] <= 0:
        raise ValueError(f'{name}: composition changed; review timing before rebuilding')
    assets = {asset['id']: asset for asset in data['assets']}
    layers = sorted(data['layers'], key=lambda layer: layer['ip'])
    frames = data['op']
    if len(layers) != frames or any(layer['ty'] != 2 or layer['ip'] != index or layer['op'] != index + 1 for index, layer in enumerate(layers)):
        raise ValueError('This converter is only for the supplied image-sequence Lotties')
    images = [assets[layer['refId']]['p'] for layer in layers]
    return images, {'file': name, 'bytes': len(raw), 'gzipBytes': len(gzip.compress(raw)),
                    'sha256': hashlib.sha256(raw).hexdigest(), 'frames': frames, 'fps': data['fr'],
                    'durationSeconds': frames / data['fr'], 'width': data['w'], 'height': data['h'],
                    'embeddedImagePercent': round(sum(len(asset['p']) for asset in data['assets']) / len(raw) * 100, 2)}


def decode(value, size=SIZE):
    with Image.open(io.BytesIO(base64.b64decode(value.split(',', 1)[1]))) as image:
        return image.convert('RGBA').resize(size, Image.Resampling.LANCZOS)


def background(size=SIZE, ground_height=547):
    image = Image.new('RGBA', size, SKY)
    # 原站 ground.svg 的三个贝塞尔曲线；只用于不支持透明视频的 MP4 后备。
    curves = [((857.409,327.176),(861.868,327.176),(866.389,327.174),(870.892,327.193)),
              ((870.892,327.193),(1294.2,340.297),(1476.22,353.286),(1731.51,390.39))]
    points = [(-10,410),(22.8799,401.139)]
    left = ((22.8799,401.139),(257.125,351.304),(494.073,332.807),(857.409,327.176))
    for curve in [left, *curves]:
        for index in range(81):
            t=index/80
            points.append(tuple(sum(((1-t)**3,3*(1-t)**2*t,3*(1-t)*t*t,t**3)[j]*curve[j][axis] for j in range(4)) for axis in range(2)))
    points += [(1745,392.4),(1745,550),(-10,550)]
    points = [(x*size[0]/1735,y*size[1]/ground_height) for x,y in points]
    ImageDraw.Draw(image).polygon(points, fill=GREEN)
    ImageDraw.Draw(image).line(points[:244], fill='#282828', width=1)
    return image


def encoder(ffmpeg, destination, size=SIZE):
    transparent = destination.suffix == '.webm'
    codec = ['-c:v','libvpx-vp9','-crf','22','-b:v','0','-cpu-used','4',
             '-row-mt','1','-auto-alt-ref','0','-pix_fmt','yuva420p'] if transparent else [
             '-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart']
    return subprocess.Popen([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgba' if transparent else 'rgb24', '-s', f'{size[0]}x{size[1]}', '-r', '24', '-i', 'pipe:0',
        '-an', *codec, str(destination)], stdin=subprocess.PIPE)


def build(ffmpeg):
    media = SOURCE / 'media'
    media.mkdir(exist_ok=True)
    temporary = tempfile.TemporaryDirectory(prefix='.garden-build-', dir=SOURCE)
    output = Path(temporary.name)
    first, report_first = read_part('source/garden.json')
    second, report_second = read_part('source/leaves.json')
    frames = len(first)
    if frames % len(second):
        raise ValueError('Leaf duration must divide the main animation duration for a seamless shared loop')
    plate = background()
    paths = [output / 'garden.mp4', output / 'garden.webm']
    processes = [encoder(ffmpeg, path) for path in paths]
    try:
        for index in range(frames):
            base = decode(first[index])
            merged = Image.alpha_composite(base, decode(second[index % len(second)]))
            processes[0].stdin.write(Image.alpha_composite(plate, merged).convert('RGB').tobytes())
            processes[1].stdin.write(merged.tobytes())
            if index == 0:
                merged.save(output / 'garden-poster.webp', quality=95)
            if index % 60 == 0:
                print(f'Synchronized overlay: {index}/{frames}', flush=True)
        for process in processes:
            process.stdin.close()
            if process.wait() != 0:
                raise RuntimeError('Video conversion failed')
    finally:
        for process in processes:
            if process.poll() is None:
                process.kill()
    report = {'sources': [report_first, report_second], 'sourceOrder': ['source/garden.json', 'source/leaves.json'],
              'sky': SKY, 'outputSize': list(SIZE), 'fps': 24,
              'encoding': {'vp9Crf': 22, 'h264Crf': 18, 'sourceFrameSize': [3439, 1080]},
              'video': {'file': paths[0].name, 'bytes': paths[0].stat().st_size, 'durationSeconds': report_first['durationSeconds']},
              'transparentVideo': {'file': paths[1].name, 'bytes': paths[1].stat().st_size, 'durationSeconds': report_first['durationSeconds']},
              'ground': GREEN, 'displayCropHeight': 920, 'leafRepeats': frames // len(second),
              'note': 'WebM VP9 has alpha over native SVG terrain. MP4 precomposites corrected terrain as compatibility fallback. Canonical sources preserved byte-for-byte. Main animation keeps its native duration; shorter leaf layer repeats at its native speed.'}
    for path in [*paths, output / 'garden-poster.webp']:
        path.replace(media / path.name)
    temporary.cleanup()
    (SOURCE / 'animation-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key:report[key] for key in ['video','transparentVideo']}, indent=2), flush=True)


def build_mobile(ffmpeg):
    # 手机版是一份独立图片序列，不叠加桌面叶子；底部补 1px 透明像素满足编码偶数高。
    frames, source_report = read_part('source/garden-mobile.json', (1648, 889, 24, 0))
    size = (1648, 890)
    with tempfile.TemporaryDirectory(prefix='.garden-mobile-build-', dir=SOURCE) as directory:
        output = Path(directory)
        paths = [output / 'garden-mobile.mp4', output / 'garden-mobile.webm']
        # 与页面 ground.svg 的 viewBox 1735×466 同比例拉伸；最后一行接 Footer 绿底。
        plate = background((1648, 889), ground_height=466)
        padded_plate = Image.new('RGBA', size, GREEN)
        padded_plate.paste(plate, (0, 0))
        processes = [encoder(ffmpeg, path, size) for path in paths]
        try:
            for index, frame in enumerate(frames):
                merged = Image.new('RGBA', size)
                merged.paste(decode(frame, (1648, 889)), (0, 0))
                processes[0].stdin.write(Image.alpha_composite(padded_plate, merged).convert('RGB').tobytes())
                processes[1].stdin.write(merged.tobytes())
                if index == 0:
                    merged.save(output / 'garden-mobile-poster.webp', quality=95)
                if index % 60 == 0:
                    print(f'Mobile animation: {index}/{len(frames)}', flush=True)
            for process in processes:
                process.stdin.close()
                if process.wait() != 0:
                    raise RuntimeError('Mobile video conversion failed')
        finally:
            for process in processes:
                if process.poll() is None:
                    process.kill()
        report = {
            'sources': [source_report], 'outputSize': list(size), 'fps': 24,
            'displayCropHeight': 889,
            'encoding': {'vp9Crf': 22, 'h264Crf': 18, 'sourceFrameSize': [1648, 889], 'paddingBottom': 1},
            'video': {'file': paths[0].name, 'bytes': paths[0].stat().st_size, 'durationSeconds': source_report['durationSeconds']},
            'transparentVideo': {'file': paths[1].name, 'bytes': paths[1].stat().st_size, 'durationSeconds': source_report['durationSeconds']},
            'poster': {'file': 'garden-mobile-poster.webp', 'bytes': (output / 'garden-mobile-poster.webp').stat().st_size},
            'sky': SKY, 'ground': GREEN,
            'note': 'Standalone mobile composition at native speed. No desktop leaf overlay. Original source bytes preserved; one transparent bottom row added for even encoding height.'}
        for path in [*paths, output / 'garden-mobile-poster.webp']:
            path.replace(SOURCE / 'media' / path.name)
    (SOURCE / 'mobile-animation-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', default='ffmpeg')
    parser.add_argument('--variant', choices=['desktop', 'mobile'], default='desktop')
    args = parser.parse_args()
    (build_mobile if args.variant == 'mobile' else build)(args.ffmpeg)
