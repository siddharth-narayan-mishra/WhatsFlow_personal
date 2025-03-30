export const exampleFlow = {
    "version": "7.0",
    "routing_model": {
        "FIRST_SCREEN": [
            "SECOND_SCREEN",
            "THIRD_SCREEN",
            "FIFTH_SCREEN"
        ],
        "SECOND_SCREEN": [
            "CONTACT"
        ],
        "THIRD_SCREEN": [
            "CONTACT"
        ],
        "FIFTH_SCREEN": [
            "CONTACT"
        ],
        "CONTACT": []
    },
    "screens": [
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
            "id": "SECOND_SCREEN",
            "title": "Home Insurance",
            "data": {},
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextSubheading",
                        "text": "Tell us about your property"
                    },
                    {
                        "type": "Form",
                        "name": "property_details_form",
                        "children": [
                            {
                                "type": "Dropdown",
                                "name": "property_type",
                                "required": true,
                                "label": "Property Type",
                                "data-source": [
                                    {
                                        "id": "House",
                                        "title": "House"
                                    },
                                    {
                                        "id": "Apartment",
                                        "title": "Apartment"
                                    },
                                    {
                                        "id": "Condo",
                                        "title": "Condo"
                                    }
                                ]
                            },
                            {
                                "type": "TextInput",
                                "name": "surface",
                                "label": "Total surface (sqm)",
                                "input-type": "number",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "name": "rooms",
                                "input-type": "number",
                                "label": "Number or rooms",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "name": "floors",
                                "label": "Number of floors"
                            },
                            {
                                "type": "Footer",
                                "label": "Continue",
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "name": "CONTACT",
                                        "type": "screen"
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
            "id": "THIRD_SCREEN",
            "title": "Health Insurance",
            "data": {},
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextSubheading",
                        "text": "Tell us about the type of insurance you are looking for"
                    },
                    {
                        "type": "Form",
                        "name": "health_insurance_form",
                        "children": [
                            {
                                "type": "Dropdown",
                                "label": "Insurance type",
                                "name": "insurance_type",
                                "required": true,
                                "data-source": [
                                    {
                                        "id": "individual",
                                        "title": "Individual"
                                    },
                                    {
                                        "id": "family",
                                        "title": "Family"
                                    }
                                ]
                            },
                            {
                                "type": "TextInput",
                                "label": "Count",
                                "required": true,
                                "helper-text": "How may people will be covered by this insurance",
                                "name": "number_of_people"
                            },
                            {
                                "type": "Dropdown",
                                "label": "Age range",
                                "name": "age_range",
                                "required": true,
                                "data-source": [
                                    {
                                        "id": "18-24",
                                        "title": "18-24"
                                    },
                                    {
                                        "id": "25-34",
                                        "title": "25-34"
                                    }
                                ]
                            },
                            {
                                "type": "Footer",
                                "label": "Next",
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "type": "screen",
                                        "name": "CONTACT"
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
            "id": "FIFTH_SCREEN",
            "title": "Time Travel Insurance",
            "data": {
                "first_name": {
                    "type": "string",
                    "__example__": "Bob"
                }
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextBody",
                        "text": "`${data.first_name} ', we are excited you are joining our community of time travellers!'`"
                    },
                    {
                        "type": "TextBody",
                        "text": "We require a few more details to make sure you have the best cover possible for your needs."
                    },
                    {
                        "type": "Form",
                        "name": "health_insurance_form",
                        "children": [
                            {
                                "type": "Dropdown",
                                "label": "Insurance type",
                                "name": "insurance_type",
                                "required": true,
                                "data-source": [
                                    {
                                        "id": "individual",
                                        "title": "Individual"
                                    },
                                    {
                                        "id": "family",
                                        "title": "Family"
                                    }
                                ]
                            },
                            {
                                "type": "TextInput",
                                "label": "Count",
                                "required": true,
                                "helper-text": "How may people will be covered by this insurance",
                                "name": "number_of_people"
                            },
                            {
                                "type": "Dropdown",
                                "label": "Age range",
                                "name": "age_range",
                                "required": true,
                                "data-source": [
                                    {
                                        "id": "18-24",
                                        "title": "18-24"
                                    },
                                    {
                                        "id": "25-34",
                                        "title": "25-34"
                                    }
                                ]
                            },
                            {
                                "type": "Footer",
                                "label": "Next",
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "type": "screen",
                                        "name": "CONTACT"
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
            "id": "CONTACT",
            "title": "Contact details",
            "terminal": true,
            "data": {},
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "TextHeading",
                        "text": "How can we get in contact with you?"
                    },
                    {
                        "type": "Form",
                        "name": "form",
                        "children": [
                            {
                                "type": "TextInput",
                                "name": "name",
                                "label": "Full name",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "name": "phone",
                                "required": true,
                                "label": "Phone number"
                            },
                            {
                                "type": "Footer",
                                "label": "Complete",
                                "on-click-action": {
                                    "name": "complete",
                                    "payload": {
                                        "phone": "${form.phone}",
                                        "name": "${form.name}"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]
}