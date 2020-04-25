import React, { useEffect, useState, useRef } from "react";

const Participant = ({ participant, localParticipant = false }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = trackMap =>
    Array.from(trackMap.values())
      .map(publication => publication.track)
      .filter(track => track !== null);

  useEffect(
    () => {
      const trackSubscribed = track => {
        if (track.kind === "video") {
          setVideoTracks(videoTracks => [...videoTracks, track]);
        } else {
          setAudioTracks(audioTracks => [...audioTracks, track]);
        }
      };

      const trackUnsubscribed = track => {
        if (track.kind === "video") {
          setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
        } else {
          setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
        }
      };
      setVideoTracks(trackpubsToTracks(participant.videoTracks));
      setAudioTracks(trackpubsToTracks(participant.audioTracks));

      participant.on("trackSubscribed", trackSubscribed);
      participant.on("trackUnsubscribed", trackUnsubscribed);

      return () => {
        setVideoTracks([]);
        setAudioTracks([]);
        participant.removeAllListeners();
      };
    },
    [participant]
  );

  useEffect(
    () => {
      const videoTrack = videoTracks[0];
      if (videoTrack) {
        videoTrack.attach(videoRef.current);
        return () => {
          videoTrack.detach();
        };
      }
    },
    [videoTracks]
  );

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  });

  return (
    <div className="participant">
      <h3>
        {!localParticipant ? participant.identity : <span>Me</span>}
      </h3>
      <video ref={videoRef} autoplay={true} title={participant.identity} />
      <audio ref={audioRef} autoplay={true} muted={false} />
    </div>
  );
};

export default Participant;