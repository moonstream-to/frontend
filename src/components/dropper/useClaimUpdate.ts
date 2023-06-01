// useClaimUpdate.ts
import { useMutation } from "react-query";
import { useContext } from "react";
import Web3Context from "../../contexts/Web3Context/context";
import { balanceOfAddress } from "../../web3/contracts/terminus.contracts";
import { patchHttp } from "../../utils/http";
import { UpdateClaim } from "../../types/Moonstream";
import { DropDBData } from "../../types";

export function useClaimUpdate() {
  const ctx = useContext(Web3Context);

  const update = useMutation(async (data: DropDBData) => {
    const patchData: UpdateClaim = {
      claim_block_deadline: data.deadline,
      terminus_address: data.terminusAddress,
      terminus_pool_id: data.terminusPoolId,
    };
    const balance = await balanceOfAddress(
      ctx.account,
      data.terminusAddress,
      Number(data.terminusPoolId),
      ctx,
    )();
    if (Number(balance) <= 0) {
      const confirmation = window.confirm("Balance is 0 or less. Do you want to proceed?");

      if (!confirmation) {
        throw new Error("User cancelled operation due to low balance.");
      }
    }
    if (data.claimUUID) return patchHttp(`/admin/drops/${data.claimUUID}`, { ...patchData });
    else throw new Error("Cannot use update without claimid");
  }, {});

  return update;
}
