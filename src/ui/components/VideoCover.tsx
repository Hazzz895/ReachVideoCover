import classNames from "@/styles.module.scss";
import { Nullable, TrackMeta } from "@/types";
import { useCurrentTrack, usePlayer } from "@pulsesync/addon-sdk";
import { useEffect, useRef, useState } from "react";
import { settings as addonSettings } from "@/settings";
import { settingsToCssVars } from "@/utils/ui-utils";

export default function VideoCover() {
    const currentTrack: Nullable<TrackMeta> = useCurrentTrack();
    const useCurrentVideoSrc = () => currentTrack?.backgroundVideoUri ?? null;
    const playerSnapshot = usePlayer();
    const [videoSrc, setVideoSrc] = useState<Nullable<string>>(useCurrentVideoSrc());
    const videoElement = useRef<Nullable<HTMLVideoElement>>(null);
    const useVideoElement = () => videoElement.current;
    const settings = addonSettings.use()

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

    useEffect(() => {
        const video = useVideoElement();
        
        video?.classList.toggle(classNames.VideoCover_hiddenPoster, settings.playerVisibility === 'cover');
        video?.classList.toggle(classNames.VideoCover_hidden, settings.playerVisibility === 'all');
    }, [settings.playerVisibility])

    function onLoadStart() {
        useVideoElement()?.classList.add(classNames.VideoCover_loading)
    }

    function onCanPlay() {
        useVideoElement()?.classList.remove(classNames.VideoCover_loading)
    }

    const style = settingsToCssVars(settings)

    return <>
        {videoSrc &&
            <video
                className={classNames.VideoCover}
                ref={videoElement}
                src={videoSrc}
                onLoadStart={onLoadStart}
                onCanPlayThrough={onCanPlay}
                style={style}
            />}
    </>
}