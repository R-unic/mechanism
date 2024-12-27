import { BaseStandardAction, StandardAction } from "./standard-action";

export abstract class UniqueAction extends BaseStandardAction {
  public readonly actions: StandardAction[] = [];

  public override handleInput(input: InputObject, processed: boolean): void {
    const isPress = input.UserInputState === Enum.UserInputState.Begin;
    for (const action of this.actions)
      action.handleInput(input, processed, isPress);

    const activeActions = this.actions.filter(action => action.isActive);
    if (activeActions.size() === 0 || (isPress && activeActions.size() !== 1))
      return this.deactivate();

    this.activate();
  }
}

export class UniqueActionBuilder extends UniqueAction {
  /** Sets the ID of the action */
  public setID(this: Writable<UniqueActionBuilder>, id: string | number): UniqueActionBuilder {
    this.id = id;
    return <UniqueActionBuilder>this;
  }

  /** Sets whether the action is activated when gameProcessedEvent is true */
  public setProcessed(this: Writable<UniqueActionBuilder>, processed: boolean): UniqueActionBuilder {
    this.processed = processed;
    return <UniqueActionBuilder>this;
  }

  /** Adds the child actions that activate the unique action */
  public addActions(...actions: StandardAction[]): UniqueActionBuilder {
    for (const action of actions)
      this.actions.push(action);

    return this;
  }
}