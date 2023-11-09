import { utils } from "near-api-js";
import { ulid } from "ulid";
const crypto = require("crypto");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
nacl.util = require('tweetnacl-util');

// Gas needs to be understood tuned and optimized
// const THIRTY_TGAS = '30000000000000';
const THIRTY_TGAS = "12500000000000";

function encryptTextWithNonce(text, nonce, key) {
  const textUint8Array = nacl.util.decodeUTF8(text);
  const encrypted = nacl.secretbox(textUint8Array, nonce, key);
  return nacl.util.encodeBase64(encrypted);
}

export class Contract {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  // Lists tokens regardless of owner
  async listrodts() {
    const Rodts = await this.wallet.viewMethod({
      contractId: this.contractId,
      method: "nft_tokens",
    });
    return Rodts;
  }

  async addRODiT(
    bookingfee,
    customername,
    description,
    notafter,
    notbefore,
    subjectuniqueidentifierurl,
    uniquenonce,
    serverprivatekeyBase58,
    owneraccountid
  ) {
    // The following line should calculate the fee
    const deposit = utils.format.parseNearAmount(bookingfee); 
    
    // Generate nonce for this operation
    uniquenonce = nacl.randomBytes(nacl.secretbox.nonceLength);

    let gas = THIRTY_TGAS;
    let actionset = [];
    // Convert the private key to binary
    let serverprivatekeyUA = new Uint8Array(
      bs58.decode(serverprivatekeyBase58)
    );
    let encryptionKey = crypto.createHash('sha256').update(Buffer.concat([Buffer.from('encryption'), serverprivatekeyUA])).digest();

    let serviceprovidersignatureUA = serverprivatekeyUA;
    let serviceprovidersignatureBase64 =
      Buffer.from(serviceprovidersignatureUA).toString("base64");

    // Account ID of the smart contract
    const scaccountid = "dev-1699519679503-98321179336982";
    let ulidofserver = ulid();
    let serverulid = "bc=near.org;sc=" + scaccountid + ";id=" + ulidofserver;
/*
        let encryptedsCustomerName = encryptTextWithNonce(customername, uniquenonce, encryptionKey);
        let encryptedsNotAfter = encryptTextWithNonce(notafter, uniquenonce, encryptionKey);
        let encryptedsNotBefore = encryptTextWithNonce(notbefore, uniquenonce, encryptionKey);
        let actionsrv = {
          type: "FunctionCall",
          params: {
            methodName: "nft_mint",
            args: {
              token_id: serverulid, // (Serial Number X.509): Random ULID
              customer_name: encryptedsCustomerName, // (Issuer Name X.509): Common customername chosen in the GUI
              resource_location: description, // Common description chosen in the GUI
              not_after: encryptedsNotAfter, // (Not After X.509): Date greater than starts_at. Value 0 for “any” as per X.509
              not_before: encryptedsNotBefore, // (Not Before X.509): Date, with Value 0 for “any” as per X.509
              subjectuniqueidentifier_url: subjectuniqueidentifierurl, // (Subject Unique Identifier X.509): A URL for the initial VPN server chosen in the GUI
              // CG: The following line prevents anchor Service Provider RODiT to be used for endpoints
              serviceprovider_id: ulidofserver, // serverserialnumber for the Server, the token_id value of the server for the Clients
              serviceprovider_signature: 0,
              unique_nonce: uniquenonce, // null for the Server, a common number chosen in the GUI
              // authorizedlocation:  string; // From what region the subscription is valid, future feature not for the POC
              // authorizednetwork: Option<Ipv4Addr>, // From what network range the subscription is valid, future feature not for the POC
              owneraccount_id: owneraccountid, // This is the owner of the rodtparently, but I assumed it would be the wallet logged in
            },
            gas,
            deposit,
          },
        };
        // Create the serviceprovidersignature
        serviceprovidersignatureUA = nacl.sign.detached(
          Uint8Array.from(serverulid, (char) => char.charCodeAt(0)),
          serverprivatekeyUA
        );

        // Convert the signature to Base64, as it is going to be read by programs and it is more compact
        serviceprovidersignatureBase64 =
          Buffer.from(serviceprovidersignatureUA).toString("base64");

        // Add the signature to the actionsrv object
        actionsrv.params.args.serviceprovider_signature = serviceprovidersignatureBase64;
        actionset.push(actionsrv);
*/
        let clientulid = ulid();
        let encryptedCustomerName = encryptTextWithNonce(customername, uniquenonce, encryptionKey);
        let encryptedNotAfter = encryptTextWithNonce(notafter, uniquenonce, encryptionKey);
        let encryptedNotBefore = encryptTextWithNonce(notbefore, uniquenonce, encryptionKey);
        let actioncli = {
          type: "FunctionCall",
          params: {
            methodName: "nft_mint",
            args: {
              token_id: clientulid,
              customer_name: encryptedCustomerName,
              resource_location: description,
              not_after: encryptedNotAfter,
              not_before: encryptedNotBefore,
              subjectuniqueidentifier_url: subjectuniqueidentifierurl,
              serviceprovider_id: serverulid, // Matches token_id for the server
              serviceprovider_signature: 0,
              unique_nonce: uniquenonce,
              owneraccount_id: owneraccountid,
            },
            gas,
            deposit,
          },
        };

        serviceprovidersignatureUA = nacl.sign.detached(
          Uint8Array.from(clientulid, (char) => char.charCodeAt(0)),
          serverprivatekeyUA
        );

        // Convert the hash to Base64, as it is going to be read by programs and it is more compact
        serviceprovidersignatureBase64 =
          Buffer.from(serviceprovidersignatureUA).toString("base64");

        // Add the signature to the actioncli object
        actioncli.params.args.serviceprovider_signature = serviceprovidersignatureBase64;
        actionset.push(actioncli);

    return await this.wallet.callMethod(this.contractId, actionset);
  }
}
