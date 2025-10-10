//
// File: ITileData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface ITileData
{
    x: number;
    y: number;
    tilesetOffsetX: number;
    tilesetOffsetY: number;
    hitboxOffsetY: number;
    width: number;
    height: number;
    heightExtend: number;   // Draw additional tiles underneath the island
    type: string;
    color: string;

    isVisible: boolean;    
    isPlatform: boolean;    // Player can drop down from it
    isOneBlock: boolean;    // Draw only one tile (top left corner)
    isStatic: boolean;      // If true, skips re-positioning when changing canvas size
    isObstacle: boolean;    // If true, player collides with it
}