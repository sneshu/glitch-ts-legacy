//
// File: AssetLoader.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class AssetLoader
{
    public isAppReady: boolean;
    public loadedAssetsCount: number;
    public onAssetLoadBinding = this.onAssetLoad.bind(this);

    constructor()
    {
        this.isAppReady = false;
        this.loadedAssetsCount = 0;
    }

    onAssetLoad(): void
    {
        this.loadedAssetsCount++;
        this.isAppReady = (this.loadedAssetsCount > 0);
    }
}