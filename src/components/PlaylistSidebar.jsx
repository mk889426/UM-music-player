import React from "react";

const PlaylistSidebar = ({
  playlists = {},
  newPlaylistName,
  setNewPlaylistName,
  createPlaylist,
  addToPlaylist,
  handlePlaylistClick,
  selectedPlaylist,
  setSelectedPlaylist,
  setCurrentTrack,
  setMetadata,
  setIsPlaying,
}) => {

  console.log("playlists in playlist sidebr ::",playlists)
  return (
    <div className="sidebar">
      <h2 className="sidebar-heading">Playlists</h2>

      <div className="playlist-creator">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New Playlist Name"
          className="playlist-input"
        />
        <button onClick={createPlaylist} className="create-button">
          ➕ Create Playlist
        </button>
      </div>

      {selectedPlaylist && (
        <button onClick={() => setSelectedPlaylist(null)} className="back-button">
           All Songs
        </button>
      )}

      <ul className="playlist-list">
        {Object.entries(playlists).map(([name, tracks]) => (
          <li
            key={name}
            className={`playlist-item ${selectedPlaylist === name ? "active" : ""}`}
            onClick={() => handlePlaylistClick(name)}
          >
            🎶 {name} ({tracks.length})
          </li>
        ))}
      </ul>

      {selectedPlaylist && (
        <button className="add-button" onClick={() => addToPlaylist(selectedPlaylist)}>
          + Add Current
        </button>
      )}
    </div>

  );
};

export default PlaylistSidebar;
