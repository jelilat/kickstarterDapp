import React, { useState, useEffect } from 'react';
import "./Campaign.css";
import { create } from 'ipfs-http-client';
const BN = require("bn.js");

function Create() {
    const client = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const [file, setFile] = useState()
    const [description, setDescription] = useState({
      name: '',
      description: '',
      goal: 0,
    });

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
            console.log(await client.add(file))
            await client.add(file)
            .then( async (CID) => {
                const url = `https://ipfs.io/ipfs/${CID.cid.toString()}`;
                console.log(url)
                await window.contract.create_campaign(
                    description.name,
                    description.goal * BN("10000000000000000000000"),
                    description.description,
                    url,
                )
                .then(alert("Campaign created successfully!"))
                .catch((err) => {
                    console.log(err);
                    alert("Error creating campaign. Try again.")
                });
            })
            .catch((err) =>{
                console.log(err);
                // alert("Error uploading image. Try again.")
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