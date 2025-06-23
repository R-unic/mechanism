import Signal from "@rbxts/lemon-signal";

import { BaseAction } from "./base-action";
import { getInputEnum, type RawInput } from "./common";

export abstract class BaseStandardAction extends BaseAction {
  public readonly activated = this.trash.add(new Signal);
  public readonly deactivated = this.trash.add(new Signal);
  public readonly isActive: boolean = false;

  protected activate(this: Writable<BaseStandardAction>): void {
    this.isActive = true;
    this.activated.Fire();
  }

  protected deactivate(this: Writable<BaseStandardAction>): void {
    this.isActive = false;
    this.deactivated.Fire();
  }
}

export abstract class StandardAction extends BaseStandardAction {
  public readonly rawInputs: RawInput[];
  public readonly inputQueueing: boolean = false;
  public readonly cooldown: number = 0;

  private lastPress = 0;
  private lastRelease = 0;
  private queuedPresses = 0;
  private queuedReleases = 0;

  public constructor(...rawInputs: RawInput[]) {
    super();
    this.rawInputs = rawInputs;
  }

  /** @hidden */
  public handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.processed !== processed) return;
    if (!this.supportsInput(input)) return;

    const coolingDown = this.cooldown > 0 && os.clock() - this[isPress ? "lastPress" : "lastRelease"] < this.cooldown;
    if (coolingDown) {
      if (this.inputQueueing) {
        const delay = this.cooldown * ++this[isPress ? "queuedPresses" : "queuedReleases"];
        task.delay(delay, () => {
          this.handleInput(input, processed, isPress);
          this[isPress ? "queuedPresses" : "queuedReleases"]--;
        });
      }

      return;
    }

    if (isPress)
      this.lastRelease = 0;

    this[isPress ? "lastPress" : "lastRelease"] = os.clock();
    isPress ? this.activate() : this.deactivate();
  }

  protected supportsInput(input: InputObject): boolean {
    return this.rawInputs.some(rawInput => this.rawInputMatches(rawInput, input));
  }

  protected rawInputMatches(rawInput: RawInput, input: InputObject): boolean {
    const inputEnum = getInputEnum(rawInput);
    return input.KeyCode === inputEnum || input.UserInputType === inputEnum;
  }
}

export class StandardActionBuilder extends StandardAction {
  /** Sets the ID of the action */
  public setID(this: Writable<StandardActionBuilder>, id: string | number): StandardActionBuilder {
    this.id = id;
    return <StandardActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<StandardActionBuilder>, processed: boolean): StandardActionBuilder {
    this.processed = processed;
    return <StandardActionBuilder>this;
  }

  /** Sets whether inputs pressed while cooldown is active are queued to be activated when the cooldown is over */
  public setInputQueueing(this: Writable<StandardActionBuilder>, inputQueueing: boolean): StandardActionBuilder {
    this.inputQueueing = inputQueueing;
    return <StandardActionBuilder>this;
  }

  /** Sets a time to wait between each activation of the action */
  public setCooldown(this: Writable<StandardActionBuilder>, cooldown: number): StandardActionBuilder {
    this.cooldown = cooldown;
    return <StandardActionBuilder>this;
  }
}