import Signal from "@rbxts/lemon-signal";

import { BaseAction } from "./base-action";
import { getRawInput, type RawInput } from "./common";

export abstract class AxisAction extends BaseAction {
  public readonly updated = this.trash.add(new Signal);
  public readonly axes: RawInput[];
  public readonly delta = new Vector3;
  public readonly position = new Vector3;

  public constructor(...axes: RawInput[]) {
    super();
    this.axes = axes;
  }

  /** @hidden */
  public handleInput(this: Writable<AxisAction>, input: InputObject, processed: boolean): void {
    if (this.processed !== processed) return;
    if (!this.axes.includes(getRawInput(input))) return;

    this.position = input.Position;
    this.delta = input.Delta;
    this.updated.Fire();
  }
}

export class AxisActionBuilder extends AxisAction {
  /** Sets the ID of the action */
  public setID(this: Writable<AxisActionBuilder>, id: string | number): AxisActionBuilder {
    this.id = id;
    return <AxisActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<AxisActionBuilder>, processed: boolean): AxisActionBuilder {
    this.processed = processed;
    return <AxisActionBuilder>this;
  }
}