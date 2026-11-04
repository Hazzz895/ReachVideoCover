import classNames from "@/styles.module.scss";
import { Nullable, TrackMeta } from "@/types";
import { useCurrentTrack, usePlayer } from "@pulsesync/addon-sdk";
import { useEffect, useRef, useState } from "react";

export default function VideoCover() {
    const currentTrack: Nullable<TrackMeta> = useCurrentTrack();
    const useCurrentVideoSrc = () => currentTrack?.backgroundVideoUri ?? null;
    const playerSnapshot = usePlayer();
    const [videoSrc, setVideoSrc] = useState<Nullable<string>>(useCurrentVideoSrc());
    const videoElement = useRef<Nullable<HTMLVideoElement>>(null);
    const useVideoElement = () => videoElement.current;

    useEffect(() => {
        setVideoSrc(useCurrentVideoSrc())
    }, [currentTrack?.backgroundVideoUri])

    useEffect(() => {
        const video = useVideoElement();

        if (!video) return;

        if (playerSnapshot?.isPlaying) {
            video.play();
            video.classList.remove(classNames.VideoCover_paused)
        }
        else {
            video.pause();
            video.classList.add(classNames.VideoCover_paused)
        }
    }, [playerSnapshot?.isPlaying])

    function onLoadStart() {
        useVideoElement()?.classList.add(classNames.VideoCover_loading)
    }

    function onCanPlay() {
        useVideoElement()?.classList.remove(classNames.VideoCover_loading)
    }

    return <>
        {videoSrc && <video className={classNames.VideoCover} ref={videoElement} src={videoSrc} onLoadStart={onLoadStart} onCanPlayThrough={onCanPlay}/>}
    </>
}