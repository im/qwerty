export const formatNumber = (n: any) => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}
export const formatTime = (date: any, isHour = false) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (isHour) {
        return `${[year, month, day].map(formatNumber).join('-')} ${hour}:${minute}:${second}`
    }
    return `${[year, month, day].map(formatNumber).join('-')}`
}

export const randomSort = () => {
    return Math.random() > 0.5 ? -1 : 1
}

export const reviewDates = (date: any) => {
    const dateArr: any = []
    const cur = date + ' 00:00:00'
    const curTime = new Date(cur).getTime()
    const days = [1, 2, 3, 4, 7, 15, 30, 90, 180]
    days.forEach((num: any) => {
        const day = 86400 * 1000 * num
        const newDate = new Date(curTime - day)
        const res =
            newDate.getFullYear() +
            '-' +
            formatNumber(newDate.getMonth() + 1) +
            '-' +
            formatNumber(newDate.getDate())
        dateArr.push(res)
    })
    return dateArr
}

export const storage = {
    get (name:any) {
        return JSON.parse(window.localStorage.getItem(name) as string) || null
    },
    set (name:any, val:any) {
        window.localStorage.setItem(name, val)
    }
}