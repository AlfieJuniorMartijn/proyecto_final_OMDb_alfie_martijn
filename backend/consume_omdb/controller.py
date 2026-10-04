from model import ModelApi

class ControllerApi:
    def __init__(self):
        self.model = ModelApi()
        self.model.get_results(input("Please enter the title: "), input("Please enter the year (Leave blank if no specific year is needed): "))

example = ControllerApi()
print(example.model.formatted_result)