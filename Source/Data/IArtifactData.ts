//
// File: IArtifactData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IArtifactData
{
    id: string;
    spriteX: number;
    spriteY: number;
    description: Array<string>;
    price: number;
    purchaseCallback: Function;
}