//
// File: AtlasManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class TextureAtlas
{
    static readonly GRID_SIZE: number = 16;
    texture: HTMLImageElement;
    tilesetOffsets: Map<string, IPositionData>;

    constructor(assetLoader: AssetLoader)
    {
        this.texture = new Image();
        this.texture.src = `./Assets/Textures/T_Atlas.png`;
        this.texture.addEventListener(`load`, assetLoader.onAssetLoadBinding);
        this.tilesetOffsets = new Map<string, IPositionData>([
            [ `grass`, { x: 7, y: 0 }],
            [ `dirt`, { x: 10, y: 0 }],
            [ `stone`, { x: 7, y: 2 }],
            [ `shop`, { x: 7, y: 4 }],
            [ `altar`, { x: 10, y: 2 }],
        ]);
    } 
}

import { AssetLoader } from "../Core/AssetLoader";
import { IPositionData } from "../Data/IPositionData";
