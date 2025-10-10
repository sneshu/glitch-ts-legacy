//
// File: IMessageBoxData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IMessageBoxData
{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    lines: Array<ITextLineData>;
    textSize: number;
    backgroundColor: string;
}

import { ITextLineData } from "./ITextLineData";