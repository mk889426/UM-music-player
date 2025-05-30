import React, { useEffect, useState } from "react";
import PlaylistSidebar from "../components/PlaylistSidebar";
import MusicPlayer from "../components/MusicPlayer";
import Tracks from "../components/Tracks";

const Home = () => {
    const [audioRef, setAudioRef] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState("/sampleMusic/sample.mp3");
    const [metadata, setMetadata] = useState({
        title: "Default Song",
        artist: "Default Artist",
        album: "Jamendo",
        picture: null,
    });
    const clientId = import.meta.env.VITE_Jamendo_clientId;

    const togglePlay = () => {
        if (!audioRef) return;
        if (isPlaying) audioRef.pause();
        else audioRef.play();
        setIsPlaying(!isPlaying);
    };

    const handleTrackClick = (track) => {
        setCurrentTrack(track.audio);
        setMetadata({
            title: track.name,
            artist: track.artist_name,
            album: "Jamendo",
            picture: null,
        });
        setIsPlaying(true);
    };

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch(
                    `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=5`
                );
                const data = await res.json();
                setTracks(data.results);
            } catch (error) {
                console.error("Jamendo fetch error:", error);
            }
        };

        fetchTracks();
    }, []);

    console.log("tracks ::", tracks)

    useEffect(() => {
        if (tracks.length > 0) {
            setCurrentTrack(tracks[0].audio);
            setMetadata({
                title: tracks[0].name,
                artist: tracks[0].artist_name,
                album: "Jamendo",
                picture: null,
            });
        }
    }, [tracks]);

    const handleJamendoTrackClick = (track) => {
        const normalizedMetadata = {
            title: track.name,
            artist: track.artist_name,
            album: track.album_name,
            picture: track.image, 
        };

        setMetadata(normalizedMetadata);
        setCurrentTrack(track.audio);
    };

    return (
        <div className="app-layout">
            <div className="sidebar">
                <PlaylistSidebar />
            </div>
            <div className="player">
                <MusicPlayer
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    setAudioRef={setAudioRef}
                    metadata={metadata}
                    setMetadata={setMetadata}
                    setIsPlaying={setIsPlaying}
                    setCurrentTrack={setCurrentTrack}
                />
            </div>
            <div className="tracks">
                <Tracks jamendoTracks={tracks} onTrackClick={handleJamendoTrackClick} />
            </div>
        </div>
    );
};

export default Home;
