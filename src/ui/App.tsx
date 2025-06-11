import { useEffect, useState } from "react";
import "./App.css";
import electronLogo from "./assets/electron-logo.svg";
import { Chart } from "./Chart";
import { useStatistics } from "./hooks/useStatistics";

type SystemInfo = {
  cpuModel: string;
  cpuCores: number;
  totalMem: number;
  totalStorage: number;
  platform: string;
  arch: string;
  versions: Record<string, string>;
  gpu: string;
};

function formatGB(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
}

function App() {
  const [message, setMessage] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const statistics = useStatistics(20);

  console.log("statistics", statistics);

  // Extract CPU, RAM, and Storage usage arrays from statistics
  const cpuData = statistics.map((stat) => stat.cpuUsage);
  const ramData = statistics.map((stat) => stat.ramUsage);
  const storageData = statistics.map((stat) => stat.storageData.usage);

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electron.getData();
      setMessage(data.message);
      const sys = await window.electron.getSystemInfo();
      setSystemInfo(sys);
    };
    fetchData();

    const unsubscribe = window.electron.subscribeShowMessage((message) => {
      console.log("Received Message from Electron", message);
      setToast(message);
      setTimeout(() => {
        setToast("");
      }, 4000);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      {toast && <div className="toast">{toast}</div>}
      <header>
        <button
          id="close"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
        />
        <button
          id="minimize"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
        />
        <button
          id="maximize"
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
        />
      </header>
      <img src={electronLogo} className="logo spin" alt="Electron logo" />
      <h1>Welcome to Electron + React!</h1>
      <p>{message}</p>
      {systemInfo && (
        <div className="chart-card" style={{ margin: "2rem auto 0 auto" }}>
          <h2>System Info</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>
              <b>CPU:</b> {systemInfo.cpuModel} ({systemInfo.cpuCores} cores)
            </span>
            <span>
              <b>RAM:</b> {formatGB(systemInfo.totalMem)}
            </span>
            <span>
              <b>Storage:</b> {formatGB(systemInfo.totalStorage)}
            </span>
            <span>
              <b>Platform:</b> {systemInfo.platform} ({systemInfo.arch})
            </span>
            <span>
              <b>Electron:</b> {systemInfo.versions.electron}
            </span>
            <span>
              <b>Node:</b> {systemInfo.versions.node}
            </span>
            <span>
              <b>Chrome:</b> {systemInfo.versions.chrome}
            </span>
            <span>
              <b>GPU:</b> {systemInfo.gpu ? systemInfo.gpu : "Not available"}
            </span>
          </div>
        </div>
      )}
      <div className="charts-grid">
        <div className="chart-card graph-card">
          <h2>CPU Usage</h2>
          <Chart data={cpuData} maxDataPoints={20} />
        </div>
        <div className="chart-card graph-card">
          <h2>RAM Usage</h2>
          <Chart data={ramData} maxDataPoints={20} />
        </div>
        <div className="chart-card graph-card">
          <h2>Storage Usage</h2>
          <Chart data={storageData} maxDataPoints={20} />
        </div>
      </div>
      <div className="devtools-panel">
        <h2>Developer Tools</h2>
        <div className="devtools-actions">
          <button
            className="counter-btn"
            onClick={() => window.electron.reload()}
          >
            Reload Window
          </button>
          <button
            className="counter-btn"
            onClick={() => window.electron.openDevTools()}
          >
            Open DevTools
          </button>
          <button
            className="counter-btn"
            onClick={async () => {
              await window.electron.showNotification();
            }}
          >
            Show Notification
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
