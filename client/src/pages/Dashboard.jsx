import { useEffect, useState } from "react";
import axios from "axios";
import AttendeeDashboard from "../components/AttendeeDashboard";
import OrganizerDashboard from "../components/OrganizerDashboard";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                };
                
                const res = await axios.get(`${import.meta.env.VITE_API_AUTH_URL}/profile`, config);
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <p className="text-center mt-6">Loading Dashboard...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow p-6">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
                {user?.role === "organizer" ? (
                    <OrganizerDashboard user={user} />
                ) : (
                    <AttendeeDashboard user={user} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
