import { StandardAction } from "./standard-action";

export abstract class SequentialAction extends StandardAction {
  public readonly timing: number = 0.3;

  private rawInputIndex = 0;
  private lastTap = 0;
  private firstInput = true;

  /** @hidden */
  public override handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.processed !== processed) return;

    if (isPress) {
      const expectedRawInput = this.rawInputs[this.rawInputIndex];
      const withinTime = this.firstInput || os.clock() - this.lastTap < this.timing;
      if (expectedRawInput !== undefined && this.rawInputMatches(expectedRawInput, input) && withinTime) {
        this.firstInput = false;
        if (this.rawInputIndex === this.rawInputs.size() - 1)
          super.handleInput(input, processed, isPress);

        this.rawInputIndex++
      } else {
        this.firstInput = true;
        this.rawInputIndex = 0;
      }

      this.lastTap = os.clock();
      return;
    }

    if (!this.isActive) return;
    if (this.rawInputIndex < this.rawInputs.size() - 1) return;
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