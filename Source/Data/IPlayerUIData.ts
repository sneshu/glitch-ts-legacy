//
// File: IPlayerUIData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IPlayerUIData
{
    life: number;
    maxLives: number;
    score: number;
    gold: number;
    purchasedItems: Map<string, IPurchasedItem>;
}

import { IPurchasedItem } from "./IPurchasedItem";
