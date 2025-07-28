import { ICollectionType, IConfig } from "./lib/app/types";

const CONFIG: IConfig = {
    coinDenom: "uandr",
    name: "dora crypto exchange dApp",
    chainId: "elgafar-1",
    createdDate: "2024-03-31T19:01:01.148Z",
    modifiedDate: "2024-03-31T19:01:01.148Z",
    id: "andromeda",
    collections: [
        {
            exchange:
                "andr1juelw6h77mhneqxfy457ge6gq3xjqp3kx302qt00tm7r2p8c0hxsjhenfz",
            cw20: "andr184pswkfg35s482rgnvun9409zj89f37rq6mal5snx5yq2l8ah9eqzzznzq",
            name: "dora crypto exchange dApp",
            type: ICollectionType.EXCHANGE,
            id: "embeddables-exchange-1",
        },
        {
            "cw721": "andr13re6el7k0sdzrkernueq2jepwy8psd4829runltvvpw0d0t34wws9l9nmv",
            "auction": "andr1p9ru9a6fhgwzkmqtr4gnkhwv4dhlxhwy7s48yllkmdelp5m5gkzsjsah7r",
            "name": "doracryptoNFT",
            "type":  ICollectionType.AUCTION,
            "id": "embeddables-auction-1"
        }
    ],
    
};

export default CONFIG;
