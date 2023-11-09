import { Contract } from ".";

//defines the payout type we'll be returning as a part of the royalty standards.
export class Payout {
  payout: { [accountId: string]: bigint };
  constructor({ payout }: { payout: { [accountId: string]: bigint } }) {
    this.payout = payout;
  }
}

export class RodtContractMetadata {
  versionnumber: string;
  name: string;
  symbol: string;
  //    icon?: string;
  issueruniqueidentifierURL?: string;

  constructor({
    versionnumber,
    name,
    symbol,
    //            icon,
    baseUri,
  }: {
    versionnumber: string;
    name: string;
    symbol: string;
    //            icon?: string,
    baseUri?: string;
  }) {
    this.versionnumber = versionnumber; // required, "partage RODT 0.1"
    this.name = name; // required, "RODT"
    this.symbol = symbol; // required, "CG"
    //        this.icon = icon // Data URL
    this.issueruniqueidentifierURL = baseUri; // Gateway to find RODT validators
  }
}

export class TokenMetadata {
  customername?: string; // Provider of the VPN Service
  description?: string; // Description of the VPN Service
  notafter?: string; // When the VPN Service expires, Unix epoch in milliseconds, 1 year by default in the user interface
  notbefore?: string; // When the VPN Service starts, Unix epoch in milliseconds
  //    vpnaccelerator: Option<Bool>, // VPN Accelerator is on if true, off if false, future feature not for the POC
  subjectuniqueidentifierurl?: string; // Intial URL where the clients connect
  serviceproviderid?: string; // Non fungible token ID of the "author" of the set of Non fungible tokens created
  serviceprovidersignature?: string; //  Hash of the Non fungible token signed with serviceproviderid's publickey sourced from the blockchain
  wifipassword?: string; // Bandwith of the subscription in Kb/s, 1000000 by default in the user interfac
 
  constructor(
    customer_name?: string,
    resource_location?: string,
    not_after?: string,
    not_before?: string,
    subjectuniqueidentifier_url?: string,
    serviceprovider_id?: string,
    serviceprovider_signature?: string,
    wifi_password?: string
  ) {
      (this.customername = customer_name),
      (this.description = resource_location),
      (this.notafter = not_after),
      (this.notbefore = not_before),
      (this.subjectuniqueidentifierurl = subjectuniqueidentifier_url),
      (this.serviceproviderid = serviceprovider_id),
      (this.serviceprovidersignature = serviceprovider_signature),
      (this.wifipassword = wifi_password);
  }
}

export class Token {
  owner_id: string;
  approved_account_ids: { [accountId: string]: number };
  next_approval_id: number;
  royalty: { [accountId: string]: number };

  constructor({
    ownerId,
    approvedAccountIds,
    nextApprovalId,
    royalty,
  }: {
    ownerId: string;
    approvedAccountIds: { [accountId: string]: number };
    nextApprovalId: number;
    royalty: { [accountId: string]: number };
  }) {
    //owner of the token
    (this.owner_id = ownerId),
      //list of approved account IDs that have access to transfer the token. This maps an account ID to an approval ID
      (this.approved_account_ids = approvedAccountIds),
      //the next approval ID to give out.
      (this.next_approval_id = nextApprovalId),
      //keep track of the royalty percentages for the token in a hash map
      (this.royalty = royalty);
  }
}

//The Json token is what will be returned from view calls.
export class JsonToken {
  token_id: string;
  owner_id: string;
  metadata: TokenMetadata;
  approved_account_ids: { [accountId: string]: number };
  royalty: { [accountId: string]: number };

  constructor({
    tokenId,
    ownerId,
    metadata,
    approvedAccountIds,
    royalty,
  }: {
    tokenId: string;
    ownerId: string;
    metadata: TokenMetadata;
    approvedAccountIds: { [accountId: string]: number };
    royalty: { [accountId: string]: number };
  }) {
    //token ID
    (this.token_id = tokenId),
      //owner of the token
      (this.owner_id = ownerId),
      //token metadata
      (this.metadata = metadata),
      //list of approved account IDs that have access to transfer the token. This maps an account ID to an approval ID
      (this.approved_account_ids = approvedAccountIds),
      //keep track of the royalty percentages for the token in a hash map
      (this.royalty = royalty);
  }
}

//get the information for a specific token ID
export function internalNftMetadata({
  contract,
}: {
  contract: Contract;
}): RodtContractMetadata {
  return contract.metadata;
}
