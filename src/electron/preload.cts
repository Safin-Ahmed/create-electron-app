const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: any) => void) => {
    return ipcOn("statistics", (stats) => {
      callback(stats);
    });
  },
  getStaticData: async () => ipcInvoke("getStaticData"),
  sendFrameAction: (payload) => {
    ipcSend("sendFrameWindowAction", payload);
  },
  subscribeChangeView: (callback: (view: any) => void) => {
    return ipcOn("changeView", (view) => {
      callback(view);
    });
  },
  subscribeShowMessage: (callback: (message: string) => void) => {
    return ipcOn("showMessage", (message) => {
      callback(message);
    });
  },
  getData: async () => ipcInvoke("getData"),
  getSystemInfo: async () => ipcInvoke("getSystemInfo"),
  reload: () => ipcInvoke("reloadWindow"),
  openDevTools: () => ipcInvoke("openDevTools"),
  getAppDataPath: () => ipcInvoke("getAppDataPath"),
  showNotification: () => ipcInvoke("showNotification"),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);

  // Subscribe function
  electron.ipcRenderer.on(key, cb);

  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
