import requests

def parse_webpage(INPUT_HTML):
    if (INPUT_HTML):
        print(INPUT_HTML.text)
    return


url = "http://www.edugo.ca"

data = requests.get(url)

parse_webpage(data)

