import { utils } from "near-api-js";
import { ulid } from "ulid";
const crypto = require("crypto");
const bs58 = require("bs58");
const nacl = require("tweetnacl");

// Gas needs to be understood tuned and optimized
// const THIRTY_TGAS = '30000000000000';
const THIRTY_TGAS = "12500000000000";
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

  async addRODTset(
    numberofclients,
    issuername,
    description,
    notafter,
    notbefore,
    cidrblock,
    listenport,
    dns,
    postup,
    postdown,
    allowedips,
    subjectuniqueidentifierurl,
    kbpersecond,
    serverprivatekeyBase58,
    owneraccountid
  ) {
    // The following line should calculate the fee
    const deposit = utils.format.parseNearAmount("0.1"); // Where 0.1 is the fee per RODT minted

    // Generating the list of valid IPs for the range
    function generateIPs(cidrblock, numberofclients) {
      // Split the range into its base IP address and subnet mask
      const [baseIP, subnetMask] = cidrblock.split("/");

      // Calculate the number of IP addresses in the subnet
      const numIPs = Math.pow(2, 32 - subnetMask);

      // Convert the base IP address to an integer
      const baseIPInt = ipToInt(baseIP);

      // Loop through each IP address in the subnet and convert it back to a string
      const ips = [];
      if (numIPs > numberofclients) {
        for (let i = 0; i < numberofclients; i++) {
          const ipInt = baseIPInt + i;
          const ip = intToIp(ipInt);
          const ipWithMask = ip + "/" + subnetMask;
          ips.push(ipWithMask);
        }
      }
      return ips;
    }

    // Helper function to convert an IP address string to an integer
    function ipToInt(ip) {
      return ip
        .split(".")
        .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
    }

    // Helper function to convert an integer to an IP address string
    function intToIp(int) {
      return [
        (int >>> 24) & 0xff,
        (int >> 16) & 0xff,
        (int >> 8) & 0xff,
        int & 0xff,
      ].join(".");
    }

    let ips = generateIPs(cidrblock, numberofclients+1); // Make sure IPs don't start at 0

    let gas = THIRTY_TGAS;
    let actionset = [];
    // Convert the private key to binary
    let serverprivatekeyUA = new Uint8Array(
      bs58.decode(serverprivatekeyBase58)
    );
    let serviceprovidersignatureUA = serverprivatekeyUA;
    let serviceprovidersignatureBase64 =
      Buffer.from(serviceprovidersignatureUA).toString("base64");

    // Account ID of the smart contract
    const scaccountid = "dev-1699471567791-84892098620718";
    // const scaccountid = "dev-1692953132237-55677720495514";
    // The server ulid can be used to disable the RODT via DNS TXT entry
    let ulidofserver = ulid();
    let serverulid = "bc=near.org;sc=" + scaccountid + ";id=" + ulidofserver;
    // CG: 1970-01-01 is the default value for notafter and not before when not set

    // CG: ATTENTION: serverulid hardcoded temporarily to issuername instead of ulidofserver
    // to generate larger client RODiT sets. REVERSE the commenting of the following lines to rever to normal
    // Changes NOT COMMITTED to GITHUB
    // serverulid = "bc=near.org;sc=" + scaccountid + ";id=" + issuername;
    // for (let i = 1; i < numberofclients; i++) {
    for (let i = 0; i < numberofclients; i++) {
      if (i == 0) {
        let actionsrv = {
          type: "FunctionCall",
          params: {
            methodName: "nft_mint",
            args: {
              token_id: serverulid, // (Serial Number X.509): Random ULID
              issuer_name: issuername, // (Issuer Name X.509): Common issuername chosen in the GUI
              description_rodt: description, // Common description chosen in the GUI
              not_after: notafter, // (Not After X.509): Date greater than starts_at. Value 0 for “any” as per X.509
              not_before: notbefore, // (Not Before X.509): Date, with Value 0 for “any” as per X.509
              cidr_block: ips[1], // The first IPv4 address in the ipaddressrange that does not end with 0
              listen_port: listenport,
              dns_server: dns, // does the server need this? A single IPv4 address chosen in the GUI
              post_up: postup, // Server only, a common command chosen in in the GUI
              post_down: postdown, // Server only, a common command chosen in in the GUI
              allowed_ips: "null", // Servers don't need this value
              subjectuniqueidentifier_url: subjectuniqueidentifierurl, // (Subject Unique Identifier X.509): A URL for the initial VPN server chosen in the GUI
              // CG: The following line prevents anchor Service Provider RODiT to be used for endpoints
              serviceprovider_id: ulidofserver, // serverserialnumber for the Server, the token_id value of the server for the Clients
              serviceprovider_signature: 0 /* Certificate Signature X.509): Server: Ed25519 digital signature ( SHA384WITHECDSA ) calculated from all the other
              fields of the rodtsigned with the serverprivatekey */,
              kb_persecond: "null", // null for the Server, a common number chosen in the GUI
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
      } else {
        let clientulid = ulid();
        let actioncli = {
          type: "FunctionCall",
          params: {
            methodName: "nft_mint",
            args: {
              token_id: clientulid,
              issuer_name: issuername,
              description_rodt: description,
              not_after: notafter,
              not_before: notbefore,
              cidr_block: ips[i+1], // Sequential ipaddress from the ipaddressrange
              listen_port: listenport,
              dns_server: dns,
              post_up: "null", // Perhaps something like: sudo ip addr add 10.0.0.1/24 dev wg33
              post_down: "null", // I don't think clients need postdown
              allowed_ips: allowedips,
              subjectuniqueidentifier_url: subjectuniqueidentifierurl,
              serviceprovider_id: serverulid, // Matches token_id for the server
              serviceprovider_signature: 0 /* Certificate Signature X.509): Clients: Ed25519 digital signature ( SHA384WITHECDSA )
              calculated from all the other fields */,
              kb_persecond: kbpersecond,
              // authorizedlocation:  string; // From what region the subscription is valid, future feature not for the POC
              // authorizednetwork: Option<Ipv4Addr>, // From what network range the subscription is valid, future feature not for the POC
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
      }
    }

    return await this.wallet.callMethod(this.contractId, actionset);
  }
}
