#!/bin/bash

# deploy the contract
near deploy --accountId $NFTCONTRACTID --wasmFile build/contract.wasm
#near dev-deploy  --wasmFile build/contract.wasm
