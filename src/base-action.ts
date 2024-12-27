import { BaseID } from "@rbxts/id";
import Destroyable from "@rbxts/destroyable";

import { defaultActionID } from "./constants";

export abstract class BaseAction extends Destroyable implements BaseID<string | number> {
  public readonly id = defaultActionID;
  public readonly processed: boolean = false;
  public readonly callbacks: Callback[] = [];

  /** @hidden */
  public abstract handleInput(input: InputObject, processed: boolean): void;
}