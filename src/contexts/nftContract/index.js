import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { transactions } from 'near-api-js';

import { initialNftContractState } from './reducer';

import { marketContractName } from '../../services/utils';


const PAYABLE_METHODS = 'PAYABLE_METHODS';
const APP = 'APP';
const STORAGE = 'STORAGE'


export const NftContractContext = React.createContext(initialNftContractState);

export const NftContractContextProvider = ({ nftContract, children }) => {
  const getGem = useCallback(async (id) => nftContract.nft_token({ token_id: id }), [nftContract]);

  const getGems = useCallback(
    async (fromIndex, limit) =>
      nftContract.nft_tokens_from_end({
        from_index: fromIndex,
        limit,
      }),
    [nftContract]
  );

  const getGemsForOwner = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit: Number(limit),
      });
    },
    [nftContract]
  );

  const getGemsForCreator = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_creator({
        account_id: accountId,
        from_index: fromIndex,
        limit: Number(limit),
      });
    },
    [nftContract]
  );

  const getIsFreeMintAvailable = useCallback(
    async (accountId) => {
      return nftContract.is_free_mint_available({
        account_id: accountId,
      });
    },
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) =>
      nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      }),
    [nftContract]
  );

  const nftTransfer = useCallback(
    async (nftId, receiverId) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.NFT_TRANSFER);

      await nftContract.nft_transfer(
        {
          token_id: nftId,
          receiver_id: receiverId
        },
        APP.PREPAID_GAS_LIMIT,
        1
      );
    },
    [nftContract]
  );

  const listForSale = useCallback(
    async (nftId, price) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.LIST);

      await nftContract.nft_approve(
        {
          token_id: nftId,
          account_id: marketContractName,
          msg: JSON.stringify({
            sale_conditions: [
              {
                price,
                ft_token_id: 'near',
              },
            ],
          }),
        },
        APP.PREPAID_GAS_LIMIT,
        1
      );
    },
    [nftContract]
  );

  const setProfile = useCallback(
    async (profile) => {
      await nftContract.account.signAndSendTransaction(nftContract.contractId, [
        transactions.functionCall(
          'set_profile',
          Buffer.from(
            JSON.stringify({
              profile,
            })
          ),
          APP.PREPAID_GAS_LIMIT_HALF
        ),
      ]);
    },
    [nftContract]
  );

  const getProfile = useCallback(
    async (account_id) =>
      nftContract.get_profile({
        account_id,
      }),
    [nftContract]
  );

  const getSupplyForCreator = useCallback(
    async (account_id) =>
      nftContract.nft_supply_for_creator({
        account_id,
      }),
    [nftContract]
  );

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsForCreator,
    getGemsBatch,
    nftTransfer,
    listForSale,
    setProfile,
    getProfile,
    getSupplyForCreator,
    getIsFreeMintAvailable,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

