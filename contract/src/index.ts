import {
  NearContract,
  NearBindgen,
  call,
  view,
  LookupMap,
  UnorderedMap,
} from "near-sdk-js";
import {
  RodtContractMetadata,
  TokenMetadata,
  internalNftMetadata,
} from "./metadata";
import { internalMint } from "./mint";
import {
  internalrodtTokens,
  internalSupplyForOwner,
  internalTokensForOwner,
  internalTotalSupply,
} from "./enumeration";
import {
  internalNftToken,
  internalNftTransfer,
  internalNftTransferCall,
  internalResolveTransfer,
  internalGenerateULID,
} from "./nft_core";
import {
  internalNftApprove,
  internalNftIsApproved,
  internalNftRevoke,
  internalNftRevokeAll,
} from "./approval";
import { internalNftPayout, internalNftTransferPayout } from "./royalty";

/// This spec can be treated like a version of the standard.
export const NFT_METADATA_SPEC = "RODT-near.org-0.89.99";

/// This is the name of the NFT standard we're using
export const NFT_STANDARD_NAME = "PENDING nepXXX";

@NearBindgen
export class Contract extends NearContract {
  owner_id: string;
  tokensPerOwner: LookupMap;
  tokensById: LookupMap;
  tokenMetadataById: UnorderedMap;
  metadata: RodtContractMetadata;

  /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id. 
    */
  constructor({
    owner_id,
    metadata = {
      versionnumber: "RODT-near.org-0.89.99",
      name: "Cableguard FORGE",
      symbol: "CGRODT",
      base_uri: "cableguard.org",
    },
  }) {
    super();
    this.owner_id = owner_id;
    this.tokensPerOwner = new LookupMap("tokensPerOwner");
    this.tokensById = new LookupMap("tokensById");
    this.tokenMetadataById = new UnorderedMap("tokenMetadataById");
    this.metadata = metadata;
  }

  default() {
    return new Contract({ owner_id: "" });
  }

  /*
        MINT
    */

  @call
  nft_mint({
    token_id, // (Serial Number X.509): Random ULID
    issuer_name, // (Issuer Name X.509): Common issuer_name chosen in the GUI
    description_rodt, // Common description chosen in the GUI
    not_after, // (Not After X.509): Date greater than starts_at. Value 0 for “any” as per X.509
    not_before, // (Not Before X.509): Date, with Value 0 for “any” as per X.509
    cidr_block, // The first IPv4 address in the ipaddressrange
    listen_port,
    dns_server, // does the server need this? A single IPv4 address chosen in the GUI
    post_up, // Server only, a common command chosen in in the GUI
    post_down, // Server only, a common command chosen in in the GUI
    allowed_ips, // A common IPv4 range chosen in the GUI
    subjectuniqueidentifier_url, // (Subject Unique Identifier X.509): A single IPv4 address for the server chosen in the GUI
    serviceprovider_id, // serverserialnumber for the Server, the token_id value of the server for the Clients
    serviceprovider_signature,
    kb_persecond, // null for the Server, a common number chosen in the GUI
    // authorizedlocation:  string; // From what region the subscription is valid, future feature not for the POC
    // authorizednetwork: Option<Ipv4Addr>, // From what network range the subscription is valid, future feature not for the POC
    owneraccount_id, // This is the owner of the rodtparently, but I assumed it would be the wallet logged in
  }) {
    const metadata = new TokenMetadata(
      issuer_name, // (Issuer Name X.509): Common issuer_name chosen in the GUI
      description_rodt, // Common description chosen in the GUI
      not_after, // (Not After X.509): Date greater than starts_at. Value 0 for “any” as per X.509
      not_before, // (Not Before X.509): Date, with Value 0 for “any” as per X.509
      cidr_block, // The first IPv4 address in the ipaddressrange
      listen_port,
      dns_server, // does the server need this? A single IPv4 address chosen in the GUI
      post_up, // Server only, a common command chosen in in the GUI
      post_down, // Server only, a common command chosen in in the GUI
      allowed_ips, // A common IPv4 range chosen in the GUI
      subjectuniqueidentifier_url, // (Subject Unique Identifier X.509): A single IPv4 address for the server chosen in the GUI
      serviceprovider_id, // serverserialnumber for the Server, the token_id value of the server for the Clients
      serviceprovider_signature,
      kb_persecond // null for the Server, a common number chosen in the GUI
      // authorizedlocation:  string; // From what region the subscription is valid, future feature not for the POC
      // authorizednetwork: Option<Ipv4Addr>, // From what network range the subscription is valid, future feature not for the POC
    );
    return internalMint(this, token_id, metadata, owneraccount_id);
  }

