//
// File: IMonsterData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IMonsterData extends IMovementData, ICombatData, IAnimationData
{
    type: number;
    scoreValue: number;
    goldValue: number;
    detectRangeSqr: number;
    movementBounds: IBoundsData;
}

import { IAnimationData } from "./IAnimationData";
import { IBoundsData } from "./IBoundsData";
import { ICombatData } from "./ICombatData";
import { IMovementData } from "./IMovementData";