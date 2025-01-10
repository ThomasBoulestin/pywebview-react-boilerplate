import os
import shutil
from multiprocessing import Pool, freeze_support
import uuid
import json
import re


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

    with Pool(6) as pool:
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


def create_d3hsp_backup_infos(d3hsp_path):

    #       Date: 12/20/2024      Time: 10:31:13
    #      |  Version : mpp d R13                              |
    #      |  Revision: R13.1.1-6-ge41832f8f0                  |
    #      |  Platform   : WINX64 Microsoft MPI V10.0          |
    #      |  OS Level   : Windows 7/8/10 & Server 2016/2019   |
    #      |  Compiler   : Intel Fortran XE 2019 MSVC++ 2019   |
    #      |  Hostname   : COLAS41096                          |
    #      |  Precision  : Double precision (I8R8)             |
    #  MPP execution with       8 procs

    str_out = ""

    dir_path = os.path.dirname(d3hsp_path)

    with open(d3hsp_path) as f:
        for line in f:
            if "Date:" in line and "Time:" in line:
                str_out += line

            if "Version :" in line:
                str_out += line

            if "Revision:" in line:
                str_out += line

            if "Platform   :" in line:
                str_out += line

            if "OS Level   :" in line:
                str_out += line

            if "Compiler   :" in line:
                str_out += line

            if "Hostname   :" in line:
                str_out += line

            if "Precision  :" in line:
                str_out += line

            if "MPP execution with" in line:
                str_out += line
                return str_out

            if "number of cpus for parallel computations" in line:
                str_out += line
                return str_out

    with open(os.path.join(dir_path, 'd3hsp_backup_infos.axi'), 'w') as f:
        f.write(str_out)

    return


def create_dummy_tree(path):

    files = {
        "root": ["AXI-TST-000.dyn",
                 "AXI-TST-000a.dyn",
                 "main.dyn",
                 "EFFORT.dyn",

                 "mannequin.k",
                 "mannequin.key",
                 "mannequin.keyword",


                 "16303.png",
                 "ASI-THIV.png",
                 "img.jpg",

                 "d3plot",
                 "d3plot01",
                 "d3plot02",
                 "d3plot03",
                 "d3plot04",

                 "d3hsp",

                 "d3dump01.0001",
                 "d3dump01.0002",
                 "d3dump01.0003",
                 "d3dump01.0004",
                 "d3dump02.0001",
                 "d3dump02.0002",
                 "d3dump02.0003",
                 "d3dump02.0004",

                 "binout0000",
                 "binout0005",

                 "cont_profile.csv",
                 "cont_profile.xy",

                 "status.out",
                 "stdin.save",




                 ],

        "images": [
            "16303.png",
            "ASI-THIV.png",
            "img.jpg",
        ],
        "Videos": [
            "video.mp4",
            "video2.mp4",
            "video3.mp4",
        ],

    }

    for d in os.listdir(path):
        shutil.rmtree(os.path.join(path, d), ignore_errors=True)

    for i in range(1, 11):
        dir_name = os.path.join(path, str(i).zfill(3))

        if i == 6:
            dir_name += '-ASC'
        if i == 7:
            dir_name += '-AXI'

        os.mkdir(dir_name)
        for f in files["root"]:
            with open(os.path.join(dir_name, f), 'a'):
                os.utime(path, None)

        os.mkdir(os.path.join(dir_name, 'images'))
        for f in files["images"]:
            with open(os.path.join(dir_name, 'images', f), 'a'):
                os.utime(path, None)

        os.mkdir(os.path.join(dir_name, 'Videos'))
        for f in files["Videos"]:
            with open(os.path.join(dir_name, 'Videos', f), 'a'):
                os.utime(path, None)


def clean_calc_dir(path, conditions):

    conditions = {
        'calcul': {
            'prevent_AXI': True,
            'prevent_ASC': True,
            'preventSelection': ['001', '002'],
        },
        'sub': {
            'preserve_folders': False,
            'generate_d3hsp_backup': True,
            'extensions_to_keep': ['.dyn', '.key', '.keyword', '.k', '.png', '.jpg', '.axi'],
        }
    }

    for dir in os.listdir(path):

        if conditions['calcul']['prevent_AXI']:
            if 'axi' in dir.lower():
                continue

        if conditions['calcul']['prevent_ASC']:
            if 'asc' in dir.lower():
                continue

        if len(conditions['calcul']['preventSelection']) > 0:
            if dir in conditions['calcul']['preventSelection']:
                continue

        cur_dir = os.path.join(path, dir)
        for f in os.listdir(cur_dir):
            looping_file = os.path.join(cur_dir, f)

            if f == "d3hsp" and conditions['sub']['generate_d3hsp_backup']:
                create_d3hsp_backup_infos(looping_file)

            if os.path.isdir(looping_file):
                if conditions['sub']['preserve_folders']:
                    continue
                else:
                    shutil.rmtree(looping_file)

            if os.path.isfile(looping_file):
                filename, file_extension = os.path.splitext(looping_file)

                if file_extension in conditions['sub']['extensions_to_keep']:
                    continue

                else:
                    os.remove(looping_file)


def switch_asc_list(chonky_list):

    for el in chonky_list:
        name, pth = switch_asc(el['path'])

        el['path'] = pth
        el['name'] = name

    return chonky_list


def switch_axi_list(chonky_list):

    for el in chonky_list:
        name, pth = switch_axi(el['path'])

        el['path'] = pth
        el['name'] = name

    return chonky_list


def switch_asc(path):

    print(path)

    cur_dir = os.path.basename(path)
    cur_pth = os.path.dirname(path)
    nums = re.findall(r'\d+', cur_dir)[0]

    if 'asc' in cur_dir.lower():
        cur_dir = nums

    else:
        cur_dir = nums + '-ASC'

    os.rename(path, os.path.join(cur_pth, cur_dir))

    return cur_dir, os.path.join(cur_pth, cur_dir)


def switch_axi(path):

    cur_dir = os.path.basename(path)
    cur_pth = os.path.dirname(path)
    nums = re.findall(r'\d+', cur_dir)[0]

    if 'axi' in cur_dir.lower():
        cur_dir = nums

    else:
        cur_dir = nums + '-AXI'

    os.rename(path, os.path.join(cur_pth, cur_dir))

    return cur_dir, os.path.join(cur_pth, cur_dir)


if __name__ == "__main__":
    # print(create_d3hsp_backup_infos(r"\\Colas41096\axi\AST\Calcul\191\d3hsp"))

    pth = r'Z:\tst\calcul'

    # create_dummy_tree(pth)

    # clean_calc_dir(pth, "")

    switch_axi(os.path.join(pth, '007-AXI'))
