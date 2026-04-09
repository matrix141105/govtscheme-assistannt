import json
import os

filepath = r"c:\Users\HI\Desktop\govscheme-assistant-main\govscheme-assistant-main\backend\schemes.json"

with open(filepath, 'r', encoding='utf-8') as f:
    schemes = json.loads(f.read())

max_id = max([s.get('id', 0) for s in schemes] + [0])

new_schemes = [
    {
        "name": "Orunodoi Scheme",
        "tag": "Financial Assistance",
        "url": "https://orunodoi.assam.gov.in/",
        "state": "Assam",
        "details": {
            "Benefit": "Monthly financial assistance of ₹1,250 to poor families.",
            "Eligibility": "Women heads of low-income families in Assam."
        },
        "translations": {
            "हिन्दी": {
                "name": "ओरुन्दोई योजना",
                "tag": "वित्तीय सहायता",
                "details": {
                    "लाभ": "गरीब परिवारों को ₹1,250 की मासिक वित्तीय सहायता।",
                    "पात्रता": "असम में कम आय वाले परिवारों की महिला मुखिया।"
                }
            },
            "తెలుగు": {
                "name": "ఒరునోడోయి పథకం",
                "tag": "ఆర్థిక సహాయం",
                "details": {
                    "ప్రయోజనం": "పేద కుటుంబాలకు నెలకు ₹1,250 ఆర్థిక సహాయం.",
                    "అర్హత": "అస్సాంలో తక్కువ ఆదాయం ఉన్న కుటుంబాల మహిళా పెద్దలు."
                }
            },
            "Bhojpuri": {
                "name": "ओरुन्दोई योजना",
                "tag": "वित्तीय सहायता",
                "details": {
                    "लाभ": "गरीब परिवार के ₹1,250 के महीना के आर्थिक मदद।",
                    "पात्रता": "असम में कम कमाई वाला परिवार के महिला मुखिया।"
                }
            }
        }
    },
    {
        "name": "Godhan Nyay Yojana",
        "tag": "Agriculture",
        "url": "https://agriportal.cg.nic.in/",
        "state": "Chhattisgarh",
        "details": {
            "Benefit": "Procurement of cow dung at ₹2 per kg from cattle rearers.",
            "Eligibility": "Livestock owners and farmers in Chhattisgarh."
        },
        "translations": {
            "हिन्दी": {
                "name": "गोधन न्याय योजना",
                "tag": "कृषि",
                "details": {
                    "लाभ": "पशुपालकों से ₹2 प्रति किलो की दर से गोबर की खरीद।",
                    "पात्रता": "छत्तीसगढ़ में पशुपालक और किसान।"
                }
            },
            "తెలుగు": {
                "name": "గోధన్ న్యాయ్ యోజన",
                "tag": "వ్యవసాయం",
                "details": {
                    "ప్రయోజనం": "పశువుల పెంపకందారుల నుండి కిలోకు ₹2 చొప్పున ఆవు పేడ కొనుగోలు.",
                    "అర్హత": "ఛత్తీస్‌గఢ్‌లో పశువుల యజమానులు మరియు రైతులు."
                }
            },
            "Bhojpuri": {
                "name": "गोधन न्याय योजना",
                "tag": "कृषि",
                "details": {
                    "लाभ": "पसुपालक लोग से ₹2 किलो के हिसाब से गोबर के खरीद।",
                    "पात्रता": "छत्तीसगढ़ में पसुपालक अउर किसान।"
                }
            }
        }
    },
    {
        "name": "Mukhyamantri Sukh Ashray Yojana",
        "tag": "Child Welfare",
        "url": "https://himachal.nic.in/",
        "state": "Himachal Pradesh",
        "details": {
            "Benefit": "Financial aid and education support for orphans.",
            "Eligibility": "Orphan children up to 27 years in Himachal Pradesh."
        },
        "translations": {
            "हिन्दी": {
                "name": "मुख्यमंत्री सुख आश्रय योजना",
                "tag": "बाल कल्याण",
                "details": {
                    "लाभ": "अनाथ बच्चों के लिए वित्तीय सहायता और शिक्षा सहायता।",
                    "पात्रता": "हिमाचल प्रदेश में 27 वर्ष तक के अनाथ बच्चे।"
                }
            },
            "తెలుగు": {
                "name": "ముఖ్యమంత్రి సుఖ్ ఆశ్రయ్ యోజన",
                "tag": "శిశు సంక్షేమం",
                "details": {
                    "ప్రయోజనం": "అనాధలకు ఆర్థిక సహాయం మరియు విద్యా మద్దతు.",
                    "అర్హత": "హిమాచల్ ప్రదేశ్‌లో 27 ఏళ్ల వరకు ఉన్న అనాథ పిల్లలు."
                }
            },
            "Bhojpuri": {
                "name": "मुख्यमंत्री सुख आश्रय योजना",
                "tag": "बाल कल्याण",
                "details": {
                    "लाभ": "अनाथ लइकन खातिर पइसा अउर पढ़ाई के मदद।",
                    "पात्रता": "हिमाचल प्रदेश में 27 साल तक के अनाथ लइका।"
                }
            }
        }
    },
    {
        "name": "Mukhyamantri Maiya Samman Yojana",
        "tag": "Women Empowerment",
        "url": "https://jharkhand.gov.in/",
        "state": "Jharkhand",
        "details": {
            "Benefit": "₹1000 per month financial assistance for women.",
            "Eligibility": "Women aged 21-50 years in Jharkhand."
        },
        "translations": {
            "हिन्दी": {
                "name": "मुख्यमंत्री मईया सम्मान योजना",
                "tag": "महिला सशक्तिकरण",
                "details": {
                    "लाभ": "महिलाओं के लिए ₹1000 प्रति माह वित्तीय सहायता।",
                    "पात्रता": "झारखंड में 21-50 वर्ष की महिलाएं।"
                }
            },
            "తెలుగు": {
                "name": "ముఖ్యమంత్రి మయ్యా సమ్మాన్ యోజన",
                "tag": "మహిళా సాధికారత",
                "details": {
                    "ప్రయోజనం": "మహిళలకు నెలకు ₹1000 ఆర్థిక సహాయం.",
                    "అర్హత": "జార్ఖండ్‌లో 21-50 ఏళ్ల మహిళలు."
                }
            },
            "Bhojpuri": {
                "name": "मुख्यमंत्री मईया सम्मान योजना",
                "tag": "महिला सशक्तिकरण",
                "details": {
                    "लाभ": "मेहरारू लोग खातिर ₹1000 महीना के आर्थिक मदद।",
                    "पात्रता": "झारखंड में 21-50 साल के मेहरारू।"
                }
            }
        }
    },
    {
        "name": "Aam Aadmi Clinics",
        "tag": "Healthcare",
        "url": "https://punjab.gov.in/",
        "state": "Punjab",
        "details": {
            "Benefit": "Free medical checkups and medicines.",
            "Eligibility": "All residents of Punjab."
        },
        "translations": {
            "हिन्दी": {
                "name": "आम आदमी क्लीनिक",
                "tag": "स्वास्थ्य",
                "details": {
                    "लाभ": "मुफ्त चिकित्सा जांच और दवाएं।",
                    "पात्रता": "पंजाब के सभी निवासी।"
                }
            },
            "తెలుగు": {
                "name": "ఆమ్ ఆద్మీ క్లినిక్స్",
                "tag": "ఆరోగ్యం",
                "details": {
                    "ప్రయోజనం": "ఉచిత వైద్య పరీక్షలు మరియు మందులు.",
                    "అర్హత": "పంజాబ్ నివాసితులందరూ."
                }
            },
            "Bhojpuri": {
                "name": "आम आदमी क्लीनिक",
                "tag": "स्वास्थ्य",
                "details": {
                    "लाभ": "मुफ्त दवाई अउर इलाज।",
                    "पात्रता": "पंजाब के सभे निवासी।"
                }
            }
        }
    }
]

for s in new_schemes:
    max_id += 1
    s['id'] = max_id
    schemes.append(s)

def sort_key(s):
    state = s.get('state', '')
    if state == "Central":
        return (0, state, s['name'])
    else:
        return (1, state, s['name'])

schemes.sort(key=sort_key)

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, indent=4, ensure_ascii=False)
