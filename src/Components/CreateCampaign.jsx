import "regenerator-runtime/runtime";
import React, { useState, useEffect } from 'react';
import "./Campaign.css";
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js';
const BN = require("bn.js");

function Create() {
    const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM0YzVEMjlBNGZFNzNEYWIwOTdhOWY4ODdEOTg4YmY0QjEwNzRFMEIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDc5MzA2ODQ0NCwibmFtZSI6Im5lYXIgbmZ0In0.ZIeP2yfnCtyeEB54705cmhxEdC_mIbg8KQCUWnizP3w';
    const nft = new NFTStorage({
        endpoint: 'https://api.nft.storage/',
        token
    });
    const [file, setFile] = useState()
    const [description, setDescription] = useState({
      name: '',
      description: '',
      goal: 0,
    });
    const [src, setsrc] = useState()

    const updateDescription = () => {
        const name = document.getElementById('title');
        const description = document.getElementById('description');
        const goal = document.getElementById('goal');
        setDescription({
            name: name.value,
            description: description.value,
            goal: goal.value,
        })
    }
    
      const handleFileChange = (e) => {
          console.log(e)
        const fileData = e.target.files[0];
        setFile(fileData);
        const URL = window.URL || window.webkitURL;
        setsrc(URL.createObjectURL(fileData));
      }

      const createCampaign = async () => {
        if (!window.walletConnection.isSignedIn()) {
            alert('You must be signed in to create a campaign');
            return;
        }
        if (file === undefined) {
            alert('You must upload an image');
            return;
        }
        if (description.name === '' || description.description === '' || description.goal === 0) {
            alert('Please fill out all fields');
            return;
        } else {
            await nft.storeDirectory([file])
            .then(async (CID) => {
                alert(CID);
                const url = `https://${CID}.ipfs.dweb.link`;
                console.log(url)
                await window.contract.create_campaign(
                    description.name,
                    description.goal * BN("10000000000000000000000"),
                    description.description,
                    url,
                )
                .then(alert("Campaign created successfully!"))
                .catch((err) => {
                    // alert(err);
                    alert("Error creating campaign. Try again." + err);
                });
            })
            .catch((err) =>{
                alert("Error uploading image. Try again." + err);
                console.log(err);
            });

        }
        
      }

    return(
        <div className="form">
            <h1 style={{textAlign: 'center'}}>Create Campaign</h1>
            <form>
                <label>Title</label><br />
                <input type="text" name="title" placeholder="e.g. Kickstarter" id="title" onChange={updateDescription} /> <br />
                <label>Description</label><br />
                <textarea id="description" name="description" onChange={updateDescription}></textarea><br />
                <label>Goal Ⓝ</label>
                <input type="number" min="0" name="goal" placeholder="20" id="goal" onChange={updateDescription} /><br />
                <label>Image</label>
                <input type="file" accept='image/jpg, image/jpeg' onChange={handleFileChange} /><br />
                <button type="submit" onClick={createCampaign}>Create Campaign</button>
            </form>
        </div>
    )
}

export default Create;