import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Spinner } from "@chakra-ui/react";
import Web3Address from "../entity/Web3Address";
import InfoIcon from "../icons/InfoIcon";
import styles from "./AuthorizationInfo.module.css";
import parentStyles from "./SigningAccountView.module.css";
import DangerIcon from "../icons/DangerIcon";

const AuthorizationInfo = ({
  controllers,
  dropAuthorization,
  isToken,
  hasAuthority,
  mintingMutation,
  address,
}: {
  controllers: { contractController: string; poolController: string };
  dropAuthorization: { poolId: string; terminusAddress: string };
  isToken: boolean;
  hasAuthority: boolean;
  mintingMutation: any;
  address: string;
}) => {
  return (
    <Popover placement={"right-start"}>
      <PopoverTrigger>
        <button style={{ position: "relative" }}>
          <InfoIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="pop-content"
        border="none"
        _focusVisible={{ border: "none", outline: "none" }}
        position="absolute"
        right="185px"
        bottom={"-20px"}
      >
        <div className={styles.container}>
          <Flex
            className={styles.addressesContainer}
            _focusVisible={{ border: "none" }}
            fontSize={"12px"}
          >
            <Web3Address
              isTruncated
              label="Contract controller"
              address={controllers.contractController ?? ""}
            />
            <Web3Address
              isTruncated
              label="Pool controller"
              address={controllers.poolController ?? ""}
            />
            <Box h={"0.5px"} w={"100%"} bg={"#4D4D4D"} />
            <Web3Address
              isTruncated
              label="Terminus badge address"
              address={dropAuthorization.terminusAddress ?? ""}
              href={`/terminus/?contractAddress=${dropAuthorization.terminusAddress}`}
            />
            <Web3Address
              label="Terminus badge pool"
              address={dropAuthorization.poolId ?? ""}
              href={`/terminus/?contractAddress=${dropAuthorization.terminusAddress}&poolId=${dropAuthorization.poolId}`}
            />
          </Flex>
          {!isToken && (
            <div className={styles.footer}>
              <DangerIcon />
              {hasAuthority ? (
                <>
                  <div className={styles.footerText}>
                    Mint the terminus badge to authorize the Signing account
                  </div>
                  <button
                    className={parentStyles.buttonMint}
                    onClick={() =>
                      mintingMutation.mutate({
                        to: address,
                        poolID: Number(dropAuthorization.poolId),
                        amount: Number(5),
                      })
                    }
                    disabled={mintingMutation.isLoading}
                  >
                    {mintingMutation.isLoading ? (
                      <Spinner mx="auto" h={"12px"} w={"12px"} />
                    ) : (
                      "Mint"
                    )}
                  </button>
                </>
              ) : (
                <div className={styles.footerText}>
                  Contact contract or pool controller to get a terminus badge and authorize the
                  Signing account
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AuthorizationInfo;
