//// live
const CONTRACT_NAME = process.env.CONTRACT_NAME || "drawstringmarketplace.drawstring_v2.near";

//// dev
// const CONTRACT_NAME = process.env.CONTRACT_NAME || "drawstringnft.testnet";

export default function getConfig(env) {
	switch (env) {
	  case "mainnet":
		return {
		  networkId: "mainnet",
		  explorerUrl: "https://explorer.near.org",
		  nodeUrl: "https://rpc.mainnet.near.org",
		  contractName: CONTRACT_NAME,
		  walletUrl: "https://wallet.near.org",
		  helperUrl: "https://helper.mainnet.near.org",
		};
	  // This is an example app so production is set to testnet.
	  // You can move production to mainnet if that is applicable.
	  case "production":
	  case "development":
	  case "testnet":
		return {
		  networkId: "testnet",
		  nodeUrl: "https://rpc.testnet.near.org",
		  CONTRACT_NAME,
		  walletUrl: "https://wallet.testnet.near.org",
		  helperUrl: "https://helper.testnet.near.org",
		};
	  case "betanet":
		return {
		  networkId: "betanet",
		  nodeUrl: "https://rpc.betanet.near.org",
		  CONTRACT_NAME,
		  walletUrl: "https://wallet.betanet.near.org",
		  helperUrl: "https://helper.betanet.near.org",
		};
	  case "local":
		return {
		  networkId: "local",
		  nodeUrl: "http://localhost:3030",
		  keyPath: `${process.env.HOME}/.near/validator_key.json`,
		  walletUrl: "http://localhost:4000/wallet",
		  CONTRACT_NAME,
		};
	  case "test":
	  case "ci":
		return {
		  networkId: "shared-test",
		  nodeUrl: "https://rpc.ci-testnet.near.org",
		  CONTRACT_NAME,
		  masterAccount: "test.near",
		};
	  case "ci-betanet":
		return {
		  networkId: "shared-test-staging",
		  nodeUrl: "https://rpc.ci-betanet.near.org",
		  CONTRACT_NAME,
		  masterAccount: "test.near",
		};
	  default:
		throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
	}
  }
// process.env.REACT_APP_ENV = 'prod'
// const getConfig = ()=>{
// 	let config = {
// 		networkId: "mainnet",
// 		explorerUrl: "https://explorer.near.org",
// 		nodeUrl: "https://rpc.mainnet.near.org",
// 		walletUrl: "https://wallet.near.org",
// 		helperUrl: "https://helper.mainnet.near.org",
// 		CONTRACT_NAME,
// 	};

// 	if (process.env.REACT_APP_ENV !== undefined) {
// 		config = {
// 			explorerUrl: "https://explorer.near.org",
// 			...config,
// 			GAS: "200000000000000",
// 			contractMethods: {
// 				changeMethods: [
//           "nft_mint",
//           "new",
//           "nft_transfer",
//           "nft_transfer_call",
//           "nft_approve",
//           "nft_revoke",
//           "nft_revoke_all",
//           "burn_nft",
//           "add_to_whitelist",
//           "remove_from_whitelist",
//           "toggle_whitelisting"
// 				],
// 				viewMethods: [
//         "nft_token",
//         "nft_tokens",
//         "nft_tokens_for_owner",
//         "nft_metadata",
//         "nft_total_supply",
//         "nft_supply_for_owner",
//         "nft_is_approved",
//         "nft_payout",
//         "nft_whitelist"],
// 			},
// 			marketDeposit: "100000000000000000000000",
// 			marketId: "market." + CONTRACT_NAME,
// 		};
// 	}

// 	if (process.env.REACT_APP_ENV === "prod") {
// 		config = {
// 			networkId: "mainnet",
// 			explorerUrl: "https://explorer.near.org",
// 			nodeUrl: "https://rpc.mainnet.near.org",
// 			walletUrl: "https://wallet.near.org",
// 			helperUrl: "https://helper.mainnet.near.org",
// 			CONTRACT_NAME,
// 		};
// 	}

// 	return config;
// };

// export default getConfig;