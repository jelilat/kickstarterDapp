import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'
import { BallTriangle } from 'react-loader-spinner';
import './Projects.css'
const BN = require("bn.js")
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [donationId, setDonationId] = useState()
    const [donationAmount, setDonationAmount] = useState()

    const ONE_NEAR = new BN("1000000000000000000000000");

    useEffect(async () => {
        setLoading(true);
        console.log(window.contract)
        await window.contract.list_campaigns()
        .then((crowdfundProjects) => {
            setProjects(crowdfundProjects);
            console.log(crowdfundProjects);
            setLoading(false)
        })
    }, [])

    async function donate(id, amount) {
        setLoading(true);
        if (donationAmount === undefined) {
            alert('Please enter an amount to donate');
            return;
        }
        if (donationAmount === 0 || donationAmount < 1) {
            alert
        }
        
        const camount = Math.floor(amount);
        const bamount = new BN(camount);
        console.log(bamount.mul(ONE_NEAR))
        await window.contract.add_donation({
            num_id: id,
            amount: amount,
        }, 
        300000000000000, //gas estimate
        bamount.mul(ONE_NEAR), //donation amount
        )
        .then((res) => {
            console.log(res)
            setLoading(false)
        })

    }

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
          slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
          
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        }
      };

    return (
        <div className="container">
            <div className="projects">
                <h1 style={{textAlign:'center'}}>Projects</h1>
                <Carousel responsive={responsive} >
                    {projects.map((project, index) => {
                        return(
                            <div className="project" key={index}>
                            <img src={project.image} />
                            <h3>{project.title}</h3>
                            <span style={{fontSize:'0.8em'}}>Target: {project.donation_target} Ⓝ</span><br />
                            <p>{project.description}</p>
                            <button onClick={() =>{
                                setDonationId(index)
                            }}>Support</button>
                        </div>
                        )

                    })}
                </Carousel>
                {loading && <div
                    style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                    }}
                    >
                    <BallTriangle color="#ec5990" height="100" width="100" />
                </div>}
                {donationId && 
                    <div className="donate-section">
                        <label>Amount <span className="donate-icon">
                            <FontAwesomeIcon icon={faInfoCircle} /> <span>Inputs will be rounded to the nearest whole number
                            </span></span>
                        </label>
                        <input type="number" name="amount" placeholder="1" className="amount" onChange={(e) => {setDonationAmount(e.target.value)}} />
                        <button disabled={!donationAmount || donationAmount === 0 || loading} onClick={() => {donate(donationId, donationAmount)} }>
                            Donate
                            {loading && <FontAwesomeIcon icon={faSpinner} />}
                            </button>
                    </div>}
            </div>
        </div>
    )
}

export default Projects;