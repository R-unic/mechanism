import { BaseID } from "@rbxts/id";
import Destroyable from "@rbxts/destroyable";

export abstract class BaseAction extends Destroyable implements BaseID<string | number> {
  public readonly id: string | number = "default";
  public readonly processed: boolean = false;
  public readonly callbacks: Callback[] = [];

  /** @hidden */
  public abstract handleInput(input: InputObject, processed: boolean): void;
}