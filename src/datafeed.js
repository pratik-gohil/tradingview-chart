import { getBars } from "./helpers.js";

const supportedResolutions = [
  "1",
  "2",
  "3",
  "5",
  "10",
  "15",
  "30",
  "60",
  "1D",
  "1W",
  "1M",
];

const config = {
  supported_resolutions: supportedResolutions,
};

export default {
  onReady: (cb) => {
    console.log("=====onReady running");
    setTimeout(() => cb(config), 0);
  },
  resolveSymbol: (symbol, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log("======resolveSymbol running");
    const [exchange, name, exchangeInstrumentID, token] = symbol.split(":");

    var symbol_stub = {
      name,
      description: name,
      type: "stock",
      session: "0930-1600",
      timezone: "Asia/Kolkata",
      ticker: `${exchange}:${name}`,
      exchange,
      supported_resolution: supportedResolutions,
      data_status: "streaming",
      exchangeInstrumentID,
      token,
      minmov: 1,
      pricescale: 100,
      intraday_multipliers: ["1", "60"],
      has_intraday: true,
      volume_precision: 2,
    };

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub);
    }, 0);
  },
  getBars: async function (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) {
    console.log("=====getBars running", symbolInfo);

    const { from, to, firstDataRequest } = periodParams;

    let compression;
    switch (resolution) {
      case "1":
        compression = 60;
        break;
      case "2":
        compression = 120;
        break;
      case "3":
        compression = 180;
        break;
      case "5":
        compression = 300;
        break;
      case "10":
        compression = 600;
        break;
      case "15":
        compression = 900;
        break;
      case "30":
        compression = 1800;
        break;
      case "60":
        compression = 3600;
        break;
      case "1D":
        compression = "D";
        break;
      case "1W":
        compression = "W";
        break;
      case "1M":
        compression = "M";
        break;
      default:
        compression = resolution;
        break;
    }

    const bars = await getBars({
      exchangeSegment: symbolInfo.exchange,
      exchangeInstrumentID: symbolInfo.exchangeInstrumentID,
      startTime: from,
      endTime: to,
      compressionValue: compression,
      token: symbolInfo.token,
    }).then((res) => {
      if (res.type === "success") {
        const bars = res.result.dataReponse.split(",");
        return bars.map((bar) => {
          const [time, open, high, low, close, volume, OI] = bar.split("|");
          let epochTime;
          switch (compression) {
            case "D":
              epochTime = Number(time) * 1000 + 330 * 60 * 1000;
              break;
            case "W":
              epochTime = Number(time) * 1000 + 330 * 60 * 1000;
              break;
            case "M":
              epochTime = Number(time) * 1000 + 330 * 60 * 1000;
              break;
            default:
              epochTime = Number(time) * 1000;
              break;
          }
          return {
            time: epochTime,
            low,
            high,
            open,
            close,
            volume,
            openInterest: OI,
          };
        });
      } else {
        return [];
      }
    });

    if (bars.length) {
      onHistoryCallback(bars, { noData: false });
    } else {
      onHistoryCallback(bars, { noData: true });
    }
  },
};
