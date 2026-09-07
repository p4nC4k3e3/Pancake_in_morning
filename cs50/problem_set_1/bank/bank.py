a = str(input(":")).lower().strip()

if a == "hello" or "hello" in a:
    print("$0")
elif "h" in a[0]:
    print("$20")
else:
    print("$100")
