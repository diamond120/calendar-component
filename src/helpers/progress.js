import Nprogress from 'nprogress'

const origstart = Nprogress.start
const origdone = Nprogress.done

let jobs = 0

Nprogress.start = () => {
    jobs++
    if (jobs === 1) {
        origstart()
    }
}

Nprogress.done = () => {
    jobs--
    if (jobs === 0) {
        origdone()
    }
}

Nprogress.doneAll = origdone
