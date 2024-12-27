import { StandardAction } from "./standard-action";

export abstract class RepeatAction extends StandardAction {
  public readonly repeats: number = 2;
  public readonly timing: number = 0.3;

  private repeatCount = 0;
  private lastTap = 0;

  public override handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.processed !== processed) return;
    if (!this.keyCodes.includes(input.KeyCode)) return;

    if (isPress) {
      if (os.clock() - this.lastTap < this.timing)
        this.repeatCount++
      else
        this.repeatCount = 1;

      if (this.repeatCount >= this.repeats)
        super.handleInput(input, processed, isPress);

      this.lastTap = os.clock();
      return;
    }

    if (!this.isActive) return;
    super.handleInput(input, processed, isPress);
  }
}

export class RepeatActionBuilder extends RepeatAction {
  /** Sets the ID of the action */
  public setID(this: Writable<RepeatActionBuilder>, id: string | number): RepeatActionBuilder {
    this.id = id;
    return <RepeatActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<RepeatActionBuilder>, processed: boolean): RepeatActionBuilder {
    this.processed = processed;
    return <RepeatActionBuilder>this;
  }

  /** Adds the keycodes that activate the action */
  public addKeyCodes(...keyCodes: Enum.KeyCode[]): RepeatActionBuilder {
    for (const keyCode of keyCodes)
      this.keyCodes.push(keyCode);

    return this;
  }

  /** Sets a time to wait between each activation of the action */
  public setCooldown(this: Writable<RepeatActionBuilder>, cooldown: number): RepeatActionBuilder {
    this.cooldown = cooldown;
    return <RepeatActionBuilder>this;
  }

  /** Sets the amount of times the input needs to be repeated to activate the action */
  public setRepeats(this: Writable<RepeatActionBuilder>, repeats: number): RepeatActionBuilder {
    this.repeats = repeats;
    return <RepeatActionBuilder>this;
  }

  /** Sets the maximum time in between repeated inputs */
  public setTiming(this: Writable<RepeatActionBuilder>, timing: number): RepeatActionBuilder {
    this.timing = timing;
    return <RepeatActionBuilder>this;
  }
}