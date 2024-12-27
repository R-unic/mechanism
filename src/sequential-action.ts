import { StandardAction } from "./standard-action";

export abstract class SequentialAction extends StandardAction {
  public readonly timing: number = 0.3;

  private keyCodeIndex = 0;
  private lastTap = 0;
  private firstInput = true;

  public override handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.processed !== processed) return;

    if (isPress) {
      const expectedKeyCode = this.keyCodes[this.keyCodeIndex];
      const withinTime = this.firstInput || os.clock() - this.lastTap < this.timing;
      if (expectedKeyCode !== undefined && input.KeyCode === expectedKeyCode && withinTime) {
        this.firstInput = false;
        if (this.keyCodeIndex === this.keyCodes.size() - 1)
          super.handleInput(input, processed, isPress);

        this.keyCodeIndex++
      } else {
        this.firstInput = true;
        this.keyCodeIndex = 0;
      }

      this.lastTap = os.clock();
      return;
    }

    if (!this.isActive) return;
    if (this.keyCodeIndex < this.keyCodes.size() - 1) return;
    super.handleInput(input, processed, isPress);
  }
}

export class SequentialActionBuilder extends SequentialAction {
  /** Sets the ID of the action */
  public setID(this: Writable<SequentialActionBuilder>, id: string | number): SequentialActionBuilder {
    this.id = id;
    return <SequentialActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<SequentialActionBuilder>, processed: boolean): SequentialActionBuilder {
    this.processed = processed;
    return <SequentialActionBuilder>this;
  }

  /** Adds the keycodes that activate the action */
  public addKeyCodes(...keyCodes: Enum.KeyCode[]): SequentialActionBuilder {
    for (const keyCode of keyCodes)
      this.keyCodes.push(keyCode);

    return this;
  }

  /** Sets a time to wait between each activation of the action */
  public setCooldown(this: Writable<SequentialActionBuilder>, cooldown: number): SequentialActionBuilder {
    this.cooldown = cooldown;
    return <SequentialActionBuilder>this;
  }

  /** Sets the maximum time in between inputs in the sequence */
  public setTiming(this: Writable<SequentialActionBuilder>, timing: number): SequentialActionBuilder {
    this.timing = timing;
    return <SequentialActionBuilder>this;
  }
}