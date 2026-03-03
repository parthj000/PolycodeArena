import sys, io
import json

sys.path.append("/tmp")
from temp import kapa


def run_solution_please():
    test_cases = json.loads(sys.argv[1])
    sol = []

    for case in test_cases["public"]:
        response = run_each_case(case["input"], case["expected_output"])
        if response[0] == "solved":
            sol.append(response[1])

    for case in test_cases["hidden"]:
        response = run_each_case(case["input"], case["expected_output"])
        if response[0] == "solved":
            sol.append(response[1])

    print(json.dumps(sol))


def run_each_case(input, expected_out):
    try:
        buffer = io.StringIO()
        sys.stdout = buffer
        correct = 0
        out = kapa(*input)
        if expected_out == [out]:
            correct = 1
        res = {
            "Input": input,
            "Output": [out],
            "Expected_out": expected_out,
            "correct": correct,
            "user_prints": buffer.getvalue(),
        }
        return ("solved", res)
    except Exception as e:
        print(e, file=sys.stderr)
        sys.stdout = sys.__stdout__
        # directly end the subprocess
        exit(1)
    finally:
        sys.stdout = sys.__stdout__


run_solution_please()
