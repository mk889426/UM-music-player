import React, { useEffect, useRef, useState } from "react";
import { CgPlayListAdd } from "react-icons/cg";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { IoMdVolumeHigh, IoMdAdd } from "react-icons/io";
import { parseBlob } from "music-metadata-browser";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const MusicPlayer = ({ currentTrack,
  isPlaying,
  togglePlay,
  setAudioRef,
  metadata,
  setMetadata,
  setIsPlaying,
  setCurrentTrack,
  onNext,
  onPrevious }) => {
  const progressRef = useRef(null);
  const audioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [audioRef.current]);

  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime;
    const dur = e.target.duration;
    setCurrentTime(current);
    setDuration(dur);
    setProgress((current / dur) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const newTime = audioRef.current.duration * clickPercent;

    audioRef.current.currentTime = newTime;
  };



  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCurrentTrack(url);

    try {
      const metadataResult = await parseBlob(file);
      const common = metadataResult.common;

      const pictureData = common.picture?.[0];
      const pictureUrl = pictureData
        ? URL.createObjectURL(new Blob([pictureData.data], { type: pictureData.format }))
        : null;

      setMetadata({
        title: common.title || file.name,
        artist: common.artist || "Unknown Artist",
        album: common.album || "Unknown Album",
        picture: pictureUrl,
      });
    } catch (err) {
      console.error("Metadata parsing error:", err);
      setMetadata({
        title: file.name,
        artist: "Unknown Artist",
        album: "Unknown Album",
        picture: null,
      });
    }

    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };


  return (
    <div
      className="player-root"
      style={{
        backgroundImage:
          metadata?.picture || metadata?.album_image
            ? `url(${metadata.picture || metadata.album_image})`
            : "none",
      }}
    >
      <div className="player-overlay" />
      <div className="player-center">
        <div className="player-card playerSection">
          <div className="cover-art">
            {metadata?.picture || metadata?.album_image ? (
              <img
                src={metadata.picture || metadata.album_image}
                alt="Album Art"
                className="cover-img"
              />
            ) : (
              <div className="cover-placeholder">cover art</div>
            )}
          </div>

          <div className="song-title">
            <p>{metadata?.title}</p>
            <div className="artist">{metadata?.artist} - {metadata?.album}</div>
          </div>

          <div className="progress-row">
            <span className="time-start">{formatTime(currentTime)}</span>

            <div className="progress-bar" ref={progressRef} onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <span className="time-end">{formatTime(duration)}</span>
          </div>


          {/* <div className="progress-bar" ref={progressRef} onClick={handleSeek}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="timestamps">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div> */}

          <div className="control-buttons-box">
            <div className="volume-container">
              <button onClick={() => setShowVolumeSlider(!showVolumeSlider)}>
                <IoMdVolumeHigh />
              </button>
              {showVolumeSlider && (
                <div className="volume-slider">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="vertical-slider"
                  />
                </div>
              )}
            </div>

            <button onClick={onPrevious}><MdSkipPrevious /></button>
            <button onClick={togglePlay}>
              {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
            </button>
            <button onClick={onNext}><MdSkipNext /></button>

            <label className="upload-label">
              <IoMdAdd />
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack}
            onTimeUpdate={handleTimeUpdate}
            autoPlay={isPlaying}
          />
        </div>
      </div>
    </div>


  );
};

export default MusicPlayer;