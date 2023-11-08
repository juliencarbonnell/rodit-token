#!/bin/bash

#near deploy --accountId $NFTCONTRACTID --wasmFile build/contract.wasm
near dev-deploy  --wasmFile build/contract.wasm
