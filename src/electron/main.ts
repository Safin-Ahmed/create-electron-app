import { app, BrowserWindow, Menu, Notification } from "electron";
import { ipcHandle, ipcOn, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { pollResources } from "./resourceManager.js";
import os from "os";
import fs from "fs";

Menu.setApplicationMenu(null);

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: false,
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);

  ipcHandle("getData", () => {
    return { message: "Hello from Electron!" };
  });

  ipcHandle("getSystemInfo", async () => {
    // CPU
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || "Unknown";
    const cpuCores = cpus.length;
    // RAM
    const totalMem = os.totalmem();
    // Storage
    let totalStorage = 0;
    try {
      const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
      totalStorage = stats.bsize * stats.blocks;
    } catch {
      totalStorage = 0;
    }
    // Platform
    const platform = os.platform();
    const arch = os.arch();
    // Versions
    const versions = process.versions;
    // GPU (optional, may not be available on all platforms)
    let gpu = "";
    try {
      const gpuInfo = (await app.getGPUInfo?.("basic")) as {
        graphics?: { devices?: { vendor: string; device: string }[] };
      };
      gpu =
        gpuInfo?.graphics?.devices
          ?.map((d) => d.vendor + " " + d.device)
          .join(", ") || "";
    } catch {
      gpu = "";
    }
    return {
      cpuModel,
      cpuCores,
      totalMem,
      totalStorage,
      platform,
      arch,
      versions,
      gpu,
    } as {
      cpuModel: string;
      cpuCores: number;
      totalMem: number;
      totalStorage: number;
      platform: string;
      arch: string;
      versions: Record<string, string>;
      gpu: string;
    };
  });

  ipcHandle("getAppDataPath", () => {
    return app.getPath("userData");
  });

  ipcOn("sendFrameWindowAction", (payload) => {
    switch (payload) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
      case "MAXIMIZE":
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
    }
  });

  // Listen for reload and devtools events
  ipcHandle("reloadWindow", () => {
    mainWindow.webContents.reload();
  });
  ipcHandle("openDevTools", () => {
    mainWindow.webContents.openDevTools({ mode: "right" });
  });

  ipcHandle("showNotification", () => {
    new Notification({
      title: "Electron Notification",
      body: "This is a native notification from Electron!",
    }).show();
  });

  createTray(mainWindow);
  createMenu(mainWindow);

  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }

    console.log("Will not close");
    e.preventDefault();
    mainWindow.hide();

    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
    console.log("will close");
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
