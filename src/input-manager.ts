import { UserInputService as InputService } from "@rbxts/services";
import LazyIterator from "@rbxts/lazy-iterator";
import Destroyable from "@rbxts/destroyable";

import { BaseAction } from "./base-action";
import { StandardAction } from "./standard-action";
import { AxisAction } from "./axis-action";

export class InputManager extends Destroyable {
  public static defaultActionID: string | number = "default";

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

    this.janitor.Add(InputService.InputBegan.Connect((input, processed) => this.onInputBegan(input, processed)));
    this.janitor.Add(InputService.InputEnded.Connect((input, processed) => this.onInputEnded(input, processed)));
    this.janitor.Add(InputService.InputChanged.Connect((input, processed) => this.onInputChanged(input, processed)));
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

  private onInputBegan(input: InputObject, processed: boolean): void {
    const inputType = input.UserInputType;
    if (this.isUsingUnknownGamepad(inputType)) return;

    const actions = [...this.registeredActions]
      .filter(action => action.processed === processed);

    for (const action of actions) {
      if (action instanceof StandardAction) {
        if (!action.keyCodes.includes(input.KeyCode)) continue;
        action.activate();
      } else if (action instanceof AxisAction) {
        if (!action.axes.includes(input.KeyCode) && !action.axes.includes(inputType)) continue;
        (<Writable<AxisAction>>action).position = input.Position;
        (<Writable<AxisAction>>action).delta = input.Delta;
        action.updated.Fire();
      }
    }
  }

  private onInputEnded(input: InputObject, processed: boolean): void {
    const inputType = input.UserInputType;
    if (this.isUsingUnknownGamepad(inputType)) return;

    const actions = [...this.registeredActions]
      .filter(action => action.processed === processed);

    for (const action of actions) {
      if (action instanceof StandardAction) {
        if (!action.keyCodes.includes(input.KeyCode)) continue;
        action.deactivate();
      } else if (action instanceof AxisAction) {
        if (!action.axes.includes(input.KeyCode) && !action.axes.includes(inputType)) continue;
        (<Writable<AxisAction>>action).position = input.Position;
        (<Writable<AxisAction>>action).delta = input.Delta;
        action.updated.Fire();
      }
    }
  }

  private onInputChanged(input: InputObject, processed: boolean) {
    const inputType = input.UserInputType;
    LazyIterator.fromSet(this.registeredActions)
      .filter(action => action.processed === processed)
      .filter((action): action is Writable<AxisAction> => action instanceof AxisAction)
      .filter(action => action.axes.includes(input.KeyCode) || action.axes.includes(inputType))
      .collect(action => {
        action.position = input.Position;
        action.delta = input.Delta;
        action.updated.Fire();
      });
  }

  private isUsingUnknownGamepad(inputType: Enum.UserInputType) {
    return this.gamepadInputs.includes(inputType) &&
      inputType !== Enum.UserInputType.Gamepad1 &&
      !this.useAllGamepads;
  }
}