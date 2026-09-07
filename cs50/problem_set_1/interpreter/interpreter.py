def main():
    n1, y, n2 = input("Expression:").split()
    x = float(n1)
    z = float(n2)
    if y == "+":
        print(x + z)
    elif y == "-":
        print(x - z)
    elif y == "/":
        print(x / z)
    elif y == "*":
        print(x * z)

main()
