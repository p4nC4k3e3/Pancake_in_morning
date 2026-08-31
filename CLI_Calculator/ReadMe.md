# 🧮 CLI Calculator

A simple command-line calculator built in Python. Runs in a loop so you can perform multiple calculations without restarting the program.

## Features

- Add, subtract, multiply, divide, and power (exponent) operations
- Input validation — rejects non-numeric input instead of crashing
- Divide-by-zero protection via a raised exception
- Menu-driven loop — returns to the menu after every operation until you close it
- Clears the terminal on start for a clean interface

## How It Works

1. The screen clears and the menu prints.
2. You pick an operation (1–5).
3. You enter two numbers.
4. The result prints, then the menu loops back.

Invalid input (letters instead of numbers, or a choice outside 1–5) doesn't crash the program — it prints an error and lets you try again.

## Run It

```bash
python calculator.py
```

> Requires Python 3. No external dependencies — uses only the built-in `os` module.

## Example

```
Select operation:
1. Add
2. Subtract
3. Multiply
4. Divide
5. Power
Enter choice (1-5): 1
Enter first number: 4
Enter second number: 5
4 + 5 = 9
```

## What I Learned Building This

- Using `try`/`except` around `int(input(...))` to catch bad input instead of letting the program crash
- Using `raise` to stop execution cleanly on invalid math (divide by zero) instead of just printing and continuing
- Structuring a menu with a `while True` loop plus `continue` to keep the program running until the user is done
- Separating each operation into its own function instead of cramming logic into the menu itself

## Possible Improvements

- Support decimal input (currently forces `int`, so `3.5` would fail)
- Add an "exit" option instead of relying on closing the terminal
- Move `os.system("cls")` behind a check so it also works on Linux/Mac (`clear` instead of `cls`)