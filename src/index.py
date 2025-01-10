import os
import threading
import webview

from time import time

import vide_fichier
import json
import time

import multiprocessing

multiprocessing.freeze_support()


class Api:

    def start_tree_load(self, path):
        time.sleep(0.1)
        return json.dumps(vide_fichier.start_tree_load(path))

    def load_path(self, path, parentId):
        time.sleep(0.1)
        return json.dumps(vide_fichier.load_path(path, parentId))

    def switch_asc(self, chonky_list):
        time.sleep(0.1)
        return json.dumps(vide_fichier.switch_asc_list(chonky_list))

    def switch_axi(self, chonky_list):
        time.sleep(0.1)
        return json.dumps(vide_fichier.switch_axi_list(chonky_list))


def get_entrypoint():
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

    if exists('../gui/index.html'):  # unfrozen development
        return '../gui/index.html'

    if exists('../Resources/gui/index.html'):  # frozen py2app
        return '../Resources/gui/index.html'

    if exists('./gui/index.html'):
        return './gui/index.html'

    raise Exception('No index.html found')


entry = get_entrypoint()


if __name__ == '__main__':
    window = webview.create_window(
        'VideFichier', entry, js_api=Api(), width=1300, height=1000)
    webview.start(debug=True)
