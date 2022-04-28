/* eslint-disable no-case-declarations */
import AppConfig from '@/constants/AppConfig'
const moment = require('moment-timezone')

const MIN_FOCUS_TIME = 60
const MIN_TRANSITION_PREV = 15
const MIN_TRANSITION_POST = 30

const TAG_CRITICAL = AppConfig.meetingTag.critical
const TAG_PERSONAL = AppConfig.meetingTag.personal

const EventTypes = {
    meeting: 1,
    ooo: 2,
    tentative: 3,
    cancelled: 4,
}

function chooseOverlapped(l, r) {
    if (l.isOOO) {
        if (r.isOOO) {
            l.end = r.end
        }
        return l
    }

    if (r.isOOO) {
        return r
    }

    const isOrganizer = l.isOrganizer - r.isOrganizer
    if (isOrganizer === -1) return r
    if (isOrganizer === 1) return l

    const isRecurring = l.isRecurring - r.isRecurring
    if (isRecurring === -1) return l
    if (isRecurring === 1) return r

    return l.created > r.created ? l : r
}

function replaceNode(list, node, replacement) {
    if (list.head === node) {
        list.head = replacement
    } else {
        let prev = list.head
        while (prev && prev.next !== node) {
            prev = prev.next
        }
        if (prev) {
            prev.next = replacement
        }
    }
    if (list.tail === node) {
        list.tail = replacement
    }
}

function appendNode(list, node) {
    if (!list.head) list.head = node
    if (list.tail && list.tail !== node) list.tail.next = node
    list.tail = node
}

export default class Blocks {
    constructor(date) {
        this.start = date.clone().set({
            hours: 8,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        })
        this.end = date.clone().set({
            hours: 17,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        })
        this.head = null
        this.tail = null
        this.current = null
        this.blocks = []
        this.focusBlocks = []

        this.last = this.start
        this.date = date
        for (const prop of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (this[prop] instanceof Function && prop !== 'constructor') {
                this[prop] = this[prop].bind(this)
            }
        }
    }

    addEvent(event) {
        if (event.status === 'cancelled') {
            return
        }

        const node = {
            id: event.id,
            type: event.type,
            start: moment.tz(event.start * 1000, event.timezone),
            end: moment.tz(event.end * 1000, event.timezone),
            isOOO: event.type === EventTypes.ooo || event.type === EventTypes.forced_ooo,
            isTentative: event.type === EventTypes.tentative || event.type === EventTypes.forced_tentative,
            isRecurring: event.rcr ? 1 : 0,
            isOrganizer: event.org ? 1 : 0,
            summary: event.summary,
            description: event.description,
            created: event.created,
            event,
        }

        if (node.isTentative) {
            this.addBlock('tentative', node)
            return
        }

        const overlapped = this.tail && this.tail.end.isAfter(node.start)
        if (!overlapped) {
            return appendNode(this, node)
        }

        const selected = chooseOverlapped(this.tail, node)
        if (selected === node) {
            // new node selected
            this.tail.isTentative = 1
            this.addBlock('tentative', this.tail)
            replaceNode(this, this.tail, node)
        } else {
            // old node selected
            if (!node.isOOO) {
                node.isTentative = 1
                this.addBlock('tentative', node)
            }
        }
    }

    addBlock(category, node) {
        const block = {
            id: node.id,
            from: node.start.valueOf(),
            to: node.end.valueOf(),
            date: this.date.format('YYYY-MM-DD'),
            data: {
                title: node.summary || category,
                description: node.description,
                category,
                isRecurring: node.isRecurring,
                isOrganizer: node.isOrganizer,
            },
        }
        this.blocks.push(block)

        if (category !== 'tentative') {
            this.last = moment(block.to)
        }

        if (category === 'focus') {
            const diff = Math.round(block.to - block.from) / 60000
            this.focusTime += diff
            this.focusBlocks.push(block)
        }

        if (category === 'meeting' || category === 'tentative') {
            block.data.attendees = node.event.attendees
            block.data.recurrence = this.getRecurrence(node.event)
            block.data.org = node.event.org
            block.data.created = node.event.created * 1000
            block.data.reschedules = node.event.reschedules
        }

        if (block.data.title.includes(TAG_CRITICAL)) {
            block.data.tag_critical = 1
        }

        if (block.data.title.includes(TAG_PERSONAL)) {
            block.data.tag_personal = 1
        }
    }

    getRecurrence({ recurrence }) {
        if (!recurrence) return false
        let [rrule] = recurrence
        if (!rrule.startsWith('RRULE:')) {
            console.error('Invalid recurrence rule')
            return false
        }
        rrule = rrule.substr(6)
        rrule = rrule.split(';').reduce((acc, cur) => {
            const parts = cur.split('=')
            acc[parts[0]] = parts[1]
            return acc
        }, {})
        return rrule.FREQ.toLowerCase()
    }

    calculateHead() {
        if (!this.head) {
            this.addBlock('focus', {
                start: this.start,
                end: this.end,
            })
            return
        }

        const { start } = this.head
        // don't add transition in after hours
        if (start.isSameOrBefore(this.start)) return

        const totalTimeBetween = start.diff(this.start, 'minutes')
        let actualTransition = Math.min(MIN_TRANSITION_PREV, totalTimeBetween)

        if (this.head.isOOO) {
            if (totalTimeBetween > MIN_FOCUS_TIME) {
                this.addBlock('focus', {
                    start: this.start,
                    end: start,
                })
            }
            return
        }

        const possibleFocusTime = totalTimeBetween - actualTransition

        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            this.addBlock('focus', {
                start: this.last,
                end: this.start.clone().add(possibleFocusTime, 'minutes'),
            })
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(actualTransition, 'minutes'),
            })
        } else {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(totalTimeBetween, 'minutes'),
            })
        }
    }

    calculateNode() {
        const node = this.current
        if (!node) return
        this.current = this.current.next
        const nextStart = node.next ? node.next.start : this.end

        if (node.isOOO) {
            this.addBlock('ooo', node)
        } else {
            this.addBlock('meeting', node)
        }

        // do not add transition in after hours or when next meeting starts immediately after current one
        if (this.last.isSameOrAfter(nextStart)) return

        const totalTimeBetweenEvents = nextStart.diff(this.last, 'minutes')
        const nextTransition = node.next ? MIN_TRANSITION_PREV : 0
        const maxPossibleTransition = MIN_TRANSITION_POST + nextTransition
        const actualTransition = Math.min(maxPossibleTransition, totalTimeBetweenEvents)

        const possibleFocusTime = totalTimeBetweenEvents - actualTransition
        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(MIN_TRANSITION_POST, 'minutes'),
            })
            this.addBlock('focus', {
                start: this.last,
                end: this.last.clone().add(possibleFocusTime, 'minutes'),
            })
            if (nextTransition > 0) {
                this.addBlock('transition', {
                    start: this.last,
                    end: this.last.clone().add(nextTransition, 'minutes'),
                })
            }
        } else {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(totalTimeBetweenEvents, 'minutes'),
            })
        }
    }

    calculate() {
        this.focusTime = 0
        this.current = this.head
        // check if has all day OOO
        const { start, end } = this
        const allDayOOO = this.blocks.filter(
            block => block.data.category === 'ooo' && block.from <= start.valueOf() && block.to >= end.valueOf()
        )
        if (!allDayOOO.length) {
            this.calculateHead()
        }
        while (this.current) {
            this.calculateNode()
        }
        this.calculated = true
    }
}
