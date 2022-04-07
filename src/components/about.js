import React, { useCallback, useContext } from 'react'

export default function About() {
  return (
    <div style={{ marginBottom: "5em", marginTop: "5em" }} className="container text-light">
     
      <h4>What is <a href="https://drawstring.io/">Drawstring.io</a>?</h4>
      <p><a href="https://drawstring.io/">Drawstring.io</a> is an NFT marketplace built on the NEAR protocol..</p>

      <h4 className='pt-4'>What is an NFT?</h4>
      <p>
        An NFT is a receipt which proves ownership of a digital item.  An NFT can be attached to a piece of art, music, video, or locked digital assets like a concert, livestream, or it could be all these things at the same time and more.
      </p>

      <h4 className='pt-4'>What is the NEAR protocol?</h4>
      <p>
        NEAR is a low-cost, carbon neutral blockchain.  It was designed specifically with NFTs in mind and is much easier to use natively than other blockchains.
      </p>

      <h4 className='pt-4'>What is a wallet?</h4>
      <p>
        A wallet is a place to store your NFTs and digital currency.  Wallets on NEAR are very easy to setup using a phone number or email at <a href="http://wallet.near.org/"> wallet.near.org </a>.  We strongly recommend enabling multi-factor authentication in order to keep your wallet as secure as possible.
      </p>

      <h4 className='pt-4'>What is Drawstring DAO?</h4>
      <p>Drawstring is built upon supporting artists, collectors, and the web3 community at large.
        0.5% of all sales on our marketplace go into the Drawstring DAO fund.  These funds are put back into the community for the benefit of artists and collectors.</p>

      <h4>What are the fees on <a href="https://drawstring.io/">Drawstring.io</a>?</h4>
      <p className='pt-4'>
        NFTs minted or sold on our marketplace have a 2% royalty:
      </p>
      <ul>
          <li>1.5% to <a href="https://drawstring.io/">Drawstring.io</a></li>
          <li>0.5% to the Drawstring DAO fund</li>
        </ul>
    </div>
  )
}
