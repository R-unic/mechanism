import { UserInputService as InputService } from "@rbxts/services";
import Destroyable from "@rbxts/destroyable";

import { BaseAction } from "./base-action";
import { AxisAction } from "./axis-action";

type Maybe<T> = T | undefined;
type AbstractConstructor<T = object> = abstract new (...args: never[]) => T;

export class InputManager extends Destroyable {
  private readonly registeredActions = new Set<BaseAction>;
  private readonly gamepadInputs: Enum.UserInputType[] = [
    Enum.UserInputType.Gamepad1,
    Enum.UserInputType.Gamepad2,
    Enum.UserInputType.Gamepad3,
    Enum.UserInputType.Gamepad4,
    Enum.UserInputType.Gamepad5,
    Enum.UserInputType.Gamepad6,
    Enum.UserInputType.Gamepad7,
    Enum.UserInputType.Gamepad8
  ];

  public constructor(
    private readonly useAllGamepads = false
  ) {
    super();

    this.janitor.Add(() => {
      for (const action of this.registeredActions)
        this.unbind(action);
    });

    this.janitor.Add(InputService.InputBegan.Connect((input, processed) => this.handleInput(input, processed)));
    this.janitor.Add(InputService.InputEnded.Connect((input, processed) => this.handleInput(input, processed)));
    this.janitor.Add(InputService.InputChanged.Connect((input, processed) => this.handleInput(input, processed, true)));
  }

  public getActionByID<T extends BaseAction = BaseAction>(actionID: string | number, actionType?: AbstractConstructor<T>): Maybe<T> {
    return [...this.registeredActions]
      .filter((action): action is T => actionType !== undefined ? action instanceof actionType : true)
      .find(action => action.id === actionID);
  }

  public bind(action: BaseAction): void {
    this.registeredActions.add(action);
  }

  public unbind(actionID: string | number): void
  public unbind(action: BaseAction): void
  public unbind(actionSpecifier: string | number | BaseAction): void {
    if (actionSpecifier instanceof BaseAction)
      return void this.registeredActions.delete(actionSpecifier);

    const action = [...this.registeredActions].find(action => action.id === actionSpecifier);
    if (action === undefined) return;
    this.registeredActions.delete(action);
  }

  private handleInput(input: InputObject, processed: boolean, inputChanged = false): void {
    const inputType = input.UserInputType;
    if (this.isUsingUnknownGamepad(inputType)) return;

    for (const action of this.registeredActions) {
      if (inputChanged && !(action instanceof AxisAction)) continue;
      action.handleInput(input, processed);
    }
  }

  private isUsingUnknownGamepad(inputType: Enum.UserInputType): boolean {
    return this.gamepadInputs.includes(inputType) &&
      inputType !== Enum.UserInputType.Gamepad1 &&
      !this.useAllGamepads;
  }
}