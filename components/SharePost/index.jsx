import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    EmailShareButton,
    FacebookShareButton,
    FacebookMessengerShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";

import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";


const ShareBox = styled.div`
position: relative;
box-sizing: border-box;
display:inline-block;
background-color: #ffffff;
// width:60vw;
// height: 30vh;
border-radius: 20px;
padding: 10px;
box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
@media (min-width: 767px) {
    width: 50vh;
}
`


const ShareIcons = styled.div`
display: flex;
justify-content: space-between;
margin:3%;
`
const Copybox = styled.div`
position: relative;
display: flex;
align-items: center;
margin-bottom: 1em;
`

const LinkIcon = styled.img`
position: absolute;
height: 25px;
margin:auto 5px;
left:5%

`

const LinkInput = styled.input`
display:flex;
border-radius: 5px;
border:1px solid #000100;
width: 90%;
padding: 5px 75px 5px 30px;
height: 6vh;
margin:auto;
justify-content: center;
align-items: center;
font-size: 1.1rem;
color: #000100;
`

const Button = styled.button`
position: absolute;
    background-color: #047857;
    color: white;
    border-radius: 15px;
    border: none;
    padding:auto 6px;
    right: 6%;
    height: 30px;
    width: 70px;
`

const CloseBtn = styled.button`
position: absolute;
    background-color: transparent;
    border: none;
    right: 5%;
    height: 20px;
    width: 20px;
    color: #064e3b;
    }
`



export default function SharePost({ share, shareUrl, closeShare }) {


    const [copied, setCopied] = useState(false);
    // const [showShare, setShowShare] = useState(true);

    const handleOnCopy = () => {
        setCopied(true);
    };


    return (
        <>
            {share && (
                <ShareBox>
                    <CloseBtn onClick={closeShare}>x</CloseBtn>
                    {/* <CloseBtn onClick={closeShare}>
                        <Icon>close</Icon>
                    </CloseBtn> */}

                    <p>Share this link with</p>
                    <ShareIcons>
                        <div>
                            <FacebookShareButton url={shareUrl}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                        </div>
                        <div>
                            <TwitterShareButton url={shareUrl} title="Welcome to Code It">
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                        </div>
                        <div>
                            <EmailShareButton url={shareUrl} subject="Welcome to Code It">
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                        </div>
                        <div>
                            <FacebookMessengerShareButton url={shareUrl}>
                                <FacebookMessengerIcon size={32} round />
                            </FacebookMessengerShareButton>
                        </div>
                        <div>
                            <WhatsappShareButton url={shareUrl} title="Welcome to Code It">
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                        </div>
                    </ShareIcons>
                    <p>or copy this link:</p>
                    <Copybox>
                        <LinkIcon src="../shareLinkIcons.png" alt="share icon" />
                        <LinkInput type="text" value={shareUrl} readOnly></LinkInput>
                        <Button>
                            <CopyToClipboard
                                text={shareUrl}
                                onCopy={handleOnCopy}>
                                {copied ? <span>Copied</span> : <span>Copy</span>}
                            </CopyToClipboard>
                        </Button>
                    </Copybox>
                </ShareBox>
            )}
        </>
    )

}
