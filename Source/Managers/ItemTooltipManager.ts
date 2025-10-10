//
// File: ItemTooltipManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class ItemTooltipManager
{
    private ctx: IGameContext; 
    private messageBox: IMessageBoxData;
    private isVisible: boolean;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.isVisible = false;
        this.messageBox = { backgroundColor: `rgba(0, 0, 0, 0.5)`} as IMessageBoxData;
    }

    show(data: Partial<IMessageBoxData>): void
    {
        this.isVisible = true;

        // Don't re-create object every frame
        const id = data.id ?? ``;
        if (this.messageBox.id == id) return;

        // Update message box data
        this.messageBox.id = id;
        this.messageBox.x = data.x ?? 0;
        this.messageBox.y = data.y ?? 0;
        this.messageBox.lines = data.lines ?? [];
        this.messageBox.textSize = data.textSize ?? 16;
        this.ctx.messageBoxes.recalculateBounds(this.messageBox);
    } 

    hide(): void
    {
        this.messageBox.id = ``;
        this.isVisible = false;
    }

    draw(): void
    {
        if (!this.messageBox || this.isVisible == false) return; 
        this.ctx.messageBoxes.drawSingle(this.messageBox);
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IMessageBoxData } from "../Data/IMessageBoxData";