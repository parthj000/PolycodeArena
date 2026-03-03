import json
import subprocess
import resource


def lambda_handler(event, context):

    def set_memory_limit():
        soft, hard = 50 * 1024 * 1024, 50 * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (soft, hard))
        resource.setrlimit(resource.RLIMIT_DATA, (soft, hard))

    print(event)

    try:
        req_body = json.loads(event["body"])
        code = req_body["code"]
        test_cases = req_body["test_cases"]
        test_cases_str = json.dumps(test_cases)
    except Exception as e:
        return {"error": "malformed req."}

    with open("/tmp/temp.py", "w") as file:
        file.write(code)

    try:
        result = subprocess.run(
            ["python3", "solution.py", test_cases_str],
            capture_output=True,
            text=True,
            timeout=2,
            preexec_fn=set_memory_limit,
        )

        print("OUTPUT OF LAMBDA FUNCTION", result.stdout)
        print("ERROR OF LAMBDA FUNCTION", result.stderr)
        response = {
            "stderr": result.stderr,
        }

        if result.stdout:
            res = json.loads(result.stdout)
            response["stdout"] = res

        return response

    except subprocess.TimeoutExpired as e:
        return {"stderr": f"Timeout exceeded {e.timeout} seconds"}

    except Exception as e:
        print(e)
        return {"stderr": str(e)}
