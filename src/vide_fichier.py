import os
from multiprocessing import Pool
import uuid
import json


def start_tree_load(path):

    fm, children_id = load_path(path, 'root')

    fileMap = {
        "rootFolderId": "root",
        "fileMap": fm
    }

    fileMap['fileMap']['root'] = {
        "id": "root",
        "name": path,
        "isDir": True,
        "childrenIds": children_id,
        "path": path,
        "size": 0,
        "size_human": 0,
        "contentLoaded": True,
    }

    return fileMap


def load_path(path, parentId):

    directory_content = os.listdir(path)

    directory_content_dir = [
        d for d in directory_content if os.path.isdir(os.path.join(path, d))]
    directory_content_dir_file = [
        d for d in directory_content if not os.path.isdir(os.path.join(path, d))]

    datas = [
    ]
    children_id = []

    index = 0
    for element in [directory_content_dir, directory_content_dir_file]:
        for i, element_name in enumerate(element):

            id = str(uuid.uuid4())
            children_id.append(id)

            dct = {
                "id": id,
                "name": element_name,
                "isDir": os.path.isdir(os.path.join(path, element_name)),
                "parentId": parentId,
                "childrenIds": [],
                "index": index,
                "path": os.path.join(path, element_name),
                "contentLoaded": False,
            }

            index += 1

            datas.append(
                dct
            )

    with Pool(5) as pool:
        # execute tasks in order
        for result in pool.map(inject_sizes, datas):
            if result[0] != '':
                datas[result[2]]['size_human'] = result[0]
                datas[result[2]]['size'] = result[1]
            else:
                print('err')

    file_map = {
    }

    for data in datas:
        file_map[data['id']] = data

    return file_map, children_id


def inject_sizes(element):
    try:
        if element['name'] not in ['', 'Maccro']:
            # print(element)
            size_raw = get_dir_size(element['path'])
            size = sizeof_fmt(size_raw)
            # eel.say_hello_js(size)
            return size, size_raw, element['index']
            # return 'OK'
    except:
        return '', '', ''

    return '', '', ''


def get_dir_size(path='.'):

    if not os.path.isdir(path):
        return os.stat(path).st_size

    total = 0
    with os.scandir(path) as it:
        for entry in it:
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_dir_size(entry.path)
    return total


def sizeof_fmt(num, suffix="B"):
    for unit in ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"):
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"


if __name__ == "__main__":
    print(json.dumps(start_tree_load("Z:")))
