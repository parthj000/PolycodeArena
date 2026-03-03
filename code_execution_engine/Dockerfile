FROM public.ecr.aws/lambda/python:3.12

COPY solution.py ${LAMBDA_TASK_ROOT}
COPY main.py ${LAMBDA_TASK_ROOT}

CMD [ "main.lambda_handler" ]