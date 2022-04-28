import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'
import { BallTriangle } from 'react-loader-spinner';
import './Projects.css'
const BN = require("bn.js")

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        console.log(window.contract)
        await window.contract.list_campaigns()
        .then((crowdfundProjects) => {
            setProjects(crowdfundProjects);
            console.log(crowdfundProjects);
            setLoading(false)
            console.log(loading)
        })
    }, [])

    async function donate(id, amount) {
        const bamount = new BN(amount);
        const conversion = new BN("10000000000000000000000");
        await window.contract.add_donation({
            num_id: id,
            amount: 1,
        }, 
        300000000000000, //gas estimate
        1, //donation amount
        )
        .then((res) => {
            console.log(res)
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
                            <p>{project.description}</p>
                            <button onClick={() =>{
                                donate(index, "1")
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
                    {console.log(loading)}
                </div>}
            </div>
        </div>
    )
}

export default Projects;