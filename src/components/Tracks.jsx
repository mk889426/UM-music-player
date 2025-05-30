const Tracks = ({ jamendoTracks, onTrackClick }) => {
  return (
    <div className="jamendo-panel">
      <h2>Jamendo Songs</h2>
      {jamendoTracks.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {jamendoTracks.map((track) => (
            <li key={track.id} onClick={() => onTrackClick(track)}>
              <p>{track.name}</p>
              <p>{track.artist_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tracks;
