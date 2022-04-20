import * as nearAPI from "near-api-js";
import Big from "big.js";
import { ObjectID } from 'bson';
import { getUser, getUserForUpdateDb, mongodb } from "../db/mongodb";
import { marketContractName, smartContractName } from "./utils";
import { Account } from 'near-api-js';
import { MarketplaceTypes } from "../enums/filetypes";
import { toast } from "react-toastify";

export const doesAccountExist = async (userId, connection) => {
  try {
    await new Account(connection, userId).state();
    return true;
  } catch (error) {
    const errorString = error.toString().toLowerCase();
    const nonexistentAccountErrors = ['does not exist while viewing', `account id ${userId.toLowerCase()} is invalid`];

    if (nonexistentAccountErrors.some((errorStringPart) => errorString.includes(errorStringPart))) {
      return false;
    }
    throw error;
  }
};

const mint_txFee = Big(0.01)
  .times(10 ** 24)
  .toFixed();

const apr_mint_txFee = Big(0.1)
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

 const mGAS = Big(30)
  .times(10 ** 13)
  .toFixed();
// const GAS = Big(30)
//   .times(10 ** 13)
//   .toFixed();
const mtxFee = Big(0.3)
.times(10 ** 24)
.toFixed();

const storageDeposit = async (wallet) => {
  const loadMarketplaceContract = await initMarketplaceContract(wallet);
  const accoutnId = wallet.getAccountId();
  try {
    const minBalance = await loadMarketplaceContract.storage_minimum_balance({});
    const balance = await loadMarketplaceContract.storage_balance_of({ account_id: accoutnId });
    console.log(balance,'mybal')
    console.log(minBalance,'minbal')

    if (minBalance > balance) {
      const response = await loadMarketplaceContract.storage_deposit({ "account_id": accoutnId }, mGAS, mtxFee);
    }
    return;
  } catch (err) {
    console.log(err)
    await loadMarketplaceContract.storage_deposit({ "account_id": accoutnId }, mGAS, mtxFee);
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
          "get_sale",
          "get_sales"
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

const initSmartContract = async (wallet, contract_id) => {
  try {

    // Load the NFT from the subaccount created in the deploy function
    return await new nearAPI.Contract(
      wallet.account(),
      contract_id,
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
  const id = ObjectID(authorId);
  return await mongodb.collection('authors').findOne({ _id: id });

}

const buyOrRemoveFromSale = async (transactionHashes, walletId) => {
  // var transactionHashes = searchParams.get("transactionHashes");
  try{
  if (transactionHashes) {
    const nft = JSON.parse(localStorage.getItem("nft"));
    if (nft) {
      debugger;
      if (nft.marketType == MarketplaceTypes.OFFER) {
        // TODO update db
        debugger;
        const user = await getUserForUpdateDb();
        const removed = await user.functions.buy_nft(nft.owner_id, walletId);
        debugger;
        toast("Nft purchased successfully", { type: "success" });
      } if (nft.marketType == MarketplaceTypes.REMOVED) {
        // TODO update db
        debugger;
        const user = await getUserForUpdateDb();
        const removed = await user.functions.remove_sale(nft.token_id);
        debugger
        toast("Nft removed from sale successfully", { type: "success" });
      }
      if(nft.marketType == MarketplaceTypes.BURN){
        const user = await getUserForUpdateDb();
        const removed = await user.functions.burn_nft(nft.token_id);
        debugger
        toast("Nft burned successfully", { type: "success" });
      }
      if(nft.marketType == MarketplaceTypes.TRANSFER){
        const user = await getUserForUpdateDb();
        const removed = await user.functions.transfer_nft(nft.owner_id, nft.receiver_id);
        debugger
        toast("Nft transferred successfully", { type: "success" });
      }
      if(nft.marketType == MarketplaceTypes.SALE){
        const user = await getUserForUpdateDb();
        const removed = await user.functions.on_sale(nft.token_id, nft.price);
        debugger
        toast("Nft transferred successfully", { type: "success" });
      }

      localStorage.removeItem("nft");
      window.location.reload();
    }
  }
}catch(error){
  debugger;
  console.log(error)
}
}


export { init, initSmartContract, mint_txFee,apr_mint_txFee, deploy_txFee, transfer_txFee, GAS, author, txFee, storageDeposit, initMarketplaceContract, buyOrRemoveFromSale };

