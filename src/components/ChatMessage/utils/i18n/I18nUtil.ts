import zh from './zh';
import en from './en';
type Params = {
    [key: string]: string
}
type FormatFn = (language: string | undefined, id: string, params?: Params) => string

// 当前的语言环境 
// const curLanFun = (language: string | undefined) => string

const i18next: FormatFn = (language, id, params) => {
    if (!id) {
        return ''
    }
    const messages = language === 'en' ? en : zh;
    let msg = messages[id] || ''
    if (params) {
        for (let key in params) {
            msg = msg.replace(`{${key}}`, params[key])
        }
    }

    return msg
}



export default i18next;