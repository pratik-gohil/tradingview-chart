export async function getBars({
  exchangeSegment,
  exchangeInstrumentID,
  startTime,
  endTime,
  compressionValue = 60,
  token,
}) {
  const response = await fetch(
    `https://devtrade.lkp.net.in/marketdata/instruments/ohlc?exchangeSegment=${exchangeSegment}&exchangeInstrumentID=${exchangeInstrumentID}&startTime=${startTime}&endTime=${endTime}&compressionValue=${compressionValue}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.json();
}

export async function subscribeInstruments({
  instruments,
  xtsMessageCode = 1501,
  token,
}) {
  const response = await fetch(
    `https://devtrade.lkp.net.in/marketdata/instruments/subscription`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        instruments,
        xtsMessageCode,
      }),
    }
  );
  return response;
}

export async function unsubscribeInstruments({
  instruments,
  xtsMessageCode = 1501,
  token,
}) {
  const response = await fetch(
    `https://devtrade.lkp.net.in/marketdata/instruments/subscription`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        instruments,
        xtsMessageCode,
      }),
    }
  );
  return response;
}
