import React from 'react';
import { render, fireEvent, waitForElement, screen, } from '@testing-library/react'
import SeeMore from './SeeMore';
import '@testing-library/jest-dom/extend-expect'
import {getByText} from '@testing-library/dom'

test('can see more details progress', async() => {
    var goal = {
        "confirmed": true,
        "startDate": "06/02/2020",
        "endDate": "",
        "duration": 1,
        "progress":{
            "yyffhh":
                [
                    5,
                    5,
                    4,
                    7,
                    3,
                    12,
                    132,
                    11,
                    1,
                    8,
                    9,
                    7,
                    3,
                    8
                ],
            "yfh":
                [
                    1,
                    2,
                    5,
                    9,
                    6,
                    4,
                    3,
                    2,
                    11,
                    3,
                    12,
                    12,
                    10,
                    8
                ]
        },
        "title": "Do Daily Pushups, Yay",
        "description": "Do 10 pushups a day.",
        "groupMembers": {
            "creator": "yyffhh",
            "invitee": "yfh"
        }
    };
    render(<SeeMore goal={goal} />)
    fireEvent.click(screen.getByText('See More'))
    await waitForElement(() => screen.getByText('Close'))
    fireEvent.click(screen.getByText('Close'))
})