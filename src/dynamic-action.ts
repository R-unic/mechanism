import { BaseStandardAction } from "./standard-action";

export class DynamicAction extends BaseStandardAction {
  public readonly action!: BaseStandardAction;

  private readonly connections = new Set<RBXScriptConnection>;

  public constructor(action: BaseStandardAction) {
    super();
    this.updateAction(action);
  }

  public updateAction(action: BaseStandardAction): void {
    for (const connection of this.connections) {
      this.connections.delete(connection);
      connection.Disconnect();
    }

    this.connections.add(action.activated.Connect(() => this.activate()));
    this.connections.add(action.deactivated.Connect(() => this.deactivate()));
    (<Writable<this>>this).action = action;
  }

  /** @hidden */
  public override handleInput(input: InputObject, processed: boolean): void {
    if (this.action === undefined) return;
    this.action.handleInput(input, processed);
  }
}