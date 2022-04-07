import * as nearAPI from "near-api-js";
import { db } from "../db/firebase";
import Big from "big.js";
import { ObjectID } from 'bson';
import { mongodb } from "../db/mongodb";
import { marketContractName, smartContractName } from "./utils";


const mint_txFee = Big(0.1)
  .times(10 ** 24)
  .toFixed();

const deploy_txFee = Big(4)
  .times(10 ** 24)
  .toFixed();

const transfer_txFee = Big(1)
  .times(10 ** 24)
  .toFixed();

const GAS = Big(30)
  .times(10 ** 13)
  .toFixed();

const txFee = Big(1)
  .times(10 ** 24)
  .toFixed();

// const GAS = Big(30)
//   .times(10 ** 13)
//   .toFixed();

const storageDeposit = async (wallet) => {
  const loadMarketplaceContract = await initMarketplaceContract(wallet);

  const accoutnId = wallet.getAccountId();
  try {
    const minBalance = await loadMarketplaceContract.storage_minimum_balance({});
    const balance = await loadMarketplaceContract.storage_balance_of({ account_id: accoutnId });
    debugger;

    if (minBalance > balance) {
      debugger;
      const response = await loadMarketplaceContract.storage_deposit({ "account_id": accoutnId }, GAS, txFee);
    }
    return;
  } catch (err) {
    console.log(err)
    await loadMarketplaceContract.storage_deposit({ "account_id": accoutnId }, GAS, txFee);
  }
}

const initMarketplaceContract = async (wallet) => {
  try {
    // Load the NFT from the subaccount created in the deploy function
    return await new nearAPI.Contract(
      wallet.account(),
      //"drawstring_market.testnet",
      marketContractName,
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

const init = async (wallet, subaccount) => {
  try {
    // Load the NFT from the subaccount created in the deploy function
    return await new nearAPI.Contract(
      wallet.account(),
      // `${subaccount}.stingy.testnet`,//"jitendra.stingy.testnet", // newly created subaccount
      `${subaccount}.${smartContractName}`,
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
          "nft_payout",
          "nft_whitelist"
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
          "burn_nft",
          "add_to_whitelist",
          "remove_from_whitelist",
          "toggle_whitelisting",
          "set_contract_royalty"
        ],
        sender: wallet.getAccountId(),
      }
    );

  } catch (error) {
    console.log(error);
    return error;
  }
};

const author = async (authorId) => {
  //  return await db.collection('authors').doc(authorId).get().then((querySnapshot) => {
  //       let response = querySnapshot.data();
  //       return response;
  //   });
  const id = ObjectID(authorId);
  return await mongodb.collection('authors').findOne({ _id: id });

}


export { init, mint_txFee, deploy_txFee, transfer_txFee, GAS, author, txFee, storageDeposit, initMarketplaceContract };

