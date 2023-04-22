import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import cat from "../../public/images/cat.png";
import user from "../../public/images/user.png";

type Rate = {
  EUR: number;
  USD: number;
  RON: number;
  timestamp: Date;
};
const ExchangeRates = () => {
  const [rate, setRate] = useState<Rate>({
    EUR: 0,
    USD: 0,
    RON: 0,
    timestamp: new Date(),
  });
  const getExchangeRate = async () => {
    axios
      .get("https://api.coinbase.com/v2/exchange-rates?currency=ETH", {})
      .then(function (response) {
        setRate({
          EUR: response.data.data.rates.EUR,
          USD: response.data.data.rates.USD,
          RON: response.data.data.rates.RON,
          timestamp: new Date(),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getExchangeRate();
  }, []);
  return (
    <div className="flex flex-col glass p-10 rounded-xl">
      <div className="grid">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src={cat} alt="cat" />
            </div>
          </div>
          <div className="chat-header">
            Me
            <time className="text-xs opacity-50 ml-2">
              {`${rate.timestamp
                .getHours()
                .toString()
                .padStart(2, "0")}:${rate.timestamp
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
            </time>
          </div>
          <div className="chat-bubble bg-blue-600 text-white">
            Hey Siri, give me the exchange rate for{" "}
            {<span className="underline font-bold">Ethereum</span>} in USD, EUR
            and RON
          </div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src={user} alt="user" />
            </div>
          </div>
          <div className="chat-header">
            Siri
            <time className="text-xs opacity-50 ml-2">
              {`${rate.timestamp
                .getHours()
                .toString()
                .padStart(2, "0")}:${rate.timestamp
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
            </time>{" "}
          </div>
          <div className="chat-bubble bg-blue-600 text-white">
            No problem, I will request the information from the Coinbase API
          </div>
          <div className="chat-footer opacity-50">
            Seen at
            {` ${rate.timestamp
              .getHours()
              .toString()
              .padStart(2, "0")}:${rate.timestamp
              .getMinutes()
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div>
      </div>
      <div className="stats mt-4 divide-green-800 stats-vertical lg:stats-horizontal shadow bg-white text-black">
        <div className="stat">
          <div className="stat-title opacity-100">USD</div>
          <div className="stat-value text-lg text-green-600">{rate?.USD}</div>
          <div className="stat-desc">{rate.timestamp.toLocaleString()}</div>
        </div>

        <div className="stat">
          <div className="stat-title opacity-100">RON</div>
          <div className="stat-value text-lg text-green-600">{rate?.RON}</div>
          <div className="stat-desc">{rate.timestamp.toLocaleString()}</div>
        </div>

        <div className="stat">
          <div className="stat-title opacity-100">EUR</div>
          <div className="stat-value text-lg text-green-600">{rate?.EUR}</div>
          <div className="stat-desc">{rate.timestamp.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRates;
