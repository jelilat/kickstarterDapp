import "regenerator-runtime/runtime";
import React, { useState, useEffect } from 'react';
import "./Campaign.css";
// import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js';
const BN = require("bn.js");
import { create } from 'ipfs-http-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function Create() {
    const client = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const [file, setFile] = useState()
    const [description, setDescription] = useState({
      name: '',
      description: '',
      goal: 0,
    });
    const [loading, setLoading] = useState(false);

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
      }

      const createCampaign = async () => {
          setLoading(true);
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
        } 

        await client.add(file)
        .then(async (CID) => {
            const url = `https://ipfs.io/ipfs/${CID.cid.toString()}`;
            console.log(url)
            await window.contract.add_campaign({
                title: description.name,
                donation_target: parseInt(description.goal),
                description: description.description,
                image: url,
            },
            300000000000000, //gas estimate
            )
            .catch((err) => {
                // alert(err);
                alert("Error creating campaign. Try again." + err);
            });
            alert("Campaign created successfully!")
            setLoading(false);
        })
        // .catch((err) =>{
        //     alert("Error uploading image. Try again." + err);
        //     console.log(err);
        // })
        
      }

    return(
        <div className="form">
            <h1 style={{textAlign: 'center'}}>Create Campaign</h1>
            <div>
                <label>Title</label><br />
                <input type="text" name="title" placeholder="e.g. Kickstarter" id="title" onChange={updateDescription} /> <br />
                <label>Description</label><br />
                <textarea id="description" name="description" onChange={updateDescription}></textarea><br />
                <label>Goal Ⓝ</label>
                <input type="number" min="0" name="goal" placeholder="20" id="goal" onChange={updateDescription} /><br />
                <label>Image</label>
                <input type="file" accept='image/jpg, image/jpeg' onChange={handleFileChange} /><br />
                <button onClick={createCampaign} disabled={loading} className="create-button">
                    Create Campaign {loading && <FontAwesomeIcon icon={faSpinner} />}
                    </button>
            </div>
        </div>
    )
}

export default Create;