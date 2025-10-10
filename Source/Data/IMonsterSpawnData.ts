//
// File: IMonsterSpawnData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IMonsterSpawnData
{
    type: number;
    spawnX: number;
    spawnY: number;
    movementBounds: IBoundsData;
}

import { IBoundsData } from "./IBoundsData";