//
// File: TileManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class TileManager
{
    private ctx: IGameContext;

    private majorTiles: Array<ITileData>;
    private minorTiles: Array<ITileData>;
    private majorTileCreateCount;
    private minorTileCreateCount;

    private onWindowResizeBinding = this.onWindowResize.bind(this);

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.majorTiles = new Array<ITileData>();
        this.minorTiles = new Array<ITileData>();
        this.majorTileCreateCount = 0;
        this.minorTileCreateCount = 0;

        window.addEventListener(`resize`, this.onWindowResizeBinding);
    }

    getCount(): number
    {
        return this.minorTiles.length + this.majorTiles.length;
    }

    updateTile(t: ITileData): void
    {
        // Update visibility based on camera position
        t.isVisible = !(t.x + t.width < this.ctx.camera.x || t.x > this.ctx.camera.x + this.ctx.canvas.width);
    }

    update(): void 
    {
        // Update and remove invisible objects on the left side of the screen
        this.minorTiles = this.minorTiles.filter(t => 
        {
            this.updateTile(t);
            return !(t.x + t.width < this.ctx.camera.x);
        });

        this.majorTiles = this.majorTiles.filter(t => 
        {
            this.updateTile(t);
            return !(t.x + t.width < this.ctx.camera.x);
        }); 
    }

    getTiles(): Array<ITileData>
    {
        return this.majorTiles.concat(this.minorTiles);
    }

    getMajorTilesCreateCount(): number
    {
        return this.majorTileCreateCount;
    }

    getMinorTilesCreateCount(): number
    {
        return this.minorTileCreateCount;
    }

    getMajorTiles(): Array<ITileData>
    {
        return this.majorTiles;
    }

    getMinorTiles(): Array<ITileData>
    {
        return this.minorTiles;
    }

    addMajorTile(data: Partial<ITileData>): void
    {
        this.add(this.majorTiles, data);
        this.majorTileCreateCount++;
    }

    addMinorTile(data: Partial<ITileData>): void
    {
        this.add(this.minorTiles, data);
        this.minorTileCreateCount++;
    }

    add(targetArray: Array<ITileData>, data: Partial<ITileData>): void
    {
        const type = data.type ?? `grass`;
        const x = data.x ?? 0;
        const y = data.y ?? 0;
        const width = (data.width ?? 1) * WorldManager.GRID_SIZE;
        const height = (data.height ?? (this.ctx.canvas.height - y)) * WorldManager.GRID_SIZE;
        const isPlatform = data.isPlatform ?? false;
        
        const tilesetOffset = this.ctx.atlas.tilesetOffsets.get(type);
        const tilesetOffsetX = tilesetOffset?.x ?? 0;
        const tilesetOffsetY = tilesetOffset?.y ?? 0;

        const t = { type, x, y, width, height, tilesetOffsetX, tilesetOffsetY, color: `white`, heightExtend: 0, hitboxOffsetY: 0, isPlatform } as ITileData;

        switch(data.type)
        {
            case `grass`:
            case `dirt`:
            case `stone`:
            {
                t.isObstacle = true;
                t.heightExtend = 32;
                t.hitboxOffsetY = 12;
                break;
            }
            // Tiles without collision
            case `shop`:
            {
                t.isObstacle = true;
                t.isStatic = true;
                break;
            }
            // Single-block islands
            case `altar`:
            {
                t.hitboxOffsetY = 12;
                t.isObstacle = true;
                t.isOneBlock = true;
                t.isStatic = true;
                break;
            }
        }

        targetArray.push(t);
    }

    drawTile(t: ITileData): void
    {
        if (!t.isVisible) return;

        const totalHeight = t.height + t.heightExtend;

        // Top left tile
        this.ctx.canvas.drawImage(t.x, t.y, t.tilesetOffsetX, t.tilesetOffsetY); 

        // If its one block, skip the rest
        if (!t.isOneBlock)
        {
            // Top right tile
            this.ctx.canvas.drawImage(t.x + t.width - WorldManager.GRID_SIZE, t.y, t.tilesetOffsetX + 2, t.tilesetOffsetY);
            // Top tile
            this.ctx.canvas.drawRepeatingImage(t.x + WorldManager.GRID_SIZE, t.y, t.tilesetOffsetX + 1, t.tilesetOffsetY, t.width - 2 * WorldManager.GRID_SIZE, WorldManager.GRID_SIZE);
            
            if (totalHeight > WorldManager.GRID_SIZE)
            {
                // Left tile
                this.ctx.canvas.drawRepeatingImage(t.x, t.y + WorldManager.GRID_SIZE, t.tilesetOffsetX, t.tilesetOffsetY + 1, WorldManager.GRID_SIZE, totalHeight - WorldManager.GRID_SIZE);
                // Right tile
                this.ctx.canvas.drawRepeatingImage(t.x + t.width - WorldManager.GRID_SIZE, t.y + WorldManager.GRID_SIZE, t.tilesetOffsetX + 2, t.tilesetOffsetY + 1, WorldManager.GRID_SIZE, totalHeight - WorldManager.GRID_SIZE);
                // Middle tile
                this.ctx.canvas.drawRepeatingImage(t.x + WorldManager.GRID_SIZE, t.y + WorldManager.GRID_SIZE, t.tilesetOffsetX + 1, t.tilesetOffsetY + 1, t.width - 2 * WorldManager.GRID_SIZE, totalHeight - WorldManager.GRID_SIZE);
            }
        }

        if (this.ctx.debug.isEnabled())
        {
            this.ctx.canvas.drawRect(t.x - 1, t.y + t.hitboxOffsetY - 1, t.width + 3, totalHeight + 3, t.color);
        }
    }

    draw(): void 
    {
        for (let i = 0; i < this.minorTiles.length; i++)
        {
            this.drawTile(this.minorTiles[i]);
        }

        for (let i = 0; i < this.majorTiles.length; i++)
        {
            this.drawTile(this.majorTiles[i]);
        }
    }

    repositionTile(t: ITileData)
    {
        if (t.isStatic == true) return;

        t.height = this.ctx.canvas.height - t.y - this.ctx.camera.y;
    }

    onWindowResize(): void
    {
        for (let i = 0; i < this.minorTiles.length; i++)
        {
            this.repositionTile(this.minorTiles[i]);
        }

        for (let i = 0; i < this.majorTiles.length; i++)
        {
            this.repositionTile(this.majorTiles[i]);
        }
    }
}

import { IGameContext } from "../Data/IGameContext";
import { ITileData } from "../Data/ITileData"
import { WorldManager } from "./WorldManager";
