import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'
import { BallTriangle } from 'react-loader-spinner';

function Projects() {
    const [projects, setProjects] = useState();

    useEffect(() => {
        console.log(window.contract)
        window.contract.list_campaigns()
        .then((crowdfundProjects) => {
            setProjects(crowdfundProjects);
            console.log(crowdfundProjects);
        })
    }, [])

    return (
        <div>
            {projects && projects.map((project) => {
                <p>{project}</p>
            })}
        </div>
    )
}

export default Projects;