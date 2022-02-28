
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
                    "nft_payout",
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


export { init, mint_txFee, GAS, author };

