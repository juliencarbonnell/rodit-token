// @ts-nocheck
import { assert, near } from "near-sdk-js";
// import { Context } from "near-sdk-as";
import { Contract, NFT_METADATA_SPEC, NFT_STANDARD_NAME } from ".";
import { internalAddTokenToOwner, collectDeposit } from "./internal";
import { Token, TokenMetadata } from "./metadata";

export function internalMint(
  contract: Contract,
  tokenId: string,
  metadata: TokenMetadata,
  receiverId: string
): void {
  // Cancel any royalties
  const perpetualRoyalties = null; //     perpetualRoyalties: {[key: string]: number}

  // Measure the initial storage being used on the contract
  let initialStorageUsage = near.storageUsage();

  // Create a royalty map to store in the token
  let royalty: { [accountId: string]: number } = {};

  // If there were perpetualRoyalties, that there are not
  if (perpetualRoyalties != null) {
    //make sure that the length of the perpetual royalties is below 7
    const amount = 7;
    assert(
      Object.keys(perpetualRoyalties).length < amount,
      "Cannot add more than 7 perpetual royalty amounts"
    );
    //iterate through the perpetual royalties and insert the account and amount in the royalty map
    Object.entries(perpetualRoyalties).forEach(([account, amount], index) => {
      royalty[account] = amount; // Setting royalties in the royalty map
    });
  }

  // Specify the token struct that contains the owner ID
  let token = new Token({
    //set the owner ID equal to the receiver ID passed into the function
    ownerId: receiverId,
    //we set the approved account IDs to the default value (an empty map)
    approvedAccountIds: {},
    //the next approval ID is set to 0
    nextApprovalId: 0,
    //the map of perpetual royalties for the token (The owner will get 100% - total perpetual royalties)
    royalty,
  });

  // Insert the token ID and token struct and make sure that the token doesn't exist
  assert(!contract.tokensById.containsKey(tokenId), "RODT already exists");
  contract.tokensById.set(tokenId, token);

  // Insert the token ID and metadata
  contract.tokenMetadataById.set(tokenId, metadata);

  // Making the receiver the owner
  token.owner_id = receiverId;

  // Call the internal method for adding the token to the owner
  internalAddTokenToOwner(contract, token.owner_id, tokenId);

  // Construct the mint log as per the events standard.
  let nftMintLog = {
    // Standard name ("PENDING nepXXX").
    standard: NFT_STANDARD_NAME,
    // Version of the standard ("RODT-near.org-0.89.99").
    version: NFT_METADATA_SPEC,
    // The data related with the event stored in a vector.
    event: "nft_mint",
    data: [
      {
        // Owner of the token.
        owner_id: token.owner_id,
        // Vector of token IDs that were minted.
        token_ids: [tokenId],
      },
    ],
  };

  // Log the json.
  near.log(`EVENT_JSON:${JSON.stringify(nftMintLog)}`);

  // Maybe possible to use Context.storageUsage() instead of a fix value
  const storageCostPerByte = BigInt(1); // 0.01 * 100

  //calculate the required storage which was the used - initial TODO
  let requiredStorageInBytes =
    near.storageUsage().valueOf() - initialStorageUsage.valueOf();

  // We could refund the deposit, but we should not.
  collectDeposit(requiredStorageInBytes);
}
