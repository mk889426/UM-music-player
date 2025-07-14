import React, { useEffect, useState } from "react";
import PlaylistSidebar from "../components/PlaylistSidebar";
import MusicPlayer from "../components/MusicPlayer";
import Tracks from "../components/Tracks";

const Home = () => {
  const [audioRef, setAudioRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState("/sampleMusic/sample.mp3");
  const [currentTrackData, setCurrentTrackData] = useState(null);
  const [metadata, setMetadata] = useState({
    title: "Default Song",
    artist: "Default Artist",
    album: "Jamendo",
    picture: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlists, setPlaylists] = useState({ Favourites: [] });
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playingFrom, setPlayingFrom] = useState("jamendo");

  const [showSidebar, setShowSidebar] = useState(false);
  const [showTracks, setShowTracks] = useState(false);


  const clientId = import.meta.env.VITE_Jamendo_clientId;

  const togglePlay = () => {
    if (!audioRef) return;
    if (isPlaying) audioRef.pause();
    else audioRef.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=15`
        );
        const data = await res.json();
        setTracks(data.results);
      } catch (error) {
        console.error("Jamendo fetch error:", error);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0].audio);
      setCurrentTrackData(tracks[0]);
      setMetadata({
        title: tracks[0].name,
        artist: tracks[0].artist_name,
        album: "Jamendo",
        picture: tracks[0].image || null,
      });
      setCurrentIndex(0);
      setPlayingFrom("jamendo");
    }
  }, [tracks]);

  const handleJamendoTrackClick = (track, index) => {
    setMetadata({
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      picture: track.image || null,
    });
    setCurrentTrack(track.audio);
    setCurrentTrackData(track);
    setCurrentIndex(index);
    setIsPlaying(true);
    setSelectedPlaylist(null);
    setPlayingFrom("jamendo");
  };

  // Updated to handle local tracks properly
  const handlePlaylistTrackClick = (track, index, playlistName) => {
    if (track.isLocal) {
      setMetadata({
        title: track.name || track.title || "Local File",
        artist: track.artist || "Local Artist",
        album: "Local Files",
        picture: track.picture || null,
      });
      setCurrentTrack(track.audio);
      setCurrentTrackData(track);
      setCurrentIndex(index);
      setIsPlaying(true);
      setPlayingFrom(playlistName);
      setSelectedPlaylist(playlistName);
    } else {
      // Jamendo track from playlist
      setMetadata({
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        picture: track.image || null,
      });
      setCurrentTrack(track.audio);
      setCurrentTrackData(track);
      setCurrentIndex(index);
      setIsPlaying(true);
      setPlayingFrom(playlistName);
      setSelectedPlaylist(playlistName);
    }
  };

  const handleNext = () => {
    const list = playingFrom === "jamendo" ? tracks : playlists[playingFrom] || [];
    if (currentIndex < list.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextTrack = list[nextIndex];
      if (nextTrack) {
        if (playingFrom === "jamendo") {
          handleJamendoTrackClick(nextTrack, nextIndex);
        } else {
          handlePlaylistTrackClick(nextTrack, nextIndex, playingFrom);
        }
      }
    }
  };

  const handlePrevious = () => {
    const list = playingFrom === "jamendo" ? tracks : playlists[playingFrom] || [];
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevTrack = list[prevIndex];
      if (prevTrack) {
        if (playingFrom === "jamendo") {
          handleJamendoTrackClick(prevTrack, prevIndex);
        } else {
          handlePlaylistTrackClick(prevTrack, prevIndex, playingFrom);
        }
      }
    }
  };

  const createPlaylist = () => {
    if (newPlaylistName && !playlists[newPlaylistName]) {
      setPlaylists((prev) => ({ ...prev, [newPlaylistName]: [] }));
      setNewPlaylistName("");
    }
  };

  // This is the key fix: add unique id for local files & preserve them properly
  const addToPlaylist = (playlistName, track = null) => {
    const trackToAdd = track || currentTrackData;
    if (!trackToAdd || !playlistName || !playlists[playlistName]) return;

    // If local file, create unique id
    const isLocal = trackToAdd.isLocal;
    const newTrack = {
      ...trackToAdd,
      id: isLocal ? `local-${Date.now()}-${Math.random()}` : trackToAdd.id,
      isLocal,
    };

    // Prevent duplicates by id
    if (playlists[playlistName].some((t) => t.id === newTrack.id)) return;

    setPlaylists((prev) => ({
      ...prev,
      [playlistName]: [...prev[playlistName], newTrack],
    }));

    console.log("playlists :: s", playlists);
  };

  const handlePlaylistClick = (playlistName) => {
    setSelectedPlaylist(playlistName);
  };

  const removeFromPlaylist = (playlistName, trackId) => {
    if (!playlistName || !playlists[playlistName]) return;

    setPlaylists((prev) => ({
      ...prev,
      [playlistName]: prev[playlistName].filter((track) => track.id !== trackId),
    }));
  };

  return (
    <div className="app-layout">

      {/* Mobile toggle buttons */}
      <div className="mobile-controls">
        <button onClick={() => {
          setShowSidebar(!showSidebar);
          setShowTracks(false);
        }}>
          {showSidebar ? "Close Playlists" : "Show Playlists"}
        </button>

        <button onClick={() => {
          setShowTracks(!showTracks);
          setShowSidebar(false);
        }}>
          {showTracks ? "Close Tracks" : "Show Tracks"}
        </button>
      </div>

      {/* Playlist Sidebar */}
      {(showSidebar || window.innerWidth > 600) && (
        <div className={`sidebar ${showSidebar ? 'mobile-visible' : ''}`}>
          <PlaylistSidebar
            playlists={playlists}
            newPlaylistName={newPlaylistName}
            setNewPlaylistName={setNewPlaylistName}
            createPlaylist={createPlaylist}
            addToPlaylist={addToPlaylist}
            handlePlaylistClick={handlePlaylistClick}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            setCurrentTrack={setCurrentTrack}
            setMetadata={setMetadata}
            setIsPlaying={setIsPlaying}
          />
        </div>
      )}

      {/* Music Player */}
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
          onNext={handleNext}
          onPrevious={handlePrevious}
          setTracks={setTracks}
        />
      </div>

      {/* Tracks Panel */}
      {(showTracks || window.innerWidth > 600) && (
        <div className={`tracks ${showTracks ? 'mobile-visible' : ''}`}>
          <Tracks
            jamendoTracks={tracks}
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            onTrackClick={(track, index) => {
              if (selectedPlaylist) {
                handlePlaylistTrackClick(track, index, selectedPlaylist);
              } else {
                handleJamendoTrackClick(track, index);
              }
            }}
            addToPlaylist={addToPlaylist}
            removeFromPlaylist={removeFromPlaylist}
          />
        </div>
      )}
    </div>

  );
};

export default Home;
