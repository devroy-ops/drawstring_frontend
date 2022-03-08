
import * as nearAPI from "near-api-js";
import { db } from "../db/firebase";
import Big from "big.js";


const mint_txFee = Big(0.1)
    .times(10 ** 24)
    .toFixed();

const deploy_txFee = Big(4)
    .times(10 ** 24)
    .toFixed();

const transfer_txFee = Big(1)
    .times(10 ** 24)
    .toFixed();

const GAS = Big(20)
    .times(10 ** 13)
    .toFixed();

const txFee = Big(1)
  .times(10 ** 24)
  .toFixed();

  const storage1 = async(wallet) =>{
    try{
      // call market init function then ->
      debugger;
    //   var loadMarketplaceContract;
    //   if(!transactionHashes){
        const loadMarketplaceContract = await initMarketplaceContract(wallet);
    //   }
      debugger;
      const response = await loadMarketplaceContract.storage_deposit({"account_id": "jitendrapal080791.testnet"}, GAS, txFee);
      console.log(response);
      debugger;
      console.log(loadMarketplaceContract);
    }catch(err){
      console.log(err)
    }
  }

  const initMarketplaceContract = async (wallet) =>{
    try {
        // Load the NFT from the subaccount created in the deploy function
        return await new nearAPI.Contract(
            wallet.account(),
            //nearConfig.contractName,
            "drawstring_market.testnet",
            {
              viewMethods: [
                "get_supply_by_owner_id",
                // "supported_ft_token_ids",
                "get_supply_sales",
                // "get_supply_by_nft_token_type",
                "get_supply_by_nft_contract_id",
                "get_sales_by_owner_id",
                "get_sales_by_nft_contract_id",
                "storage_minimum_balance",
                "storage_balance_of",
                "get_sale"
              ], 
              changeMethods: [
                "new",
                "storage_deposit",
                "storage_withdraw",
                "nft_on_approve",
                "remove_sale",
                "update_price",
                "offer",
                "nft_transfer_payout"
              ],
              // Sender is the account ID to initialize transactions.
              // getAccountId() will return empty string if user is still unauthorized
              sender: wallet.getAccountId(),
            }
          );

    } catch (error) {
        console.log(error);
        return error;
    }
  }


const init = async (wallet, author) => {
    try {
        // Load the NFT from the subaccount created in the deploy function
        return await new nearAPI.Contract(
            wallet.account(),
            `${author.userName}.stingy.testnet`,//"jitendra.stingy.testnet", // newly created subaccount
            {
                // View methods
                viewMethods: [
                    "nft_token",
                    "nft_tokens",
                    "nft_tokens_for_owner",
                    "nft_metadata",
                    "nft_total_supply",
                    "nft_supply_for_owner",
                    "nft_is_approved",
                    "nft_payout"
                ],
                // Change methods
                changeMethods: [
                    "nft_mint",
                    "new",
                    "nft_transfer",
                    "nft_transfer_call",
                    "nft_approve",
                    "nft_revoke",
                    "nft_revoke_all",
                    "burn_nft"
                ],
                sender: wallet.getAccountId(),
            }
        );

    } catch (error) {
        console.log(error);
        return error;
    }
};

const author = async (authorId) =>{
   return await db.collection('authors').doc(authorId).get().then((querySnapshot) => {
        let response = querySnapshot.data();
        return response;
    });
}


export { init, mint_txFee, deploy_txFee, transfer_txFee,  GAS, author, txFee, storage1 };

