import json
import os

filepath = r"c:\Users\HI\Desktop\govscheme-assistant-main\govscheme-assistant-main\backend\schemes.json"

with open(filepath, 'r', encoding='utf-8') as f:
    schemes = json.loads(f.read())

max_id = max([s.get('id', 0) for s in schemes] + [0])

new_schemes = [
    {
        "name": "Mukhyamantri Kanya Utthan Yojana",
        "tag": "Education & Women",
        "url": "https://edudbt.bihar.gov.in/",
        "state": "Bihar",
        "details": {
            "Benefit": "Financial support from birth to graduation for girl child.",
            "Eligibility": "Girl child born in Bihar."
        },
        "translations": {
            "हिन्दी": {
                "name": "मुख्यमंत्री कन्या उत्थान योजना",
                "tag": "शिक्षा",
                "details": {
                    "लाभ": "बालिका के जन्म से लेकर स्नातक तक वित्तीय सहायता।",
                    "पात्रता": "बिहार में जन्मी बालिका।"
                }
            },
            "తెలుగు": {
                "name": "ముఖ్యమంత్రి కన్యా ఉత్థాన్ యోజన",
                "tag": "విద్య",
                "details": {
                    "ప్రయోజనం": "అమ్మాయిలకు పుట్టుక నుండి గ్రాడ్యుయేషన్ వరకు ఆర్థిక సహాయం.",
                    "అర్హత": "బీహార్‌లో పుట్టిన ఆడపిల్లలు."
                }
            },
            "Bhojpuri": {
                "name": "मुख्यमंत्री कन्या उत्थान योजना",
                "tag": "पढ़ाई-लिखाई",
                "details": {
                    "लाभ": "लड़की के जनम से लेके ग्रेजुएशन तक पइसा के मदद।",
                    "पात्रता": "बिहार में जनमल लइकी।"
                }
            }
        }
    },
    {
        "name": "Ganga Swarupa Yojana",
        "tag": "Social Welfare",
        "url": "https://sje.gujarat.gov.in/",
        "state": "Gujarat",
        "details": {
            "Benefit": "Monthly pension for destitute widows.",
            "Eligibility": "Widows with low family income."
        },
        "translations": {
            "हिन्दी": {
                "name": "गंगा स्वरूपा योजना",
                "tag": "समाज कल्याण",
                "details": {
                    "लाभ": "निराश्रित विधवाओं के लिए मासिक पेंशन।",
                    "पात्रता": "कम आय वाले परिवारों की विधवाएं।"
                }
            },
            "తెలుగు": {
                "name": "గంగా స్వరూప యోజన",
                "tag": "సామాజిక సంక్షేమం",
                "details": {
                    "ప్రయోజనం": "విధవలకు నెలవారీ పెన్షన్.",
                    "అర్హత": "తక్కువ ఆదాయం ఉన్న విధవలు."
                }
            },
            "Bhojpuri": {
                "name": "गंगा स्वरूपा योजना",
                "tag": "समाज कल्याण",
                "details": {
                    "लाभ": "बिधवा मेहरारू लोग खातिर महीना के पेंशन।",
                    "पात्रता": "कम कमाई वाला परिवार के बिधवा।"
                }
            }
        }
    },
    {
        "name": "LIFE Mission",
        "tag": "Housing",
        "url": "https://life.kerala.gov.in/",
        "state": "Kerala",
        "details": {
            "Benefit": "Comprehensive housing scheme for the landless and homeless.",
            "Eligibility": "Landless and homeless families in Kerala."
        },
        "translations": {
            "हिन्दी": {
                "name": "लाइफ मिशन",
                "tag": "आवास",
                "details": {
                    "लाभ": "भूमिहीन और बेघर लोगों के लिए व्यापक आवास योजना।",
                    "पात्रता": "केरल में बेघर और भूमिहीन परिवार।"
                }
            },
            "తెలుగు": {
                "name": "లైఫ్ మిషన్",
                "tag": "గృహనిర్మాణం",
                "details": {
                    "ప్రయోజనం": "ఇల్లు, భూమి లేని వారికి పక్కా ఇళ్లు.",
                    "అర్హత": "కేరళలోని ఇళ్లు లేని పేదలు."
                }
            },
            "Bhojpuri": {
                "name": "लाइफ मिशन",
                "tag": "आवास",
                "details": {
                    "लाभ": "बगैर जमीन अउर घर वाला लोग के मकान।",
                    "पात्रता": "केरल के बिना घर-जमीन वाला परिवार।"
                }
            }
        }
    },
    {
        "name": "Delhi Arogya Nidhi",
        "tag": "Healthcare",
        "url": "https://health.delhigovt.nic.in/",
        "state": "Delhi",
        "details": {
            "Benefit": "Financial assistance for medical treatment in government hospitals.",
            "Eligibility": "Poor patients residing in Delhi."
        },
        "translations": {
            "हिन्दी": {
                "name": "दिल्ली आरोग्य निधि",
                "tag": "स्वास्थ्य",
                "details": {
                    "लाभ": "सरकारी अस्पतालों में चिकित्सा उपचार के लिए वित्तीय सहायता।",
                    "पात्रता": "दिल्ली में रहने वाले गरीब मरीज।"
                }
            },
            "తెలుగు": {
                "name": "ఢిల్లీ ఆరోగ్య నిధి",
                "tag": "ఆరోగ్యం",
                "details": {
                    "ప్రయోజనం": "ప్రభుత్వ ఆసుపత్రులలో వైద్య చికిత్స కోసం ఆర్థిక సహాయం.",
                    "అర్హత": "ఢిల్లీలో నివసిస్తున్న పేద రోగులు."
                }
            },
            "Bhojpuri": {
                "name": "दिल्ली आरोग्य निधि",
                "tag": "स्वास्थ्य",
                "details": {
                    "लाभ": "सरकारी अस्पताल में इलाज खातिर पइसा के मदद।",
                    "पात्रता": "दिल्ली में रहे वाला गरीब मरीज।"
                }
            }
        }
    }
]

for s in new_schemes:
    max_id += 1
    s['id'] = max_id
    schemes.append(s)

# Sort schemes: Central first, then alphabetically by state name, then alphabetically by scheme name
def sort_key(s):
    state = s.get('state', '')
    if state == "Central":
        return (0, state, s['name'])
    else:
        return (1, state, s['name'])

schemes.sort(key=sort_key)

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, indent=4, ensure_ascii=False)
