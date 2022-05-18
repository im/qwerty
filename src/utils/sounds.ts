const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='
export const playSound = (type: 'beep' | 'click' | 'hint') => {
    const url = `/sound/${type}.wav`
    const audio = new Audio(url)
    return audio
}

export const wordPlaySound = (word:string, pronunciation:string) => {
    let url = `https://dict.youdao.com/dictvoice?audio=${word}&type=${ pronunciation === 'uk' ? 1 : 2 }`
    const audio = new Audio(url)
    return audio
}
