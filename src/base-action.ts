import { BaseID } from "@rbxts/id";

import { InputManager } from "./input-manager";

export abstract class BaseAction implements BaseID<string | number> {
  public readonly id = InputManager.defaultActionID;
  public readonly processed: boolean = false;
}