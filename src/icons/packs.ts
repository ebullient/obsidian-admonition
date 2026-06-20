export type DownloadableIconPack = "octicons" | "rpg" | "fab" | "fas" | "far";

export const DownloadableIcons: Record<DownloadableIconPack, string> = {
    octicons: "Octicons",
    rpg: "RPG Awesome",
    fab: "Font Awesome Brands",
    fas: "Font Awesome Solid",
    far: "Font Awesome Regular",
} as const;
