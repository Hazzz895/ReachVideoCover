import classNames from "@/styles.module.scss";
import { Nullable, TrackMeta } from "@/types";
import { useCurrentTrack, usePlayer } from "@pulsesync/addon-sdk";
import { useEffect, useRef, useState } from "react";
import { settings as addonSettings } from "@/settings";
import { settingsToCssVars } from "@/utils/ui-utils";

export default function VideoCover() {
    const currentTrack: Nullable<TrackMeta> = useCurrentTrack();
    const playerSnapshot = usePlayer();
    const settings = addonSettings.use();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);

    const videoSrc = currentTrack?.backgroundVideoUri ?? null;
    const isPlaying = !!playerSnapshot?.isPlaying;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play()
        } else {
            video.pause();
        }
    }, [isPlaying, videoSrc]);

    const classes = [
        classNames.VideoCover,
        loading && classNames.VideoCover_loading,
        !isPlaying && classNames.VideoCover_paused,
        settings.playerVisibility === 'cover' && classNames.VideoCover_hiddenPoster,
        settings.playerVisibility === 'all' && classNames.VideoCover_hidden,
    ].filter(Boolean).join(' ');

    if (!videoSrc) return null;

    return (
        <video
            key={videoSrc}
            ref={videoRef}
            className={classes}
            src={videoSrc}
            style={settingsToCssVars(settings)}
            muted
            loop
            playsInline
            preload="auto"
            onLoadStart={() => setLoading(true)}
            onCanPlay={() => setLoading(false)}
            onLoadedData={() => setLoading(false)}
            onError={() => setLoading(false)}
        />
    );
}
