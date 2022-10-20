import { subscribeInstruments, unsubscribeInstruments } from "./helpers.js";

let paramString = window.location.href.split("?")[1];
let queryString = new URLSearchParams(paramString);
const token = queryString.get("token");

const socket = io("https://devtrade.lkp.net.in", {
  path: "/marketdata/socket.io",
  query: {
    token: token,
    userID: "TEST03",
    publishFormat: "JSON",
    broadcastMode: "Full",
  },
  transports: ["websocket"],
});

const channelToSubscription = new Map();

const Segments = {
  NSE: 1,
  NSECM: 1,
  NSEFO: 2,
  NSECD: 3,
  BSE: 11,
  BSECM: 11,
  BSEFO: 12,
  MCXFO: 51,
};

export async function subscribeBars(
  symbolInfo,
  resolution,
  updateCb,
  uid,
  resetCache,
  lastDailyBar
) {
  const channelString = `${symbolInfo.exchange}-${symbolInfo.exchangeInstrumentID}`;
  const handler = {
    id: uid,
    callback: updateCb,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    uid,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    "[subscribeBars]: Subscribe to streaming. Channel:",
    channelString
  );

  await subscribeInstruments({
    instruments: [
      {
        exchangeSegment: Segments[symbolInfo.exchange],
        exchangeInstrumentID: symbolInfo.exchangeInstrumentID,
      },
    ],
    xtsMessageCode: 1505,
  });
}

export async function unsubscribeBars(subscriberUID) {
  for (const channelString of channelToSubscription.keys()) {
    const [exchange, id] = channelString;
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
          channelString
        );
        await unsubscribeInstruments({
          instruments: [
            {
              exchangeSegment: exchange,
              exchangeInstrumentID: id,
            },
          ],
          xtsMessageCode: 1505,
        });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}

socket.on("connect", () => {
  console.log("===Socket connected");
});
socket.on("disconnect", (e) => {
  console.log("===Socket disconnected:", e);
});
socket.on("error", (err) => {
  console.log("====socket error", err);
});
