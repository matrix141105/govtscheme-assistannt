import traceback
try:
    with open("backend/main.py", "r", encoding="utf-8") as f:
        compile(f.read(), "backend/main.py", "exec")
    open("error.txt", "w").write("No error")
except Exception as e:
    with open("error.txt", "w", encoding="utf-8") as f:
        traceback.print_exc(file=f)
