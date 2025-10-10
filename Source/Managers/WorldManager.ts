//
// File: WorldManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class WorldManager
{
    static readonly GRID_SIZE: number = 48;
    static readonly GRAVITY_FORCE = 9.8 * 8.0 * WorldManager.GRID_SIZE;

    private ctx: IGameContext;

    private minorTileGeneratePosXThreshold: number;
    private majorTileGeneratePosXThreshold: number;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.minorTileGeneratePosXThreshold = 0;
        this.majorTileGeneratePosXThreshold = 0;
    }

    private generateMajorTiles(): void
    {
        for (;this.ctx.camera.x + this.ctx.canvas.width > this.majorTileGeneratePosXThreshold;)
        {
            const type = `grass`;
            const x = this.majorTileGeneratePosXThreshold;
            const y = Utils.randomInt(10, 13) * WorldManager.GRID_SIZE;  
            const widthTiles = Utils.randomInt(20, 30);
            const gapTiles = Utils.randomInt(3, 5);
            
            this.majorTileGeneratePosXThreshold += (widthTiles + gapTiles) * WorldManager.GRID_SIZE;
            this.ctx.tiles.addMajorTile({ type, x, y, width: widthTiles });

            const majorTileCount = this.ctx.tiles.getMajorTilesCreateCount()

            // Add score for travelled distance
            if (majorTileCount > 2)
            {
                this.ctx.player.addScore(1, false);
            }

            // 60% chance for monsters; 40% chance for gold
            if (majorTileCount > 1 && Utils.randomInt(0, 9) > 3)
            {
                this.spawnMonsters(x, y, widthTiles, false);
            }

            else if (majorTileCount > 1)
            {
                this.spawnGold(x, y, widthTiles);
            }
        }
    }

    private generateMinorTiles(): void 
    {
        for (;this.ctx.camera.x + this.ctx.canvas.width > this.minorTileGeneratePosXThreshold;)
        {
            // Every 10th minor island is a shop
            const isShop = (this.ctx.tiles.getMinorTilesCreateCount() % 10 == 9);
            const type = isShop ? `stone` : [`grass`, `dirt`][Utils.randomInt(0, 1)];
            const x = this.minorTileGeneratePosXThreshold;
            const y = Utils.randomInt(6, 8) * WorldManager.GRID_SIZE;  
            const widthTiles = Utils.randomInt(6, 12);
            const gapTiles = Utils.randomInt(4, 12);

            this.minorTileGeneratePosXThreshold += (widthTiles + gapTiles) * WorldManager.GRID_SIZE;
            this.ctx.tiles.addMinorTile({ type, x, y, width: widthTiles, isPlatform: true });

            const minorTileCount = this.ctx.tiles.getMinorTilesCreateCount();

            if (isShop)
            {
                const shopWidth = 3;
                const shopHeight = 2;
                const shopX = x + (widthTiles - shopWidth) * WorldManager.GRID_SIZE * 0.5;
                const shopY = y + 3;
                this.spawnShop(shopX, shopY, shopWidth, shopHeight);
            }

            // 33% chance for monsters; 66% for gold
            else if (minorTileCount > 5 && Utils.randomInt(0, 2) == 0)
            {
                this.spawnMonsters(x, y, widthTiles, true);
            }

            else
            {
                this.spawnGold(x, y, widthTiles);
            }
        }
    }

    private spawnShop(x: number, y: number, width: number, height: number): void
    {
        const isDiscount = (Utils.randomInt(1, 2) == 1);

        // Shop banner
        this.ctx.tiles.addMinorTile({ x: x, y: y - height * WorldManager.GRID_SIZE, width, height, type: `shop`, isPlatform: true });
        this.ctx.floatingTexts.add({ x: x + width * WorldManager.GRID_SIZE * 0.5 + (isDiscount ? -20 : 0), y: y - 66, content: `SHOP`, textSize: 32 });

        // Discount 
        const priceMultiplier = isDiscount ? Utils.randomInt(1, 3) == 1 ? 0.75 : 0.5 : 1;
        if (isDiscount == true)
        {
            this.ctx.floatingTexts.add({ x: x + width * WorldManager.GRID_SIZE - 32, y: y - 62, color: `rgb(75, 255, 75)`, content: `-${Math.floor((1 - priceMultiplier) * 100)}%`, textSize: 24 });
        }

        // Create items
        for (let i = -2; i <= 1; i++)
        {
            const shopItemX = x + width * WorldManager.GRID_SIZE * 0.5 + i * WorldManager.GRID_SIZE * 1.25;
            const shopItemY = y - 24;

            // Create altar under item
            this.ctx.tiles.addMinorTile({ x: shopItemX, y: shopItemY, width: 1, height: 1, type: `altar`, isPlatform: true });

            // Add shop item object; 1st item is always guaranteed to be a health potion
            const artifact = (i == -2 ? this.ctx.shopItems.getArtifact(`Health Potion`) : this.ctx.shopItems.getRandomArtifact());
            if (!artifact) continue;

            this.ctx.shopItems.addItemToShop({ artifact, x: shopItemX, y: shopItemY - WorldManager.GRID_SIZE * 0.75, priceMultiplier });
        }      
    }

    private spawnGold(tileX: number, tileY: number, widthTiles: number): void
    {
        const baseGoldCount = 3 + Utils.randomInt(0, Math.floor(widthTiles * 0.5));
        const rowCount = Utils.randomInt(1, 3);
        const startX = Math.floor((widthTiles - baseGoldCount + 1) * 0.5) + 0.5;            

        for (let y = -1; y > -rowCount; y--)
        {
            for (let x = startX; x < startX + baseGoldCount + y; x++)
            {
                const type = this.ctx.gold.getRandomGoldType();
                const offsetX = (-y * 0.5 - 0.5) * WorldManager.GRID_SIZE;
                const spawnX = tileX + x * WorldManager.GRID_SIZE + offsetX;
                const spawnY = tileY + (y * 0.5) * WorldManager.GRID_SIZE;
                this.ctx.gold.add({ type, spawnX, spawnY, animationOffset: x + y });
            }
        }
    }

    private spawnMonsters(tileX: number, tileY: number, widthTiles: number, isMinor: boolean): void
    {
        const height = 200;
        const offsetY = 12;
        const width = widthTiles * WorldManager.GRID_SIZE;
        const movementBounds = { x: tileX, y: tileY - height + offsetY, width, height } as IBoundsData;
        const spawnY = tileY - WorldManager.GRID_SIZE * 0.75;

        const majorTilesCount = this.ctx.tiles.getMajorTilesCreateCount()
        const minMonsterCount = 1 + Math.floor(majorTilesCount / 6);   
        let monsterCount = Utils.randomInt(minMonsterCount, minMonsterCount + Math.floor(majorTilesCount / 5));

        // Spawn less monsters on minor tiles
        if (isMinor == true)
        {
            monsterCount /= 2;
        }

        for (let i = 0; i < Math.ceil(monsterCount); i++)
        {
            // Get monster type based on difficulty scaling
            const type = this.ctx.monsters.getRandomMonsterType(majorTilesCount);
            const spawnX = Utils.randomInt(tileX, tileX + width);
            // Create tutorial message box on how to kill first monster
            if (this.ctx.monsters.getTotalCount() == 0)
            {
                this.ctx.messageBoxes.add({ 
                    x: spawnX, 
                    y: spawnY - 200, 
                    lines: 
                    [
                        { content: `Jump on monster to kill it!`, color: `white` }, 
                        { content: `Hold 'S' when falling to`, color: `white` },
                        { content: `skip platforms in the way!`, color: `gold` }
                    ]
                });
            }

            this.ctx.monsters.add({ type, movementBounds, spawnX, spawnY });
        }
    }

    generate()
    {
        this.generateMinorTiles();
        this.generateMajorTiles();
    }
}

import { Utils } from "../Core/Utils";
import { IBoundsData } from "../Data/IBoundsData";
import { IGameContext } from "../Data/IGameContext";