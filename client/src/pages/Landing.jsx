import { useEffect, useState } from "react";
import axios from 'axios';

import Navbar from "../components/Navbar";

const LandingPage=()=>{
    const[eventCount,setEventCount]=useState(0);

    useEffect(()=>{
        const fetchEventCount= async ()=>{
            try {
                const res=await axios.get('/api/events');
                setEventCount(res.data.length);
                
            
            } catch (error) {
                console.error('Error Fetching Events:',error)
                
            }
        };
        fetchEventCount();
    },[]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow flex flex-col items-center text-center px-4 py-6">
                <h1 className="tex-4xl md:text-6xl font-bold">EventSphere</h1>
                <p>Seamlessly manage and Register for amazing Events</p>

                <div className="flex gap-4 mb-8">
                    <a href="#events" className="bg-blue-600 text-white px-6 py-8 hoover:bg-blue-700-transition">
                        Browse Events
                    </a>

                    <a href="/register" className="border border-blue text-blue-600 px-6 py-2">
                        Register Now
                    </a>

                </div>
                <div className="text-xl font-medium text-gray-800">
                    Total Events:<span className="text-blue-600 font-bold">{eventCount}</span>

                </div>

            </main>

            <footer className="bg-gray-100 py-4 text-center text-gray-500 text-sm">
                $copy{new Date().getFullYear()}EventSphere.All Rights Reserved
                
            </footer>

        </div>
    )

}

export default LandingPage;