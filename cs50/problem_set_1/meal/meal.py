def main():
    a = input("What time is it? ")
    b = convert(a)
    if 7.0 <= b <= 8.0:
        print("breakfast time")
    elif 12.0 <= b <= 13.0:
        print("lunch time")
    elif 18.0 <= b <= 19.0:
        print("dinner time")

def convert(time):
    h, m = time.split(":")
    h = float(h)
    m = float(m) / 60

    return h + m

if __name__ == "__main__":
    main()
