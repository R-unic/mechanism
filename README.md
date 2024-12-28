# Mechanism
An elegant composable input library for Roblox

## Examples

### Creating an InputManager
An `InputManager` is a context to bind actions to. It is disposable and unbinds all actions when destroyed.<br>
The constructor takes a `useAllGamepads` parameter, which when false only uses `Gamepad1` and not any other gamepad input type.
```ts
import { InputManager, StandardActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const action = new StandardActionBuilder().setID("testID");
input.bind(action);
input.unbind(action);
input.unbind("testID");
```

### StandardAction
```ts
import { InputManager, StandardActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const crouchAction = new StandardActionBuilder(Enum.KeyCode.C, Enum.KeyCode.LeftControl)
  .setProcessed(false) // only activates when gameProcessedEvent is false, false by default
  .setCooldown(0.25); // can only be activated every 0.25 seconds
  .setInputQueueing(false); // if this were true, it would queue every input made during a cooldown to be activated after the cooldown is over

crouchAction.activated.Connect(() => print("crouched"));
crouchAction.deactivated.Connect(() => print("stood"));

input.bind(crouchAction);
```

### AxisAction
```ts
import { InputManager, AxisActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const scrollAction = new AxisActionBuilder(Enum.KeyCode.MouseWheel);

scrollAction.updated.Connect(() => print("scroll position:", scrollAction.position.Z));

input.bind(scrollAction);
```

### RepeatAction
A `RepeatAction` is an input that must be repeated multiple times to activate.
```ts
import { InputManager, RepeatActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const sprintAction = new RepeatActionBuilder(Enum.KeyCode.W)
  .setRepeats(2) // takes 2 presses to activate
  .setTiming(0.3); // each press must be within 0.3 seconds of each other, 0 by default (which is infinite time between presses)

sprintAction.activated.Connect(() => print("sprinting"));
sprintAction.deactivated.Connect(() => print("walking"));

input.bind(sprintAction);
```

### CompositeAction
A `CompositeAction` is an action composed of multiple inputs that must all be simultaneously pressed to activate the action. The action is deactivated when one of the inputs is released.
```ts
import { InputManager, CompositeActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const toggleAction = new CompositeActionBuilder(Enum.KeyCode.LeftControl, Enum.KeyCode.LeftAlt, Enum.KeyCode.M)
  .setTiming(0.5); // each press must be within 0.5 seconds of each other

toggleAction.activated.Connect(() => print("toggled"));

input.bind(toggleAction);
```

### SequentialAction
A `SequentialAction` is an action composed of multiple inputs that must all be pressed in order to activate the action. The action is deactivated when one of the last input in the sequence is released.
```ts
import { InputManager, SequentialActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const menAction = new SequentialActionBuilder(Enum.KeyCode.M, Enum.KeyCode.E, Enum.KeyCode.N)
  .setTiming(0.5); // each press must be within 0.5 seconds of each other

menAction.activated.Connect(() => print("typed 'men' quickly"));

input.bind(menAction);
```

### UniqueAction
A `UniqueAction` is an action composed of multiple child actions and is only active when exactly one of the child actions is active.
```ts
import { InputManager, UniqueActionBuilder } from "@rbxts/mechanism";

const input = new InputManager;
const cOrVAction = new UniqueActionBuilder(
  new StandardActionBuilder(Enum.KeyCode.C),
  new StandardActionBuilder(Enum.KeyCode.V)
);

cOrVAction.activated.Connect(() => print("pressed C or V exclusively"));

input.bind(cOrVAction);
```

### DynamicAction
A `DynamicAction` is an action containing one interchangable action.
```ts
import { InputManager, DynamicAction } from "@rbxts/mechanism";

const input = new InputManager;
const crouchAction = new DynamicAction(new StandardActionBuilder(Enum.KeyCode.C)); // default bind

keybinds.changed.Connect(keybinds => 
  crouchAction.updateAction(new StandardActionBuilder(keybinds.crouch)) // update bind based on data
);

crouchAction.activated.Connect(() => print("crouched"));
crouchAction.deactivated.Connect(() => print("stood"));

input.bind(crouchAction);
```