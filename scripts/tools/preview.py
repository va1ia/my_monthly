#!/usr/bin/env python3
"""目录：1. 清单自动同步 2. 本地静态预览。"""
import argparse
import importlib.util
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Lock
from urllib.parse import urlsplit
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('sync_marquee', Path(__file__).with_name('sync-marquee.py'))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)
lock = Lock()


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        if urlsplit(self.path).path == '/' + sync.MANIFEST.as_posix():
            with lock:
                sync.sync_manifest()
        return super().send_head()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='带 logo 自动同步的本地预览')
    parser.add_argument('--port', type=int, default=4173)
    args = parser.parse_args()
    sync.sync_manifest()
    print(f'Preview: http://127.0.0.1:{args.port}/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), PreviewHandler).serve_forever()
