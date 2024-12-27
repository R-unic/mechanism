import { BaseStandardAction, StandardAction } from "./standard-action";

export class DynamicAction extends BaseStandardAction {
  public readonly action: StandardAction = undefined!;

  private readonly connections = new Set<RBXScriptConnection>;

  public constructor(action: StandardAction) {
    super();
    this.updateAction(action);
  }

  public updateAction(action: StandardAction): void {
    if (this.action?.equals(action) ?? false) return;

    for (const connection of this.connections) {
      this.connections.delete(connection);
      connection.Disconnect();
    }

    this.connections.add(action.activated.Connect(() => this.activate()));
    this.connections.add(action.deactivated.Connect(() => this.deactivate()));
    (<Writable<this>>this).action = action;
  }

  /** @hidden */
  public override handleInput(input: InputObject, processed: boolean, isPress = input.UserInputState === Enum.UserInputState.Begin): void {
    if (this.action === undefined) return;
    this.action.handleInput(input, processed, isPress);
  }
}