const NftMethods = {
    viewMethods: [
        "nft_token",
        "nft_tokens",
        "nft_tokens_for_owner",
        "nft_metadata",
        "nft_total_supply",
        "nft_supply_for_owner",
        "nft_is_approved",
        "nft_payout",
        "nft_whitelist"
    ],
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
  };
  
  export default NftMethods;