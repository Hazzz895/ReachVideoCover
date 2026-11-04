import { AddonApi } from "@pulsesync/addon-sdk";

let _api: AddonApi = null!;

export const getApi = () => _api;

export const setApi = (api: AddonApi) => { _api = api; }