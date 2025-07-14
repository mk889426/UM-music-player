import React, { useState } from "react";

const Tracks = ({ jamendoTracks, onTrackClick, playlists, selectedPlaylist, addToPlaylist, removeFromPlaylist }) => {
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [selectedMenuTrack, setSelectedMenuTrack] = useState(null);

  const handleMenuClick = (index, track) => {
    setShowMenuIndex(index === showMenuIndex ? null : index);
    setSelectedMenuTrack(track);
  };

  const handleAddToPlaylist = (playlistName) => {
    if (selectedMenuTrack) {
      addToPlaylist(playlistName, selectedMenuTrack);
      setShowMenuIndex(null);
      setSelectedMenuTrack(null);
    }
  };

  const tracksToDisplay = selectedPlaylist ? playlists[selectedPlaylist] || [] : jamendoTracks;

  return (
    <div className="tracks-panel">
      <h2>{selectedPlaylist ? `${selectedPlaylist} Songs` : "All Songs"}</h2>
      {tracksToDisplay.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tracksToDisplay.map((track, index) => (
            <li key={track.id || index} onClick={() => onTrackClick(track, index)}>
              <div className="track-header">
                <p className="track-title">
                  {track.name || track.title || "Untitled"}
                </p>
                <button
                  className="menu-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(index, track);
                  }}
                >
                  ⋮
                </button>
              </div>
              <p className="track-artist">
                {track.artist_name || track.artist || "Unknown Artist"}
              </p>

              {showMenuIndex === index && (
                <div className="track-menu">
                  {Object.keys(playlists).map((playlistName) => (
                    <div
                      key={playlistName}
                      className="track-menu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlaylist(playlistName);
                      }}
                    >
                      Add to {playlistName}
                    </div>
                  ))}

                  {selectedPlaylist && (
                    <div
                      className="track-menu-item remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromPlaylist(selectedPlaylist, track.id);
                        setShowMenuIndex(null);
                        setSelectedMenuTrack(null);
                      }}
                    >
                      Remove from {selectedPlaylist}
                    </div>
                  )}
                </div>
              )}
            </li>

          ))}
        </ul>
      )}
    </div>

  );
};

export default Tracks;
