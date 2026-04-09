import traceback
try:
    with open("backend/main.py", "r", encoding="utf-8") as f:
        compile(f.read(), "backend/main.py", "exec")
    with open("error.txt", "w", encoding="utf-8") as f:
        f.write("No syntax error found")
except Exception as e:
    with open("error.txt", "w", encoding="utf-8") as f:
        traceback.print_exc(file=f)
