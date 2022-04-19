// import logo from '../logo.svg';
import '../App.css'
import * as nearAPI from 'near-api-js'
import audio from '../images/collection/audio_bg.png'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
// import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react'
// import avtar from '../images/users/avatar.svg';
import twitter from '../images/users/twitterlogo.svg'
// import bg_users from '../images/users/bg_users.svg';
import copy_icon from '../images/users/copy_icon.svg'
import upload from '../images/users/upload.svg'
import more from '../images/home/more.svg'
import '../styles/user.css'
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
// import blockchain from '../images/home/blockchain.svg';
import category from '../images/home/category.svg'
import saletype from '../images/home/saletype.svg'
import price from '../images/home/price.svg'
import sort from '../images/home/sort.svg'
import images from '../images/home/images.svg'
import arrow_down from '../images/home/arrow_down.svg'
import { FileTypes, MarketplaceTypes } from '../enums/filetypes'
import NftDetailModal from './nftmodal'
import Big from "big.js";
// import explore1 from '../images/home/explore1.svg';
// import explore2 from '../images/home/explore2.svg';
// import explore3 from '../images/home/explore3.svg';
// import explore4 from '../images/home/explore4.svg';
// import explore5 from '../images/home/explore5.svg';
// import explore6 from '../images/home/explore6.svg';
// import explore7 from '../images/home/explore7.svg';
// import explore8 from '../images/home/explore8.svg';
import heart from '../images/home/heart.svg'
import avtar from '../images/users/avatar.svg'
import { initMarketplaceContract } from '../services/helper'
import { toast } from 'react-toastify'
import { Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { getUser, getUserForUpdateDb } from '../db/mongodb'
import { Loader } from '../services/ui'
import NftsLists from './nftslist'
import { buyOrRemoveFromSale } from '../services/helper'

const init = async (wallet, subaccount) => {
  try {
    // Load the NFT from the subaccount created in the deploy function
    return await new nearAPI.Contract(
      wallet.account(),
      // `${subaccount}.stingy.testnet`,//"jitendra.stingy.testnet", // newly created subaccount
      `${subaccount}`,
      {
        // View methods
        viewMethods: [
          'nft_token',
          'nft_tokens',
          'nft_tokens_for_owner',
          'nft_metadata',
          'nft_total_supply',
          'nft_supply_for_owner',
          'nft_is_approved',
          'nft_payout',
          'nft_whitelist',
        ],
        // Change methods
        changeMethods: [
          'nft_mint',
          'new',
          'nft_transfer',
          'nft_transfer_call',
          'nft_approve',
          'nft_revoke',
          'nft_revoke_all',
          'burn_nft',
          'add_to_whitelist',
          'remove_from_whitelist',
          'toggle_whitelisting',
          'set_contract_royalty',
        ],
        sender: wallet.getAccountId(),
      },
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

const Profile = ({ contractX, account, wallet }) => {
  //const accountId = wallet.getAccountId();
  const [collections, setCollections] = useState([])
  const [activeTab, setActiveTab] = useState(1)
  const [author, setAuthor] = useState({})
  const [isLoading, setLoader] = useState(false)
  const [listedNfts, setListedNfts] = useState([])
  const [onSaleNfts, setOnSaleNfts] = useState([])
  const [createdNfts, setCreatedNfts] = useState([])
  const [ownedNfts, setOwnedNfts] = useState([])
  const [onSale, setOnSale] = useState([])
  const [Nftresult, setNftResult] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  let navigate = useNavigate()

  const { userId } = useParams()
  console.log(onSale, 'hehe')
  const accountId = userId ? userId : wallet.getAccountId()

  const handleSelect = (selectedTab) => {
    setActiveTab(parseInt(selectedTab))
  }

  useEffect(() => {
    //checkForByOrRemovedFromSale()
    const transactionHashes = searchParams.get('transactionHashes')
    buyOrRemoveFromSale(transactionHashes, wallet.getAccountId())
  }, [])

  const [nft, setNft] = useState({})
  const handleClose = () => setShow(false)
  const [show, setShow] = useState(false)
  const handleShow = (nftData) => {
    setNft(nftData)
    setShow(true)
  }

  useEffect(() => {
      
    return getProfile()
  }, [])

  const getProfile = async () => {
    setLoader(true)
    const user = await getUserForUpdateDb()
    const response = await user.functions.get_profile(accountId)
    console.log(response)
    setAuthor(response)
    setLoader(false)
    getNftsOnSale()
    getAllListedNfts()
    getCollections()
    console.log(apr_mint_txFee, 'apr');
  }
  const apr_mint_txFee = Big(0.1)
  .times(10 ** 24)
  .toFixed(); 

  const getNftsOnSale = async () => {
    let NFTs = []
    const Contract = await initMarketplaceContract(wallet)

    const onSaleNfts = await Contract.get_sales_by_owner_id({
      account_id: accountId,
      from_index: '0',
      limit: 500,
    })
    setOnSale(onSaleNfts)
    const sales = {};

    onSaleNfts.forEach(async (sale) => {
      const contract = await init(wallet, sale.nft_contract_id)
      const NFT = await contract.nft_token({ token_id: sale.token_id })

      NFTs.push({ ...NFT, ...sale, })
    })

    setNftResult(NFTs);
    debugger;
  }
 
            
     


  console.log(Nftresult, 'ass')
  const getAllListedNfts = async () => {
    setLoader(true)
    const user = await getUser()
    const allListedNfts = await user.functions.get_nfts_by_owner(accountId)
    console.log(allListedNfts)

    const liveNfts = allListedNfts.filter((x) => x.is_live === true)
    const created = allListedNfts.filter((x) => x.createdBy === accountId)
    const owned = allListedNfts.filter((x) => x.owner === accountId)

    setOnSaleNfts(liveNfts)
    setCreatedNfts(created)
    setOwnedNfts(owned)

    setListedNfts(allListedNfts)
    setLoader(false)
  }

  const getCollections = async () => {
    setLoader(true)
    const user = await getUser()
    //const top = await user.functions.get_collections(limit, offset)
    const response = await user.functions.get_collections_by_createdBy(
      100,
      0,
      accountId,
    )
    console.log(response)
    setCollections(response)
    setLoader(false)
  }

  const addLike = async (nft, index) => {
    const newItems = [...listedNfts]
    newItems[index].likes = newItems[index].likes
      ? newItems[index].likes + 1
      : 1
    setListedNfts(newItems)

    const walletId = wallet.getAccountId()
    const user = await getUserForUpdateDb()
    await user.functions.add_like(walletId, nft.id, nft.contract_id)
  }

  return (
    <div className="bg-darkmode ueser-pages">
      {isLoading ? <Loader /> : null}
      <div className="pos-rel pb-5">
        <div
          className="bg-profile height-240 banner-bg"
          style={{ backgroundImage: `url('${author?.bannerImageUrl}')` }}
        ></div>
        <div className="container pb-5 px-0">
          <img
            src={author?.profile_pic || avtar}
            className="avtar-position edit-profile-pic-input"
            width="186"
            height="186"
          />
        </div>
      </div>
      <div className="container pb-5 px-0">
        <div className="text-light font-size-32 font-w-700">
          {author?.display_name}
        </div>
        <div className="d-flex text-light">
          <div className="pt-1 pe-4 font-size-24">
            {' '}
            <a href={author?.twitter} target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt="twitter link" width="30" height="30" />
            </a>{' '}
          </div>
          <div className="copy-btn">
            {' '}
            {accountId}{' '}
            <img
              src={copy_icon}
              className="float-end"
              onClick={() => {
                navigator.clipboard.writeText(`${author?.twitter}`)
                toast('copied twitter profile link', { type: 'success' })
              }}
            />
          </div>
        </div>

        <div className="row pt-3">
          <div className="col-sm-6 auther-desc mt-2">
            {author?.bio}
            {/* Author's name is a travel and documentary photographer based in Quebec, Canada. She documents streets, cultures and landscapes. */}
          </div>
        </div>
        {/* <div className="d-flex text-light pt-4 font-size-18 color-white">
                    <div className="pe-5">150 followers</div>
                    <div>150 following</div>
                </div> */}
        <div className="d-flex py-4">
          {/* <button type="button" className="btn follow-btn">Follow</button> */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin.toString() + '/user/' + accountId}`,
              )
              toast('copied user profile url', { type: 'success' })
            }}
            className="btn mx-4 up-btn"
          >
            <img src={upload} />
          </button>
          <button type="button" className="btn more-btn">
            <img src={more} />
          </button>
        </div>
      </div>
      <div className="">
        <div className="container tabs-links px-0">
          <Tabs activeKey={activeTab} onSelect={handleSelect}>
            <Tab eventKey={1} title={`On sale ${Nftresult.length}`}>
              {/* <div className="border-bottom-2"></div> */}
              <div className="pb-4">
                <div className="row title text-light pt-3">
                  <div className="col-sm-9">
                    {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                    <img src={category} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Category{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={images} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Collections{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={saletype} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sale type{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={price} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Price range{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                  <div className="col-sm-3 text-end">
                    <img src={sort} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sort By{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                </div>
                <div className="row pt-2">
                  {Nftresult &&
                    Nftresult.length > 0 &&
                    Nftresult.map((nft, index) => {
                      return (
                        <div className="col-sm-3 pb-4" key={index}>
                          <div className="top-sec-box">
                            <div className="row py-2 px-3">
                              <div className="col-sm-8">
                                <div className="d-flex">
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>Owner: {nft?.owner_id}</Tooltip>
                                    }
                                  >
                                    <span
                                      className="d-inline-block"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        navigate(`/user/${nft.owner}`)
                                        window.location.reload()
                                      }}
                                    >
                                      <div className="explore-dot bg-pink"></div>
                                    </span>
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>
                                        Creator: {nft?.createdBy || nft?.owner}
                                      </Tooltip>
                                    }
                                  >
                                    <span
                                      className="d-inline-block"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        navigate(
                                          `/user/${
                                            nft.createdBy || nft?.owner
                                          }`,
                                        )
                                        window.location.reload()
                                      }}
                                    >
                                      <div className="explore-dot bg-blue"></div>
                                    </span>
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>
                                        Collection: {nft?.nft_contract_id}
                                      </Tooltip>
                                    }
                                  >
                                    <span
                                      className="d-inline-block"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        navigate(
                                          `/viewcollection/${nft.collection_name
                                            .toLowerCase()
                                            .replace(/ /g, '_')}`,
                                        )
                                      }}
                                    >
                                      <div className="explore-dot bg-green"></div>
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              </div>
                              <div className="col-sm-4 ">
                                <div
                                  className="explore-dot bg-black float-end"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${window.location.origin.toString()}/nft/${nft.collection_name
                                        .toLowerCase()
                                        .replace(/ /g, '_')}/${nft.id}`,
                                    )
                                    toast('nft link copied to clipboard', {
                                      type: 'success',
                                    })
                                  }}
                                >
                                  <img
                                    src={nft.media_link}
                                    className="up-icon"
                                  />
                                </div>
                              </div>
                            </div>
                          
                                <img
                                  src={nft.metadata.media}
                                  className="w-100"
                                  height="270"
                                  alt="nft media"
                                  onClick={() => handleShow(nft)}
                                />
                           
                            {nft?.type && nft?.type.includes(FileTypes.VIDEO) && (
                              <video
                                width="100%"
                                id="video"
                                height="270"
                                onClick={() => handleShow(nft)}
                              >
                                <source
                                  src={nft.metadata.media}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                            {nft?.type &&
                              nft?.type.includes(FileTypes.AUDIO) && (
                                <img
                                  src={nft.metadata.media}
                                  className="w-100"
                                  height="270"
                                  alt="nft media"
                                  onClick={() => handleShow(nft)}
                                />
                              )}

                            <div className="text-light font-size-18 p-3">
                              <div>{nft.metadata.title}</div>
                              <div className="row pt-2 bid-mobile-100">
                                <div className="col-sm-6">
                                  {formatNearAmount(nft.sale_conditions)} Near{' '}
                                  <span className="color-gray">1/1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      )
                    })}
                    {show && (
                    <NftDetailModal
                      nftData={nft}
                      isModalOpen={show}
                      handleClose={handleClose}
                      wallet={wallet}
                    />
                  )}

                  {Nftresult && Nftresult.length == 0 && (
                    <div className="alert alert-secondary" role="alert">
                      No data available {Nftresult.length}
                    </div>
                  )}
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title={`Created ${createdNfts.length}`}>
              <div className="pb-4">
                <div className="row title text-light pt-3">
                  <div className="col-sm-9">
                    {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                    <img src={category} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Category{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={images} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Collections{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={saletype} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sale type{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={price} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Price range{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                  <div className="col-sm-3 text-end">
                    <img src={sort} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sort By{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                </div>
                <div className="row pt-2">
                  {createdNfts && (
                    <NftsLists nfts={createdNfts} wallet={wallet} />
                  )}

                  {createdNfts && createdNfts.length == 0 && (
                    <div className="alert alert-secondary" role="alert">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </Tab>
            <Tab eventKey={3} title={`Owned ${ownedNfts.length}`}>
              <div className="pb-4">
                <div className="row title text-light pt-3">
                  <div className="col-sm-9">
                    {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                    <img src={category} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Category{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={images} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Collections{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={saletype} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sale type{' '}
                    </span>
                    <img src={arrow_down} />
                    <img src={price} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Price range{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                  <div className="col-sm-3 text-end">
                    <img src={sort} className="ps-4" />
                    <span className="font-size-14 vertical-align px-2">
                      {' '}
                      Sort By{' '}
                    </span>
                    <img src={arrow_down} />
                  </div>
                </div>
                <div className="row pt-2">
                  {ownedNfts && <NftsLists nfts={ownedNfts} wallet={wallet} />}
                  {ownedNfts && ownedNfts.length == 0 && (
                    <div className="alert alert-secondary" role="alert">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            {/* <Tab eventKey={4} title="Liked  18">Tab 4 content is displayed by default</Tab>
                        <Tab eventKey={5} title="Activity">Tab 5 content</Tab> */}

            <Tab eventKey={6} title="Collabs">
              <div className="alert alert-secondary" role="alert">
                No data available
              </div>
            </Tab>
            <Tab eventKey={7} title="Collections">
              <div className="mt-4">
                <div className="row home_explore">
                  {/* {isLoading ? <Loader /> : null} */}
                  {collections &&
                    collections.length > 0 &&
                    collections.map((collection, index) => {
                      return (
                        <div className="col-sm-3 pb-4" key={index}>
                          <div
                            className="top-sec-box"
                            onClick={() =>
                              navigate(
                                `/viewcollection/${collection.contractId}`,
                              )
                            }
                          >
                            {/* <div className="row py-2 px-3" >
                                                          <div className="col-sm-8">
                                                            <div className="d-flex">
                                                                <div className="explore-dot bg-pink"></div>
                                                                <div className="explore-dot bg-blue"></div>
                                                                <div className="explore-dot bg-green"></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 ">
                                                            <div className="explore-dot bg-black float-end">
                                                                <img src={more} className="pb-1" alt="more icon" />
                                                            </div>
                                                        </div> 
                                                    </div>*/}
                            <img
                              src={collection.img}
                              className="w-100"
                              height="270"
                              alt="collection media"
                            />
                            {/* onClick={() => handleShow(nft)}  */}
                            <div className="text-light font-size-18 p-3">
                              <div>{collection.name}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {collections && collections.length == 0 && (
                    <div className="alert alert-secondary" role="alert">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
export default Profile
