
const CONTRACT_NAME = process.env.CONTRACT_NAME || "stingy.testnet";

const getConfig = ()=>{
	let config = {
		networkId: "testnet",
		nodeUrl: "https://rpc.testnet.near.org",
		// walletUrl: 'http://localhost:1234',
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		CONTRACT_NAME,
	};

	if (process.env.REACT_APP_ENV !== undefined) {
		config = {
			explorerUrl: "https://explorer.testnet.near.org",
			...config,
			GAS: "200000000000000",
			contractMethods: {
				changeMethods: [
          "nft_mint",
          "new",
          "nft_transfer",
          "nft_transfer_call",
          "nft_approve",
          "nft_revoke",
          "nft_revoke_all",
          "burn_nft",
          "add_to_whitelist",
          "remove_from_whitelist",
          "toggle_whitelisting"
				],
				viewMethods: [
        "nft_token",
        "nft_tokens",
        "nft_tokens_for_owner",
        "nft_metadata",
        "nft_total_supply",
        "nft_supply_for_owner",
        "nft_is_approved",
        "nft_payout",
        "nft_whitelist"],
			},
			marketDeposit: "100000000000000000000000",
			marketId: "market." + CONTRACT_NAME,
		};
	}

	if (process.env.REACT_APP_ENV === "prod") {
		config = {
			...config,
			networkId: "mainnet",
			nodeUrl: "https://rpc.mainnet.near.org",
			walletUrl: "https://wallet.near.org",
			helperUrl: "https://helper.mainnet.near.org",
			CONTRACT_NAME: "near",
		};
	}

	return config;
};

export default getConfig;