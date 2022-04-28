const recap = {
    stats: {
        week: {
            a_attendees_minutes: 1525,
            a_lead_time_minutes: 31,
            a_recurring: 9,
            a_total: 10,
            a_total_attendees: 22,
            a_total_minutes: 695,
            o_attendees_minutes: 1500,
            o_lead_time_minutes: 0,
            o_recurring: 8,
            o_total: 8,
            o_total_attendees: 20,
            o_total_minutes: 630,
        },
        month: {
            a_attendees_minutes: 3860,
            a_lead_time_minutes: 791253,
            a_recurring: 30,
            a_total: 33,
            a_total_attendees: 72,
            a_total_minutes: 1750,
            o_attendees_minutes: 5460,
            o_lead_time_minutes: 0,
            o_recurring: 31,
            o_total: 31,
            o_total_attendees: 73,
            o_total_minutes: 2400,
        },
    },
    makeup: {
        makeup: {
            total_minutes: 1325,
            recurring_minutes: 1250,
            external_minutes: 1265,
        },
        externalDomains: [
            {
                hd: 'gmail.com',
                meetings: 6,
                minutes: 360,
            },
            {
                hd: 'workbetter.inc',
                meetings: 17,
                minutes: 1265,
            },
        ],
    },
    trends: {
        loading: {
            loaded: false,
        },
        month: [
            {
                month: 12,
                total: 4100,
            },
            {
                month: 1,
                total: 4795,
            },
            {
                month: 2,
                total: 4080,
            },
            {
                month: 3,
                total: 3950,
            },
        ],
        week: [
            {
                total: 1010,
                week: 12,
            },
            {
                total: 840,
                week: 13,
            },
            {
                total: 1320,
                week: 14,
            },
            {
                total: 1170,
                week: 15,
            },
        ],
    },
    attendees: {
        peers: [
            {
                email: 'friend@workbetter.inc',
                name: 'Workbetter Friend',
                picture: '',
            },
            {
                email: 'testuser@workbetter.inc',
                name: 'Test user',
                picture: '',
            },
        ],
        sharedMap: {
            'friend@workbetter.inc': {
                duration: 360,
                meetings: 6,
            },
            'testuser@workbetter.inc': {
                duration: 780,
                meetings: 100,
            },
        },
    },
}

export { recap }