  /*
        CORE
    */
  @view
  //get the information for a specific token ID
  nft_token({ token_id }) {
    return internalNftToken({ contract: this, tokenId: token_id });
  }

  @call
  //implementation of the nft_transfer method. This transfers the RODT from the current owner to the receiver.
  nft_transfer({ receiver_id, token_id, approval_id, memo }) {
    return internalNftTransfer({
      contract: this,
      receiverId: receiver_id,
      tokenId: token_id,
      approvalId: approval_id,
      memo: memo,
    });
  }

  @call
  //implementation of the transfer call method. This will transfer the RODT and call a method on the receiver_id contract
  nft_transfer_call({ receiver_id, token_id, approval_id, memo, msg }) {
    return internalNftTransferCall({
      contract: this,
      receiverId: receiver_id,
      tokenId: token_id,
      approvalId: approval_id,
      memo: memo,
      msg: msg,
    });
  }

  @call
  //resolves the cross contract call when calling nft_on_transfer in the nft_transfer_call method
  //returns true if the token was successfully transferred to the receiver_id
  nft_resolve_transfer({
    authorized_id,
    owner_id,
    receiver_id,
    token_id,
    approved_account_ids,
    memo,
  }) {
    return internalResolveTransfer({
      contract: this,
      authorizedId: authorized_id,
      ownerId: owner_id,
      receiverId: receiver_id,
      tokenId: token_id,
      approvedAccountIds: approved_account_ids,
      memo: memo,
    });
  }

  /*
        APPROVALS
    */
  @view
  //check if the passed in account has access to approve the token ID
  nft_is_approved({ token_id, approved_account_id, approval_id }) {
    return internalNftIsApproved({
      contract: this,
      tokenId: token_id,
      approvedAccountId: approved_account_id,
      approvalId: approval_id,
    });
  }

  @call
  //approve an account ID to transfer a token on your behalf
  nft_approve({ token_id, account_id, msg }) {
    return internalNftApprove({
      contract: this,
      tokenId: token_id,
      accountId: account_id,
      msg: msg,
    });
  }

  /*
        ROYALTY
    */
  @view
  //calculates the payout for a token given the passed in balance. This is a view method
  nft_payout({ token_id, balance, max_len_payout }) {
    return internalNftPayout({
      contract: this,
      tokenId: token_id,
      balance: balance,
      maxLenPayout: max_len_payout,
    });
  }

  @call
  //transfers the token to the receiver ID and returns the payout object that should be payed given the passed in balance.
  nft_transfer_payout({
    receiver_id,
    token_id,
    approval_id,
    memo,
    balance,
    max_len_payout,
  }) {
    return internalNftTransferPayout({
      contract: this,
      receiverId: receiver_id,
      tokenId: token_id,
      approvalId: approval_id,
      memo: memo,
      balance: balance,
      maxLenPayout: max_len_payout,
    });
  }

  @call
  //approve an account ID to transfer a token on your behalf
  nft_revoke({ token_id, account_id }) {
    return internalNftRevoke({
      contract: this,
      tokenId: token_id,
      accountId: account_id,
    });
  }

  @call
  //approve an account ID to transfer a token on your behalf
  nft_revoke_all({ token_id }) {
    return internalNftRevokeAll({ contract: this, tokenId: token_id });
  }

  /*
        ENUMERATION
    */
  @view
  //Query for the total supply of NFTs on the contract
  nft_total_supply() {
    return internalTotalSupply({ contract: this });
  }

  @view
  //Query for RODT tokens on the contract regardless of the owner using pagination
  nft_tokens({ from_index, limit }) {
    return internalrodtTokens({
      contract: this,
      fromIndex: from_index,
      limit: limit,
    });
  }

  @view
  //get the total supply of NFTs for a given owner
  nft_tokens_for_owner({ account_id, from_index, limit }) {
    return internalTokensForOwner({
      contract: this,
      accountId: account_id,
      fromIndex: from_index,
      limit: limit,
    });
  }

  @view
  //Query for all the tokens for an owner
  nft_supply_for_owner({ account_id }) {
    return internalSupplyForOwner({ contract: this, accountId: account_id });
  }

  /*
        METADATA
    */
  @view
  //Query for all the tokens for an owner
  nft_metadata() {
    return internalNftMetadata({ contract: this });
  }
}
