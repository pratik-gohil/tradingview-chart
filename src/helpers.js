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
