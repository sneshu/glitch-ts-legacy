//
// File: InputManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class InputManager
{
    mousePositionX: number;
    mousePositionY: number;
    isMouseDown: boolean;
    private keyDown: Map<string, boolean>;
    private keyPressed: Map<string, boolean>;
    private keyWasDownLastFrame: Map<string, boolean>;

    constructor() 
    {
        this.mousePositionX = 0;
        this.mousePositionY = 0;
        this.isMouseDown = false;
        this.keyDown = new Map<string, boolean>;
        this.keyPressed = new Map<string, boolean>;
        this.keyWasDownLastFrame = new Map<string, boolean>;

        window.addEventListener(`keydown`, (e) => this.onKeyDown(e.key.toLowerCase())); 
        window.addEventListener(`keyup`, (e) => this.onKeyUp(e.key.toLowerCase()));
        window.addEventListener(`mousemove`, (e) => { this.mousePositionX = e.clientX; this.mousePositionY = e.clientY });
        window.addEventListener(`mousedown`, (e) => this.isMouseDown = true);
        window.addEventListener(`mouseup`, (e) => this.isMouseDown = false);
    }

    onKeyDown(key: string): void
    {
        this.keyDown.set(key, true);
        this.keyPressed.set(key, true);
    }

    onKeyUp(key: string): void
    {
        this.keyDown.set(key, false);
        this.keyPressed.set(key, false);
        this.keyWasDownLastFrame.set(key, false);
    }

    isKeyDown(key: string): boolean
    {
        return this.keyDown.get(key) ?? false;
    }

    wasKeyPressedThisFrame(key: string): boolean
    {
        return this.keyPressed.get(key) ?? false;
    }

    update(): void 
    {
        for (const [key, isDown] of this.keyDown)
        {
            const wasDown = this.keyWasDownLastFrame.get(key) ?? false;
            this.keyPressed.set(key, isDown && !wasDown); 
            this.keyWasDownLastFrame.set(key, isDown);
        }   
    }
}