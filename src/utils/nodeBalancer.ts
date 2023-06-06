/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import Web3 from "web3";
import { MULTICALL2_CONTRACT_ADDRESSES } from "../constants";
import { MockTerminus } from "../web3/contracts/types/MockTerminus";
const terminusAbi = require("../web3/abi/MockTerminus.json");
const multicallAbi = require("../web3/abi/Multicall2.json");

export const terminusContractState = (contractAddress: string, chainId: number) => {
  const web3 = new Web3();
  const MULTICALL2_CONTRACT_ADDRESS =
    MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
  const terminusContract = new web3.eth.Contract(
    terminusAbi,
    contractAddress,
  ) as unknown as MockTerminus;
  // const multicallContract = new web3.eth.Contract(multicallAbi, MULTICALL2_CONTRACT_ADDRESS);
  const target = contractAddress;
  const callDatas = [];
  callDatas.push(terminusContract.methods.poolBasePrice().encodeABI());
  callDatas.push(terminusContract.methods.paymentToken().encodeABI());
  callDatas.push(terminusContract.methods.contractURI().encodeABI());
  callDatas.push(terminusContract.methods.totalPools().encodeABI());
  callDatas.push(terminusContract.methods.terminusController().encodeABI());
  const queries = callDatas.map((callData) => {
    return { target, callData };
  });

  const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(
    {
      name: "tryAggregate",
      type: "function",
      inputs: [
        {
          internalType: "bool",
          name: "requireSuccess",
          type: "bool",
        },
        {
          components: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "callData",
              type: "bytes",
            },
          ],
          internalType: "struct Multicall2.Call[]",
          name: "calls",
          type: "tuple[]",
        },
      ],
    },
    ["false", queries as unknown as string],
  );
  const data = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        from: null,
        to: MULTICALL2_CONTRACT_ADDRESS,
        data: encodedFunctionCall,
      },
      "latest",
    ],
    id: 1,
  };

  const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
  const authorization = token ? { Authorization: `Bearer ${token}` } : {};

  return axios
    .post("https://api.moonstream.to/nb/wyrm/jsonrpc", data, {
      headers: {
        "Content-Type": "application/json",
        ...authorization,
      },
    })
    .then((response) => {
      console.log(response.data);
      const res2 = web3.eth.abi.decodeParameters(
        [
          {
            "Multicall2.Result[]": {
              success: "bool",
              returnData: "bytes",
            },
          },
        ],
        response.data.result,
      );
      console.log(res2[0]);
      return res2[0];
    })
    .then((results: { returnData: string; success: boolean }[]) => {
      const parsedResults = results.map(
        (result: { returnData: string; success: boolean }, idx: number) => {
          if (result.returnData === "0x") {
            return undefined;
          }
          let parsed;
          try {
            parsed = web3.utils.hexToNumberString(result.returnData);

            if (idx === 4 || idx === 1) {
              const adr = "0x" + result.returnData.slice(-40);
              parsed = web3.utils.toChecksumAddress(adr);
            }
            if (idx === 2) {
              parsed = "https://" + web3.utils.hexToUtf8(result.returnData).split("https://")[1];
            }
          } catch (e) {
            console.log(e);
            parsed = undefined;
          }
          return String(parsed);
        },
      );
      console.log(parsedResults);
    })
    .catch((error) => {
      console.error(error);
    });
};
