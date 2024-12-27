import Signal from "@rbxts/lemon-signal";

import { BaseAction } from "./base-action";

export abstract class AxisAction extends BaseAction {
  public readonly updated = this.janitor.Add(new Signal, "Destroy");
  public readonly axes: (Enum.KeyCode | Enum.UserInputType)[] = [];
  public readonly delta = new Vector3;
  public readonly position = new Vector3;

  public handleInput(this: Writable<AxisAction>, input: InputObject, processed: boolean): void {
    if (this.processed !== processed) return;
    if (!this.axes.includes(input.KeyCode) && !this.axes.includes(input.UserInputType)) return;

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

  /** Adds the keycodes that activate the action */
  public addAxes(...axes: (Enum.KeyCode | Enum.UserInputType)[]): AxisActionBuilder {
    for (const axis of axes)
      this.axes.push(axis);

    return this;
  }
}