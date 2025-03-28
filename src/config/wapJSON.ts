import { WapJSON } from "@/types/flowJSON";

export const wapJSON: WapJSON = {
    "version": "7.0",
    "data_api_version": "3.0",
    "routing_model": {},
    "screens": [
        {
            "id": "DEMO_SCREEN",
            "title": "Form Preview",
            "terminal": true,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "text_input_form",
                        "init-values": {
                            "text input": "This is text input",
                            "text area": "This is text area"
                        },
                        "children": [
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Text Input",
                                "name": "text input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Number Input",
                                "input-type": "number",
                                "name": "number input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Email Input",
                                "input-type": "email",
                                "name": "email input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Password Input",
                                "input-type": "password",
                                "name": "password input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Passcode Input",
                                "input-type": "passcode",
                                "name": "passcode input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Phone Input",
                                "input-type": "phone",
                                "name": "phone input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Regex Input",
                                "input-type": "text",
                                "pattern": "^(19|20)\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
                                "helper-text": "E.g. 1993-08-04",
                                "name": "regex input"
                            },
                            {
                                "type": "TextInput",
                                "required": true,
                                "label": "Regex Passcode",
                                "pattern": "007",
                                "input-type": "passcode",
                                "name": "passcode_oo7",
                                "helper-text": "Contains: 007"
                            },
                            {
                                "type": "TextArea",
                                "required": true,
                                "label": "Text Area",
                                "name": "text area"
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "complete",
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_1",
            "title": "Basic Text Preview",
            "terminal": false,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextHeading",
                        "text": "This is a heading",
                        "visible": true
                    },
                    {
                        "type": "TextSubheading",
                        "text": "This is a subheading",
                        "visible": true
                    },
                    {
                        "type": "TextBody",
                        "text": "This is body text"
                    },
                    {
                        "type": "TextCaption",
                        "text": "This is a text caption"
                    },
                    {
                        "type": "Footer",
                        "label": "Continue",
                        "on-click-action": {
                            "name": "complete",
                            "payload": {}
                        }
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_2",
            "title": "Markdown Features",
            "terminal": false,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "RichText",
                        "text": [
                            "**hello**",
                            "---",
                            "- it's a me"
                        ]
                    },
                    {
                        "type": "Footer",
                        "label": "Next",
                        "on-click-action": {
                            "name": "complete",
                            "payload": {}
                        }
                    }
                ]
            }
        },
        {
            "id": "CHECKBOX_DEMO_SCREEN",
            "title": "Checkbox Preview",
            "terminal": true,
            "data": {
                "all_extras": [
                    {
                        "id": "1",
                        "title": "Fries"
                    },
                    {
                        "id": "2",
                        "title": "Coleslaw"
                    }
                ]
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "checkbox_example_form",
                        "children": [
                            {
                                "type": "CheckboxGroup",
                                "name": "extras",
                                "label": "Extras:",
                                "description": "Pick something to go with your meal",
                                "required": true,
                                "data-source": "${data.all_extras}",
                                "on-select-action": {
                                    "name": "data_exchange",
                                    "payload": {
                                        "extras": "${form.extras}"
                                    }
                                }
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "data_exchange",
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_3",
            "title": "Final Screen",
            "terminal": true,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextHeading",
                        "text": "Final Screen",
                        "visible": true
                    },
                    {
                        "type": "TextBody",
                        "text": "This is the last screen of the flow"
                    },
                    {
                        "type": "TextCaption",
                        "text": "Thank you for using our service"
                    },
                    {
                        "type": "Footer",
                        "label": "Finish",
                        "on-click-action": {
                            "name": "complete",
                            "payload": {}
                        }
                    }
                ]
            }
        }, 
        {
            "id": "DEMO_SCREEN_R",
            "terminal": true,
            "title": "Radio Buttons Preview",
            "data": {
                "all_appointment_types": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            }
                        }
                    },
                    "__example__": [
                        {
                            "id": "1",
                            "title": "Online"
                        },
                        {
                            "id": "2",
                            "title": "In Person"
                        }
                    ]
                }
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "text_input_form",
                        "children": [
                            {
                                "type": "RadioButtonsGroup",
                                "name": "appointment_type",
                                "label": "Appointment type",
                                "description": "Choose your preferred appointment type",
                                "required": true,
                                "data-source": "${data.all_appointment_types}",
                                "on-select-action": {
                                    "name": "data_exchange",
                                    "payload": {
                                        "appointment_type": "${form.appointment_type}"
                                    }
                                }
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "data_exchange",
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_OPT_IN",
            "title": "Opt In Preview",
            "terminal":false,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "text_input_form",
                        "children": [
                            {
                                "type": "OptIn",
                                "name": "OptIn",
                                "label": "This is an OptIn",
                                "required": true,
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "type": "screen",
                                        "name": "NEXT_SCREEN"
                                    },
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_DROPDWON",
            "terminal": true,
            "title": "Dropdown Preview",
            "data": {
                "all_burgers": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "metadata": {
                                "type": "string"
                            }
                        }
                    },
                    "__example__": [
                        {
                            "id": "1_bef",
                            "title": "Beef burger",
                            "description": "Beef, red onion relish, lettuce",
                            "metadata": "$9.99"
                        },
                        {
                            "id": "2_chick",
                            "title": "Chicken burger",
                            "description": "Grilled chicken breast, cheese, buffalo sause",
                            "metadata": "$10.99"
                        }
                    ]
                }
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "text_input_form",
                        "children": [
                            {
                                "type": "Dropdown",
                                "name": "burger",
                                "label": "Burgers",
                                "required": true,
                                "data-source": "${data.all_burgers}",
                                "on-select-action": {
                                    "name": "data_exchange",
                                    "payload": {
                                        "burger": "${form.burger}"
                                    }
                                }
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "data_exchange",
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_EL",
            "title": "Embedded Link",
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "EmbeddedLink",
                        "text": "This is an embedded link",
                        "on-click-action": {
                            "name": "navigate",
                            "next": {
                                "type": "screen",
                                "name": "FINISH"
                            },
                            "payload": {
                                "test_payload": "This is a test_payload"
                            }
                        }
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_DATE_PCIKER",
            "terminal": true,
            "title": "Date Picker Demo",
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "form_name",
                        "children": [
                            {
                                "type": "DatePicker",
                                "name": "date",
                                "label": "Date",
                                "min-date": "1693569600000",
                                "max-date": "1767182400000",
                                "unavailable-dates": [
                                    "1694779200000",
                                    "1697371200000"
                                ],
                                "on-select-action": {
                                    "name": "data_exchange",
                                    "payload": {
                                        "date": "${form.date}"
                                    }
                                }
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "data_exchange",
                                    "payload": {}
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "FIRST_SCREEN",
            "title": "Our offers",
            "data": {},
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "NavigationList",
                        "name": "insurances",
                        "list-items": [
                            {
                                "id": "home",
                                "main-content": {
                                    "title": "Home Insurance",
                                    "metadata": "Safeguard your home against natural disasters, theft, and accidents"
                                },
                                "end": {
                                    "title": "$100",
                                    "description": "/ month"
                                },
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "SECOND_SCREEN",
                                        "type": "screen"
                                    },
                                    "payload": {}
                                }
                            },
                            {
                                "id": "health",
                                "main-content": {
                                    "title": "Health Insurance",
                                    "metadata": "Get essential coverage for doctor visits, prescriptions, and hospital stays"
                                },
                                "end": {
                                    "title": "$80",
                                    "description": "/ month"
                                },
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "SECOND_SCREEN",
                                        "type": "screen"
                                    },
                                    "payload": {}
                                }
                            },
                            {
                                "id": "intergalactic",
                                "main-content": {
                                    "title": "Intergalactic Insurance",
                                    "metadata": "Enjoy coverage for asteroid collisions, alien encounters, and other risks"
                                },
                                "end": {
                                    "title": "$1.000",
                                    "description": "/ month"
                                },
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "FOURTH_SCREEN",
                                        "type": "screen"
                                    },
                                    "payload": {}
                                }
                            },
                            {
                                "id": "timetravel",
                                "main-content": {
                                    "title": "Time Travel Insurance",
                                    "metadata": "Ready for paradox-related damages or unforeseen consequences of altering history"
                                },
                                "end": {
                                    "title": "$980",
                                    "description": "/ month"
                                },
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "FIFTH_SCREEN",
                                        "type": "screen"
                                    },
                                    "payload": {}
                                }
                            },
                            {
                                "id": "dream",
                                "main-content": {
                                    "title": "Dream Loss Insurance",
                                    "metadata": "Protection from recurring nightmares or lost opportunities due to poor sleep"
                                },
                                "end": {
                                    "title": "$540",
                                    "description": "/ month"
                                },
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "FIFTH_SCREEN",
                                        "type": "screen"
                                    },
                                    "payload": {
                                        "first_name": true
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "DEMO_SCREEN_CHIPS",
            "terminal": true,
            "title": "Chip Selector Preview",
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "ChipsSelector",
                        "name": "chips",
                        "label": "Personalize your experience",
                        "description": "Choose your interests to get personalized design ideas and solution",
                        "max-selected-items": 2,
                        "data-source": [
                            {
                                "id": "room_layout",
                                "title": "🏡 Room layouts"
                            },
                            {
                                "id": "lighting",
                                "title": "💡 Lighting"
                            },
                            {
                                "id": "renovation",
                                "title": "🛠️ Renovation"
                            },
                            {
                                "id": "furnitures",
                                "title": "📐 Room layouts"
                            }
                        ]
                    },
                    {
                        "type": "Footer",
                        "label": "Continue",
                        "on-click-action": {
                            "name": "complete",
                            "payload": {}
                        }
                    }
                ]
            }
        }
    ]
};
