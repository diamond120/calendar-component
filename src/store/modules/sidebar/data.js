export const menus = {
    'message.pages': [
        {
            action: 'zmdi-calendar',
            title: 'message.weeklyDashboards',
            active: true,
            items: [
                {
                    title: 'message.weeklyAnalyzer',
                    route: 'weekly-analyzer',
                },
                {
                    title: 'message.weeklyPlanner',
                    route: 'weekly-planner',
                },
            ],
        },
        {
            action: 'zmdi-chart',
            title: 'message.monthlyDashboards',
            active: false,
            items: [
                {
                    title: 'message.monthlyAnalyzer',
                    route: 'monthly-analyzer',
                },
            ],
        },
    ],
}
