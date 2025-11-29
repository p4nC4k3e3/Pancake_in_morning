import os
os.system("cls")

def add(a, b):
    return a + b
def subtract(a, b):
    return a - b   
def multiply(a, b): 
    return a * b
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero!")
    return a / b
def power(a, b):
    return a ** b

def menu():
    while True:
        try:
            sele = int(input("Select operation:\n"
                             "1. Add\n2. Subtract\n3. Multiply\n4. Divide\n5. Power\n"
                             "Enter choice (1-5): "))
        except ValueError:
            print("Invalid input! Please enter a number between 1 and 5.\n")
            input("Press any key to continue...")
            continue  # restart menu loop
        
        try:
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
        except ValueError:
            print("Invalid input! Please enter numbers only.\n")
            input("Press any key to continue...")
            continue

        if sele == 1:
            print(f"{a} + {b} = {add(a, b)}")
            input("Press any key to continue...")

        elif sele == 2:
            print(f"{a} - {b} = {subtract(a, b)}")
            input("Press any key to continue...")

        elif sele == 3:
            print(f"{a} * {b} = {multiply(a, b)}")
            input("Press any key to continue...")

        elif sele == 4:
            try:
                print(f"{a} / {b} = {divide(a, b)}")
            except ValueError as e:
                print(e)
            input("Press any key to continue...")

        elif sele == 5:
            print(f"{a} ^ {b} = {power(a, b)}")
            input("Press any key to continue...")

        else:
            print("Invalid choice! Enter a number from 1 to 5.")
            input("Press any key to continue...")

menu()