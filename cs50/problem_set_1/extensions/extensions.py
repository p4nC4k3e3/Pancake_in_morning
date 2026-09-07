a = input(":").strip().lower()

if "jpg" in a or "jpeg" in a:
    print("image/jpeg")

elif "gif" in a:
    print("image/gif")
elif "png" in a:
    print("image/png")
elif "pdf" in a:
    print("application/pdf")
elif "txt" in a:
    print("text/plain")
elif "zip" in a:
    print("application/zip")

else:
    print("application/octet-stream")

