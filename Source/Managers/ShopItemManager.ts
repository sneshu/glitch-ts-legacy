//
// File: ShopItemManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class ShopItemManager
{   
    private ctx: IGameContext;
    private shopItems: Array<IShopItemData>;
    private itemDatabase: Map<string, IArtifactData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.shopItems = new Array<IShopItemData>();
        this.itemDatabase = new Map<string, IArtifactData>();

        this.loadItems();
    }

    getCount(): number
    {
        return this.shopItems.length;
    }

    addItemToShop(descriptor: Partial<IShopItemData>): void
    {
        if (typeof(descriptor.artifact) === `undefined`) return;

        const i = {} as IShopItemData;

        i.artifact = descriptor.artifact;
        i.x = descriptor.x ?? 0;
        i.y = descriptor.y ?? 0;
        i.width = WorldManager.GRID_SIZE;
        i.height = WorldManager.GRID_SIZE;
        i.offsetX = 20;
        i.offsetY = 20;
        i.hitboxWidth = 8;
        i.hitboxHeight = 8;
        i.animationOffset = this.shopItems.length;
        i.priceMultiplier = descriptor.priceMultiplier ?? 1.0;

        this.shopItems.push(i);
    }

    addItemToDatabase(data: IArtifactData): void
    {
        this.itemDatabase.set(data.id, data);
    }

    loadItems(): void
    {
        const indicatorColor = `rgb(250, 75, 75)`;
        const items: Array<IArtifactData> =
        [
            { 
                id: `Health Potion`, 
                spriteX: 6,
                spriteY: 4,
                description: [`Increases max life by 2`, `Regenerates life by 5`],
                price: 100,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+2 max life`, color: indicatorColor });
                    this.ctx.player.maxLives += 2;
                    this.ctx.player.regenerateLife(5);
                }
            },
            {
                id: `Life Stealer`,
                spriteX: 6,
                spriteY: 0,
                description: [`On kill regenerate 2 life`],
                price: 450,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+1 Life Stealer`, color: indicatorColor });
                    this.ctx.player.lifeStealer += 1;
                }
            },
            {
                id: `Sword Upgrade`, 
                spriteX: 1,
                spriteY: 0,
                description: [`Increased attack damage by 2`],
                price: 200,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+2 attack damage`, color: indicatorColor });
                    this.ctx.player.attackDamage += 2;
                }
            },
            {
                id: `Hermes Boots`, 
                spriteX: 2,
                spriteY: 4,
                description: [`Increased movement speed by 10%`],
                price: 200,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+10% movement speed`, color: indicatorColor });
                    this.ctx.player.maxSpeedX += 0.9 * WorldManager.GRID_SIZE;
                }
            },
            {
                id: `Gambler's Fate`, 
                spriteX: 3,
                spriteY: 4,
                description: [`Don't take any damage,`, `(1 / [10 + 5 * amount]) chance to die on hit`],
                price: 300,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+Gambler's Fate`, color: indicatorColor });
                    this.ctx.player.gamblersFate += 1;
                }
            },
            {
                id: `Midas Sword`, 
                spriteX: 5,
                spriteY: 0,
                description: [`Increases attack damage by 5`, `Only if your gold > your score`],
                price: 300,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+Midas Sword`, color: indicatorColor });
                    this.ctx.player.midasSword += 1;
                }
            },
            {
                id: `Stone Block`, 
                spriteX: 4,
                spriteY: 4,
                description: [`Increases gravity pull by 20%`, `Stronger pull = faster attacks!`],
                price: 400,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+20% gravity pull`, color: indicatorColor });
                    this.ctx.player.gravityPull += 0.2;
                }
            },
            {
                id: `Bouncy Ball`, 
                spriteX: 5,
                spriteY: 4,
                description: [`Increases max jumps by 1`],
                price: 400,
                purchaseCallback: () =>
                {
                    this.ctx.indicators.add({ x: this.ctx.player.x, y: this.ctx.player.y, content: `+1 max jumps`, color: indicatorColor });
                    this.ctx.player.maxJumps += 1;
                }
            }
        ]

        items.forEach(item => this.addItemToDatabase(item));
    }

    update(): void
    {
        // Prevents from hiding the death screen tooltip
        if (!this.ctx.player.isAlive) return;

        let isPlayerTouchingItem = false;
        this.shopItems = this.shopItems.filter(i => 
        {
            if (Utils.collision(i.x + i.offsetX, i.y + i.offsetY, i.hitboxWidth, i.hitboxWidth, this.ctx.player.x, this.ctx.player.y, this.ctx.player.width, this.ctx.player.height))
            {
                isPlayerTouchingItem = true;

                const price = Math.floor(i.artifact.price * i.priceMultiplier );
                const canPurchase = (this.ctx.player.gold >= price)
                const priceColor = canPurchase ? `rgb(250, 200, 0)` : `rgb(250, 75, 75)`;
                const lines = [ { content: i.artifact.id, color: `white` } ]

                // Add description lines from item data
                for (let j = 0; j < i.artifact.description.length; j++)
                {
                    lines.push({ content: i.artifact.description[j], color: `white` });
                }

                lines.push({ content: `Price: ${price}g`, color: priceColor });
                lines.push({ content: ``, color: `white` });
                lines.push({ content: `Press [E] to buy it`, color: `gold`});

                this.ctx.tooltip.show({ id: i.artifact.id, x: i.x, y: i.y - 150, lines, textSize: 16 });

                // Item purchase
                if (this.ctx.input.wasKeyPressedThisFrame(`e`) && canPurchase)
                {
                    this.ctx.player.gold -= price;
                    i.artifact.purchaseCallback(this.ctx.player);

                    // Add to list of purchased items
                    const purchasedItem = this.ctx.player.purchasedItems.get(i.artifact.id);

                    if (purchasedItem)
                    {
                        purchasedItem.quantity++;
                        
                    }

                    else
                    {
                        this.ctx.player.purchasedItems.set(i.artifact.id, { data: i.artifact, quantity: 1 } as IPurchasedItem)
                    }

                    this.ctx.effects.trigger(`gold-pick-up`, { x: i.x, y: i.y });   
                    this.ctx.tooltip.hide(); 
                    return false;
                }
            }

            return !(i.x + i.width < this.ctx.camera.x);
        });

        if (!isPlayerTouchingItem)
        {
            this.ctx.tooltip.hide();
        }
    }

    getRandomArtifact(): IArtifactData
    {
        const values = Array.from(this.itemDatabase.values());
        return values[Utils.randomInt(0, values.length - 1)];
    }

    getArtifact(id: string): IArtifactData | undefined
    {
        return this.itemDatabase.get(id);
    }

    draw(time: IGameTime): void
    {
        for (let i = 0; i < this.shopItems.length; i++)
        {
            const item = this.shopItems[i];
            // Item "jumping"
            const frequency = 5;
            const amplitude = 5;
            const animationOffsetY = Math.floor(amplitude * Math.sin((item.animationOffset * 0.5 + time.runTime) * frequency) * 0.5) * 2;
            this.ctx.canvas.drawImage(item.x, item.y + animationOffsetY, item.artifact.spriteX, item.artifact.spriteY);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(item.x + item.offsetX, item.y + item.offsetY, item.hitboxWidth, item.hitboxHeight, `rgb(255, 255, 0)`);
            }
        }
    }    
}

import { IArtifactData } from "../Data/IArtifactData";
import { IGameTime } from "../Data/IGameTime";
import { IShopItemData } from "../Data/IShopItemData";
import { Utils } from "../Core/Utils";
import { WorldManager } from "./WorldManager";
import { IGameContext } from "../Data/IGameContext";
import { IPurchasedItem } from "../Data/IPurchasedItem";

