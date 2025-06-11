type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: {
    total: number;
    usage: number;
  };
};

type StaticData = {
  totalStorage: number;
  totalMemoryGB: number;
  cpuModel: string;
  cpuCores: number;
};

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (stats: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeChangeView: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;
    sendFrameAction: (payload: FrameWindowAction) => void;
    getData: () => Promise<{ message: string }>;
    subscribeShowMessage: (
      callback: (message: string) => void
    ) => UnsubscribeFunction;
    getSystemInfo: () => Promise<{
      cpuModel: string;
      cpuCores: number;
      totalMem: number;
      totalStorage: number;
      platform: string;
      arch: string;
      versions: Record<string, string>;
      gpu: string;
    }>;
    reload: () => void;
    openDevTools: () => void;
    getAppDataPath: () => Promise<string>;
    showNotification: () => Promise<void>;
  };
}

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameWindowAction: FrameWindowAction;
  getData: { message: string };
  showMessage: string;
  getSystemInfo: {
    cpuModel: string;
    cpuCores: number;
    totalMem: number;
    totalStorage: number;
    platform: string;
    arch: string;
    versions: Record<string, string>;
    gpu: string;
  };
  reloadWindow: void;
  openDevTools: void;
  getAppDataPath: string;
  showNotification: void;
};

type View = "CPU" | "RAM" | "STORAGE";

type UnsubscribeFunction = () => void;

type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";
