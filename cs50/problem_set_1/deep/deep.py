a = input("What is the Answer to the Great Question of Life, the Universe, and Everything? ")
clean = a.strip().lower()
if clean == "42" or clean == "Forty Two" or clean == "forty-two" or clean == "forty two":
    print("Yes")
else:
    print("No")
