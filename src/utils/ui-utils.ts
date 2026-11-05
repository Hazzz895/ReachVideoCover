import { toKebabCase } from "./common";

export function settingsToCssVars(settings: Record<string, number | string | boolean>) {
    const result: Record<string, string> = {}
    for (let [k,v] of Object.entries(settings)) {
        if (typeof v === "boolean") {
            v = Number(v)
        }

        if (typeof v === "number") {
            v = String(v)
        }

        k = `--${toKebabCase(k)}`;

        result[k] = v;
    }
    return result as React.CSSProperties;
}