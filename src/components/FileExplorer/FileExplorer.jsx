import { useEffect, useMemo, useState } from "react";

import {
  FullFileBrowser,
  setChonkyDefaults,
  ChonkyActions,
  defineFileAction,
  //   FileData,
  FileViewMode,
} from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import {
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from "chonky";
import { tst_files } from "./demo.fs_map";

import { usePythonApi, usePythonState } from "../../hooks/pythonBridge";

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  //   disableSelection: true,
  disableDragAndDropProvider: true,
  darkMode: true,
});

const SortFilesBySize = defineFileAction({
  id: "sort_files_by_size",
  sortKeySelector: (file) => (file ? file.size : undefined),
  button: {
    name: "Sort by size",
    toolbar: true,
    //   group: "Options",
  },
});

const fileActions = [SortFilesBySize];

export default function FileExplorer() {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [currentFileMap, setCurrentFileMap] = useState({
    root: {
      id: "root",
      name: "Please select directory to load",
      isDir: true,
      childrenIds: [],
      contentLoaded: true,
    },
  });

  const files = useFiles(currentFileMap, currentFolderId);
  const folderChain = useFolderChain(currentFileMap, currentFolderId);

  const init_handler = () => {
    pywebview.api.start_tree_load("Z:/").then((res) => {
      let res_obj = JSON.parse(res);
      console.log(res_obj);

      setCurrentFolderId(res_obj.rootFolderId);
      setCurrentFileMap(res_obj.fileMap);
    });
  };

  const load_path_handler = (targetFile) => {
    pywebview.api.load_path(targetFile.path, targetFile.id).then((res) => {
      let res_obj = JSON.parse(res);
      console.log(res_obj);

      var newFileMap = {
        ...currentFileMap,
        ...res_obj[0],
        [targetFile.id]: {
          ...currentFileMap[targetFile.id],
          childrenIds: [
            ...currentFileMap[targetFile.id].childrenIds,
            ...res_obj[1],
          ],
          contentLoaded: true,
        },
      };

      setCurrentFileMap(newFileMap);
      setCurrentFolderId(targetFile.id);
    });
  };

  const handleFileAction = (data) => {
    if (data.id == "open_files") {
      if (
        data.payload.targetFile.isDir &&
        data.payload.targetFile.contentLoaded
      ) {
        setCurrentFolderId(data.payload.targetFile.id);
      }

      if (
        data.payload.targetFile.isDir &&
        !data.payload.targetFile.contentLoaded
      ) {
        console.log("need to load", data);
        load_path_handler(data.payload.targetFile);
        // loadContent(data.payload.targetFile.id);
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          init_handler();
        }}
      >
        heyy
      </button>
      current folder size = {currentFileMap[currentFolderId].size}
      <div id="file-explorer" style={{ height: 900, width: 900 }}>
        <FileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleFileAction}
          // disableDefaultFileActions={true}
          defaultFileViewActionId={ChonkyActions.EnableListView.id}
          defaultSortActionId={ChonkyActions.SortFilesBySize.id}
        >
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </FileBrowser>
      </div>
    </div>
  );
}

export const useFiles = (fileMap, currentFolderId) => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const childrenIds = currentFolder.childrenIds;
    const files = childrenIds.map((fileId) => fileMap[fileId]);
    return files;
  }, [currentFolderId, fileMap]);
};

export const useFolderChain = (fileMap, currentFolderId) => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];

    const folderChain = [currentFolder];

    let parentId = currentFolder.parentId;
    while (parentId) {
      const parentFile = fileMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        break;
      }
    }

    return folderChain;
  }, [currentFolderId, fileMap]);
};

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
