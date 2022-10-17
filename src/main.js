import Datafeed from "./datafeed.js";

let paramString = window.location.href.split("?")[1];
let queryString = new URLSearchParams(paramString);
const exchange = queryString.get("exchange");
const name = queryString.get("name");
const exchangeInstrumentID = queryString.get("exchangeInstrumentID");
const token = queryString.get("token");

window.tvWidget = new TradingView.widget({
  symbol: `${exchange}:${name}:${exchangeInstrumentID}:${token}`,
  interval: "1D",
  fullscreen: true,
  container: "tv_chart_container",
  datafeed: Datafeed,
  library_path: "../charting_library/",
  disabled_features: [
    "use_localstorage_for_settings",
    "header_symbol_search",
    "symbol_search_hot_key",
    "header_compare",
    "header_settings",
  ],
  enabled_features: ["hide_left_toolbar_by_default", "study_templates"],
  // preset: "mobile",
});
