import { app, Menu } from "electron";
import { ipcWebContentSend } from "./utils.js";

export function createMenu(mainWindow: Electron.BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      // Show the main window
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
      // App submenu (for Quit, etc.)
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Quit",
            click: app.quit,
          },
        ],
      },
      // Example: Generic Actions submenu
      {
        label: "Actions",
        type: "submenu",
        submenu: [
          {
            label: "Say Hello",
            click: () => {
              // Example: Send a message to the renderer process
              ipcWebContentSend(
                "showMessage",
                mainWindow.webContents,
                "Hello From Actions Menu"
              );
            },
          },
          {
            label: "Open Dev Tools",
            click: () => {
              mainWindow.webContents.openDevTools({ mode: "right" });
            },
          },
          // Add more menu items here as needed
          // {
          //   label: "Custom Action",
          //   click: () => {
          //     // Your custom logic here
          //   },
          // },
        ],
      },
    ])
  );
}
