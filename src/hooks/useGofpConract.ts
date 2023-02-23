/* eslint-disable @typescript-eslint/no-var-requires */
import { useQuery, useMutation, useQueryClient } from "react-query"
import { hookCommon, useToast } from ".";
import { MoonstreamWeb3ProviderInterface } from "../types/Moonstream";
const GardenABI = require('../web3/abi/GoFPABI.json');
import { GOFPFacet as GardenABIType } from '../web3/contracts/types/GOFPFacet';
const ERC721MetadataABI = require('../web3/abi/MockERC721.json');
import { MockERC721 } from '../web3/contracts/types/MockERC721';
import { ChoosePathData, SessionMetadata } from "../../src/components/gofp/GoFPTypes";
import http from "../utils/http";





export const useGofpContract = ({
  sessionId,
  gardenContractAddress,
  web3ctx,
}: {
  sessionId: number,
  gardenContractAddress: string,
  web3ctx: MoonstreamWeb3ProviderInterface
}) => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const toast = useToast()
  const queryClient = useQueryClient()
  const gardenContract: any = new web3ctx.web3.eth.Contract(
    GardenABI
  ) as any as GardenABIType;
  gardenContract.options.address = gardenContractAddress;
  const tokenContract = new web3ctx.web3.eth.Contract(
    ERC721MetadataABI
  ) as unknown as MockERC721;
  
  const fetchMetadataUri = async (uri: string) => {
    return http(
      {
        method: "GET",
        url: uri,
      },
      true
    );
  };

  

  const sessionInfo = useQuery(
    ["get_session", gardenContractAddress, sessionId],
    async () => {
      return gardenContract.methods.getSession(sessionId).call();
    },
    {
      ...hookCommon,
      enabled: !!web3ctx.chainId && !!gardenContractAddress && sessionId > 0
    }
  );


  const sessionMetadata =  useQuery<SessionMetadata | undefined>(
    ["get_metadata", sessionInfo],
    async () => {
      if (!sessionInfo || !sessionInfo.data) {
        return;
      }

      const uri = sessionInfo.data[5] + `?timestamp=${new Date().getTime()}`;

      return fetchMetadataUri(uri).then((res) => {
        return res.data as SessionMetadata;
      });
    },
    {
      ...hookCommon,
    }
  );


  const currentStage = useQuery<number>(
    ["get_current_stage", gardenContractAddress, sessionId, sessionInfo],
    async () => {
      if (
        gardenContractAddress == ZERO_ADDRESS ||
        sessionId < 1 ||
        !sessionInfo.data
      )
        return 1; //TODO


      const result = await gardenContract.methods
        .getCurrentStage(sessionId)
        .call();
      const _stage = parseInt(result);
      //setSelectedStage(Math.min(_stage, sessionInfo.data[6].length)); //TODO
      return _stage;
    },
    {
      ...hookCommon,
      refetchInterval: 15 * 1000,
      notifyOnChangeProps: ["data"],
    }
  );

  const correctPaths = useQuery<number[]>(
    ["get_correct_paths", gardenContractAddress, sessionId, currentStage.data],
    async () => {
      const answers: number[] = [];
      console.log('correct paths query')
      if (
        gardenContractAddress == ZERO_ADDRESS ||
        sessionId < 1 ||
        !currentStage.data ||
        currentStage.data <= 1
      )
        return answers;

      const gardenContract: any = new web3ctx.web3.eth.Contract(
        GardenABI
      ) as any as GardenABIType;
      gardenContract.options.address = gardenContractAddress;

      for (let i = 1; i < currentStage.data; i++) {
        const ans = await gardenContract.methods
          .getCorrectPathForStage(sessionId, i)
          .call();
        answers.push(parseInt(ans));
      }

      console.log("Correct paths ", answers);
      return answers;
    },
    {
      ...hookCommon,
    }
  );


  const getPathForToken = async (tokenId: number) => {
    const res = await gardenContract.methods.getPathChoice(sessionId, tokenId, currentStage.data).call() //TODO current stage
    return Number(res)
  };

  function usePath(tokenId: number) {
    return useQuery(['path_for_token', tokenId], () => getPathForToken(tokenId), { ...hookCommon, enabled: !!currentStage.data });
  }

  const getTokenGuard = async (tokenId: number) => {
    const res = await gardenContract.methods.getSessionTokenStakeGuard(sessionId, tokenId).call() //TODO current stage
    return Number(res)
  };

  function useGuard(tokenId: number) {
    return useQuery(['guard_for_token', tokenId], () => getTokenGuard(tokenId), { ...hookCommon });
  }

  const getApprovalForAll = async () => {
    console.log("Attempting getApproval");
    tokenContract.options.address = sessionInfo.data[0];
    const approved = await tokenContract.methods.isApprovedForAll(web3ctx.account, gardenContractAddress).call();
    console.log("User is", approved ? "approved." : "not approved.");
    return approved;
  };

  function useApprovalForAll() {
    return useQuery(
      ['contract_approval', gardenContractAddress, web3ctx.account],
      () => getApprovalForAll(), 
      { ...hookCommon, 
        notifyOnChangeProps: ["data"], 
      });
  }

  const getTokensUri = async (tokenIds: number[]) => {
    tokenContract.options.address = sessionInfo.data[0];
    const uris = new Map<number, string>()
    for (let i = 0; i < tokenIds.length; i++) {
      const uri = await tokenContract.methods.tokenURI(tokenIds[i]).call();
      uris.set(tokenIds[i], uri)
    }
    console.log(uris)
    return uris
  }

  function useTokenUris(tokenIds: number[]) {
    return useQuery(['tokens_uri', tokenIds], 
      () => getTokensUri(tokenIds),
      {
        ...hookCommon, 
        enabled: !!sessionInfo.data,
      })
  }



  const ownedTokens = useQuery<number[]>(
    ["owned_tokens", sessionInfo],
    async () => {

      tokenContract.options.address = sessionInfo.data[0];
      const balance = await tokenContract.methods
        .balanceOf(web3ctx.account)
        .call();
      const tokens = [];

      for (let i = 0; i < parseInt(balance); i++) {
        const tok = await tokenContract.methods
          .tokenOfOwnerByIndex(web3ctx.account, i)
          .call();
        tokens.push(parseInt(tok));
      }
      return tokens;
    },
    {
      ...hookCommon,
      enabled: !!sessionInfo?.data
    }
  );

  const stakeTokens = useMutation(
    (tokenIds: number[]) => {
      console.log(
        "Attempting to stake ",
        tokenIds,
        " into session ",
        sessionId,
        "."
      );
      const gardenContract: any = new web3ctx.web3.eth.Contract(
        GardenABI
      ) as any as GardenABIType;
      gardenContract.options.address = gardenContractAddress;
      return gardenContract.methods
        .stakeTokensIntoSession(sessionId, tokenIds)
        .send({
          from: web3ctx.account,
        });
    },
    {
      onSuccess: () => {
        toast("Staking successful.", "success");
        queryClient.invalidateQueries('owned_tokens')
        queryClient.invalidateQueries('staked_tokens')
      },
      onError: (error) => {
        toast("Staking failed.", "error");
        console.error(error);
      },
    }
  );

  const unstakeTokens = useMutation(
    (tokenIds: number[]) => {
      return gardenContract.methods
        .unstakeTokensFromSession(sessionId, tokenIds)
        .send({
          from: web3ctx.account,
        });
    },
    {
      onSuccess: () => {
        toast("Unstaking successful.", "success");
        queryClient.invalidateQueries('owned_tokens')
        queryClient.invalidateQueries('staked_tokens')
      },
      onError: (error) => {
        toast("Unstaking failed.", "error");
        console.error(error);
      },
    }
  );

  const stakedTokens = useQuery<number[]>(
    ["staked_tokens", gardenContractAddress, sessionId, web3ctx.account],
    async () => {
      const balance = await gardenContract.methods
        .numTokensStakedIntoSession(sessionId, web3ctx.account)
        .call();
      const tokens = [];
      for (let i = 1; i <= parseInt(balance); i++) {
        const tok = await gardenContract.methods
          .tokenOfStakerInSessionByIndex(sessionId, web3ctx.account, i)
          .call();
        tokens.push(parseInt(tok));
        // TODO MULTICALL
      }
      console.log('staked tokens', tokens)
      return tokens;
    },
    {
      ...hookCommon,
      enabled: !!web3ctx.chainId,
    }
  );

  const choosePath = useMutation<unknown, unknown, ChoosePathData, unknown>(
    (vars: ChoosePathData) => {

      return gardenContract.methods
        .chooseCurrentStagePaths(
          sessionId,
          vars.tokenIds,
          Array(vars.tokenIds.length).fill(vars.path)
        )
        .send({
          from: web3ctx.account,
        });
    },
    {
      onSuccess: () => {
        toast("Path choice successful.", "success");
        queryClient.invalidateQueries('path_for_token')
        queryClient.invalidateQueries('guard_for_token')

      },
      onError: (error) => {
        toast("Path choice failed.", "error");
        console.error(error);
      },
    }
  );

  const setApproval = useMutation(
    async () => {
      if (!web3ctx.account) {
        return new Promise((_, reject) => {
          reject(new Error(`Account address isn't set`))
        })
      }

      tokenContract.options.address = sessionInfo.data[0];
      return await tokenContract.methods
        .setApprovalForAll(gardenContractAddress, true)
        .send({
          from: web3ctx.account,
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contract_approval');
        toast("SetApproval successful.", "success");
      },
      onError: (e: Error) => {
        toast("SetApproval failed." + e?.message, "error");
      },
    }
  );




  return {
    sessionInfo,
    sessionMetadata,
    currentStage,
    correctPaths,
    usePath,
    ownedTokens,
    stakeTokens,
    unstakeTokens,
    useTokenUris,
    stakedTokens,
    choosePath,
    setApproval,
    useGuard,
    useApprovalForAll,
  }
}

export default useGofpContract
