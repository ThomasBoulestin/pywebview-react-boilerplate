import { useContext, useEffect, useMemo, useState } from "react";

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
import { usePythonApi, usePythonState } from "../../hooks/pythonBridge";
import { GeneralContext } from "../GeneralContext/GeneralContext";
import { ToastContext } from "../ToastContext/ToastContext";

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

const switchASC = defineFileAction({
  id: "switch_asc",
  //   hotkeys: ["ctrl+o"],
  button: {
    name: "Switch ASC",
    toolbar: false,
    contextMenu: true,
    // icon: ChonkyIconFA.flash,
  },
});

const switchAXI = defineFileAction({
  id: "switch_axi",
  //   hotkeys: ["ctrl+o"],
  button: {
    name: "Switch AXI",
    toolbar: false,
    contextMenu: true,
    // icon: ChonkyIconFA.flash,
  },
});

export default function FileExplorer() {
  const { addToast } = useContext(ToastContext);

  const { current_path, current_name, root_path, dispatch } =
    useContext(GeneralContext);

  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [currentFileMap, setCurrentFileMap] = useState({
    root: {
      id: "root",
      name: "fsdfsd",
      isDir: true,
      childrenIds: [],
      contentLoaded: true,
      path: "DummyPath/lol/sdfdsf/qsdqsd",
    },
  });

  const files = useFiles(currentFileMap, currentFolderId);
  const folderChain = useFolderChain(currentFileMap, currentFolderId);

  useEffect(() => {
    console.log(currentFileMap[currentFolderId].path);

    dispatch({
      type: "set_current_path",
      value: currentFileMap[currentFolderId].path,
    });

    dispatch({
      type: "set_current_name",
      value: currentFileMap[currentFolderId].name,
    });
  }, [currentFolderId]);

  //   When the root path is changed --> reload the explorer
  useEffect(() => {
    try {
      pywebview.api.start_tree_load(root_path).then((res) => {
        let res_obj = JSON.parse(res);
        console.log(res_obj);

        setCurrentFolderId(res_obj.rootFolderId);
        setCurrentFileMap(res_obj.fileMap);

        addToast("success", "Success", "Path loaded");
      });
    } catch (error) {
      addToast("danger", "Error", "No python API available");
    }
  }, [root_path]);

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

  const switch_asc_handler = (selectedFiles) => {
    try {
      pywebview.api.switch_asc(selectedFiles).then((res) => {
        let res_list = JSON.parse(res);
        console.log(res_list);

        var newFileMap = {
          ...currentFileMap,
        };

        res_list.forEach((element) => {
          newFileMap[element.id] = element;
        });

        setCurrentFileMap(newFileMap);

        addToast("success", "Success", "Switched");
      });
    } catch (error) {
      addToast("danger", "Error", "");
    }
  };

  const switch_axi_handler = (selectedFiles) => {
    try {
      pywebview.api.switch_axi(selectedFiles).then((res) => {
        let res_list = JSON.parse(res);
        console.log(res_list);

        var newFileMap = {
          ...currentFileMap,
        };

        res_list.forEach((element) => {
          newFileMap[element.id] = element;
        });

        setCurrentFileMap(newFileMap);

        addToast("success", "Success", "Switched");
      });
    } catch (error) {
      addToast("danger", "Error", "");
    }
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

    if (data.id == "switch_asc") {
      switch_asc_handler(data.state.selectedFiles);
    }

    if (data.id == "switch_axi") {
      switch_axi_handler(data.state.selectedFiles);
    }
  };

  return (
    <div>
      {/* <div>current folder size = {currentFileMap[currentFolderId].size}</div> */}

      <div id="file-explorer" style={{ height: 900, width: 750 }}>
        <FileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={[SortFilesBySize, switchASC, switchAXI]}
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
