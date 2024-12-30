// this is 100% not copied from gamejoy
export const keyCodeAliases = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
  "a": "A",
  "b": "B",
  "c": "C",
  "d": "D",
  "e": "E",
  "f": "F",
  "g": "G",
  "h": "H",
  "i": "I",
  "j": "J",
  "k": "K",
  "l": "L",
  "m": "M",
  "n": "N",
  "o": "O",
  "p": "P",
  "q": "Q",
  "r": "R",
  "s": "S",
  "t": "T",
  "u": "U",
  "v": "V",
  "w": "W",
  "x": "X",
  "y": "Y",
  "z": "Z",
  "Numpad0": "KeypadZero",
  "Numpad1": "KeypadOne",
  "Numpad2": "KeypadTwo",
  "Numpad3": "KeypadThree",
  "Numpad4": "KeypadFour",
  "Numpad5": "KeypadFive",
  "Numpad6": "KeypadSix",
  "Numpad7": "KeypadSeven",
  "Numpad8": "KeypadEight",
  "Numpad9": "KeypadNine",
  "L1": "ButtonL1",
  "R1": "ButtonR1",
  "L2": "ButtonL2",
  "R2": "ButtonR2",
  "L3": "ButtonL3",
  "R3": "ButtonR3",
  "LeftCtrl": "LeftControl",
  "RightCtrl": "RightControl"
} satisfies { readonly [name: string]: Enum.KeyCode["Name"] };

export const gamepadInputs: Enum.UserInputType[] = [
  Enum.UserInputType.Gamepad1,
  Enum.UserInputType.Gamepad2,
  Enum.UserInputType.Gamepad3,
  Enum.UserInputType.Gamepad4,
  Enum.UserInputType.Gamepad5,
  Enum.UserInputType.Gamepad6,
  Enum.UserInputType.Gamepad7,
  Enum.UserInputType.Gamepad8
];

export type RawInput = keyof typeof keyCodeAliases | Enum.KeyCode["Name"] | Enum.UserInputType["Name"];

export function getInputEnum(rawInput: RawInput): Enum.KeyCode | Enum.UserInputType {
  const unaliased = keyCodeAliases[<never>rawInput] ?? rawInput;
  const keyCodes = Enum.KeyCode.GetEnumItems();
  return keyCodes.some(keyCode => keyCode.Name === unaliased) ?
    Enum.KeyCode[unaliased]
    : Enum.UserInputType[unaliased];
}

export function getRawInputFromEnum(inputEnum: Enum.KeyCode | Enum.UserInputType): RawInput {
  return inputEnum.Name;
}

export function getRawInput(input: InputObject): RawInput {
  const keyCodeInputTypes = [Enum.UserInputType.Keyboard, ...gamepadInputs];
  return keyCodeInputTypes.includes(input.UserInputType) ?
    getRawInputFromEnum(input.KeyCode)
    : getRawInputFromEnum(input.UserInputType);
}