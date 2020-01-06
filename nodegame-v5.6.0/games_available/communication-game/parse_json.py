import json

def parse_data_dump(filename):

    with open(filename) as f:
        d = json.load(f)

        #print(d)

        parsed = {}

        parsed['filename'] = filename
        parsed['p1_id'] = d[0]['player']
        parsed['p2_id'] = d[1]['player']

        p1_msg = d[4]['forms']
        p2_msg = d[5]['forms']

        parsed['p1_msg'] = strip_msg_form(p1_msg)
        parsed['p2_msg'] = strip_msg_form(p2_msg)

        parsed['p1_choice'] = d[8]['forms']['stag_choice']['choice']
        parsed['p2_choice'] = d[9]['forms']['stag_choice']['choice']

        print(parsed)

def strip_msg_form(forms):
    acc = [int(v['choice']) for k,v in forms.items()]
    return acc
        

parse_data_dump('./data/room000122data.json')
