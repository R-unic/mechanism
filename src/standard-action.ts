import Signal from "@rbxts/lemon-signal";

import { BaseAction } from "./base-action";

export abstract class StandardAction extends BaseAction {
  public readonly activated = new Signal;
  public readonly deactivated = new Signal;
  public readonly isActive: boolean = false;
  public readonly keyCodes: Enum.KeyCode[] = [];
  public readonly composite: boolean = false;
  public readonly inputQueueing: boolean = false;
  public readonly consecutivePresses: number = 1;
  public readonly consecutivePressInterval: number = 0;
  public readonly cooldown: number = 0;

  /** @hidden */
  public activate(this: Writable<StandardAction>): void {
    this.isActive = true;
    this.activated.Fire();
  }

  /** @hidden */
  public deactivate(this: Writable<StandardAction>): void {
    this.isActive = false;
    this.deactivated.Fire();
  }
}

export class StandardActionBuilder extends StandardAction {
  /** Sets the ID of the action */
  public setID(this: Writable<StandardActionBuilder>, id: string | number): StandardActionBuilder {
    this.id = id;
    return this;
  }

  /** Adds the keycodes that activate the action */
  public addKeyCodes(...keyCodes: Enum.KeyCode[]): StandardActionBuilder {
    for (const keyCode of keyCodes)
      this.keyCodes.push(keyCode);

    return this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<StandardActionBuilder>, processed: boolean): StandardActionBuilder {
    this.processed = processed;
    return this;
  }

  /** Sets how much time it takes for consecutive presses to be reset back to 0 after receiving no inputs */
  public setConsecutivePressInterval(this: Writable<StandardActionBuilder>, consecutivePressInterval: number): StandardActionBuilder {
    this.consecutivePressInterval = consecutivePressInterval;
    return this;
  }

  /** Sets how many consecutive presses activate the action */
  public setConsecutivePresses(this: Writable<StandardActionBuilder>, consecutivePresses: number): StandardActionBuilder {
    this.consecutivePresses = consecutivePresses;
    return this;
  }

  /** Sets whether inputs pressed while cooldown is active are queued to be activated when the cooldown is over */
  public setInputQueueing(this: Writable<StandardActionBuilder>, inputQueueing: boolean): StandardActionBuilder {
    this.inputQueueing = inputQueueing;
    return this;
  }

  /** Sets a time to wait between each activation of the action */
  public setCooldown(this: Writable<StandardActionBuilder>, cooldown: number): StandardActionBuilder {
    this.cooldown = cooldown;
    return this;
  }

  /** Sets whether all of the keys must be pressed to activate the action */
  public setComposite(this: Writable<StandardActionBuilder>, composite: boolean): StandardActionBuilder {
    this.composite = composite;
    return this;
  }
}