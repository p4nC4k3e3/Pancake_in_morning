import os
os.system("cls")
#Use for Additiom
def add(a, b):
    return a + b
#Use for Subtraction
def subtract(a, b):
    return a - b   
#Use for Multiplication
def multiply(a, b): 
    return a * b
#Use for Divition
def divide(a, b):
    if b == 0:
        #Use raise syntax as(Instead of using print we just use raise to stop the program after it execute)
        raise ValueError("Cannot divide by zero!")
    return a / b
#Use to make the first number rise to the power of the sencond number
def power(a, b):
    return a ** b
#This is we're using our function, and this is where our conditional depending
def menu():
#I personaly use while oop because I just want my code after it's executed, I want it to go back to sele opiton
    while True:
        try:
            sele = int(input("Select operation:\n"
                             "1. Add\n2. Subtract\n3. Multiply\n4. Divide\n5. Power\n"
                             "Enter choice (1-5): "))
#I use exept syntax bacause, if the the user input an invalid information that my program don't accept, I want the user to try again
        except ValueError:
            print("Invalid input! Please enter a number between 1 and 5.\n")
            input("Press any key to continue...")
#I use continue syntax becuase i want my program to procide to the next
            continue 
        
        try:
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
        except ValueError:
            print("Invalid input! Please enter numbers only.\n")
            input("Press any key to continue...")
            continue
#This's where our conditional wokr
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
#Exept(if the user devided 0 in the program
            except ValueError as e:
                print(e)
            input("Press any key to continue...")

        elif sele == 5:
            print(f"{a} ^ {b} = {power(a, b)}")
            input("Press any key to continue...")
#If the user input an invalid number in the sele variable
        else:
            print("Invalid choice! Enter a number from 1 to 5.")
            input("Press any key to continue...")

#Calling the menu function, bacause this is the go signal to function to run now(without calling function it's not gonna run
menu()
