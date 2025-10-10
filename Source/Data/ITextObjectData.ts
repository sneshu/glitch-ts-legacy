//
// File: ITextObjectData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface ITextObjectData
{
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    color: string;
    textSize: number;
    align: CanvasTextAlign;
}