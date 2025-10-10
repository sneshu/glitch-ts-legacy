//
// File: IPurchasedItem.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IPurchasedItem
{
    data: IArtifactData;
    quantity: number;
}

import { IArtifactData } from "./IArtifactData";