import { PulseSyncTrackMeta } from "@pulsesync/yamusic-types";

export type TrackMeta = PulseSyncTrackMeta & {
    backgroundVideoUri?: string
}

export type Nullable<T> = T | null