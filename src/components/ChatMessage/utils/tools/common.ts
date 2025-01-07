// 点击复制
export const copyTxt = (data: string) => {
    const handler = (event: any) => {
        event.clipboardData.setData('text/plain', data);
        document.removeEventListener('copy', handler, true);
        event.preventDefault();
    }
    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
}