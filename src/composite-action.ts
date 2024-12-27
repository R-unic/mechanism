import { StandardAction } from "./standard-action";

export abstract class CompositeAction extends StandardAction {
  public readonly timing: number = 0;
  private readonly keyPressTimestamps = new Map<Enum.KeyCode, number>;

  /** @hidden */
  public override handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.processed !== processed) return;

    if (isPress) {
      this.keyPressTimestamps.set(input.KeyCode, os.clock());

      let i = 1;
      const shouldHandleInput = this.keyCodes.every(keyCode => {
        const pressTimestamp = this.keyPressTimestamps.get(keyCode) ?? 0;
        const expectedPressTimestamp = os.clock() - this.timing * i++;
        const timeHeld = expectedPressTimestamp - pressTimestamp;
        return this.timing > 0 ?
          timeHeld < this.timing
          : this.keyPressTimestamps.has(keyCode);
      });

      if (shouldHandleInput)
        super.handleInput(input, processed, isPress);

      return;
    } else
      this.keyPressTimestamps.delete(input.KeyCode);

    if (!this.isActive) return;
    super.handleInput(input, processed, isPress);
  }
}

export class CompositeActionBuilder extends CompositeAction {
  /** Sets the ID of the action */
  public setID(this: Writable<CompositeActionBuilder>, id: string | number): CompositeActionBuilder {
    this.id = id;
    return <CompositeActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<CompositeActionBuilder>, processed: boolean): CompositeActionBuilder {
    this.processed = processed;
    return <CompositeActionBuilder>this;
  }

  /** Adds the keycodes that activate the action */
  public addKeyCodes(...keyCodes: Enum.KeyCode[]): CompositeActionBuilder {
    for (const keyCode of keyCodes)
      this.keyCodes.push(keyCode);

    return this;
  }

  /** Sets a time to wait between each activation of the action */
  public setCooldown(this: Writable<CompositeActionBuilder>, cooldown: number): CompositeActionBuilder {
    this.cooldown = cooldown;
    return <CompositeActionBuilder>this;
  }

  /** Sets the maximum time in between inputs */
  public setTiming(this: Writable<CompositeActionBuilder>, timing: number): CompositeActionBuilder {
    this.timing = timing;
    return <CompositeActionBuilder>this;
  }
}