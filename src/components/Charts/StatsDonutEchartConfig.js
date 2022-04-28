import Color from 'color'

// define donut colors, icons
const colors = ['#0F677A', '#5DC8E0', '#2695AD']

const gradientColors = colors.map(hex => {
    const color = Color(hex)
    return {
        type: 'radial',
        x: 0.3,
        y: 0.5,
        r: 0.7,
        colorStops: [
            {
                offset: 0,
                color: color
                    .darken(0.2)
                    .lighten(0.2)
                    .toString(), // color at 0% position
            },
            {
                offset: 0.5,
                color: color.rgb().toString(), // color at 50% position
            },
            {
                offset: 1,
                color: color
                    .darken(0.2)
                    .lighten(0.2)
                    .toString(), // color at 100% position
            },
        ],
        globalCoord: true, // false by default
    }
})

const darkColor = {
    type: 'radial',
    x: 0.3,
    y: 0.5,
    r: 0.7,
    colorStops: [
        {
            offset: 0,
            color: '#2695AD', // color at 0% position
        },
        {
            offset: 1,
            color: '#0F677A', // color at 100% position
        },
    ],
    globalCoord: true, // false by default
}

const mediumColor = {
    type: 'radial',
    x: 0.3,
    y: 0.5,
    r: 0.7,
    colorStops: [
        {
            offset: 0,
            color: '#5DC8E0', // color at 0% position
        },
        {
            offset: 1,
            color: '#2695AD', // color at 100% position
        },
    ],
    globalCoord: true, // false by default
}

const lightColor = {
    type: 'radial',
    x: 0.3,
    y: 0.5,
    r: 0.7,
    colorStops: [
        {
            offset: 0,
            color: '#82E4FA', // color at 0% position
        },
        {
            offset: 1,
            color: '#5DC8E0', // color at 100% position
        },
    ],
    globalCoord: true, // false by default
}

export { colors, gradientColors, darkColor, mediumColor, lightColor }
