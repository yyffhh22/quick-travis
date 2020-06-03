import React from 'react';
import { render, fireEvent, waitForElement, screen, } from '@testing-library/react'
import SeeMore from './SeeMore';
import '@testing-library/jest-dom/extend-expect'
import {getByText, getByTestId} from '@testing-library/dom'

test('can see more details progress', async() => {
    var goal = {
        "archivedCreator" : false,
        "archivedInvitee" : false,
        "confirmed" : true,
        "deleted" : true,
        "description": "Do 10 pushups a day.",
        "duration" : "2",
        "goalType" : "Quantitative",
        "groupMembers": {
            "creator": "yyffhh",
            "invitee": "yfh"
        },
        "lastRemindCreator" : -1,
        "lastRemindInvitee" : -1,
        "metric" : "pushups done",
        "minimum" : "10",
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
        "rejected" : false,
        "startDate" : "06/02/2020",
        "title" : "Daily Pushups"
    };
    render(<SeeMore goal={goal} />)
    fireEvent.click(screen.getByText('See More'))
    // await waitForElement(() => screen.getByText('Close'))
    fireEvent.click(screen.getByText('Close'))
    expect(screen.getByText("Close")).toBeInTheDocument()
})