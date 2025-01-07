const StickerUtil = {
    openStickerStore() {
      window.open(
        'ctripperchat://openmodulewithid/e7ca638d15eb4a12bd4129d51ab21049?tips=&page=e7ca638d15eb4a12bd4129d51ab21049',
      );
    },
  
    openStickerAlbum(type) {
      if (type) {
        const query = window.btoa(`/EmojiMall/pages/detail/detail?miniapp=1&id=${type}`);
        const url = `ctripperchat://openmodulewithid/e7ca638d15eb4a12bd4129d51ab21049?tips=${query}`;
        window.open(url);
      }
    },
  
    getImageUrl(message) {
      let url = '';
      if (message && message.extPropertys) {
        const {
          imageUrl,
          thumbUrl, // 优先
          emotionUrl,
          emotionCoverUrl, // 冗余
        } = message.extPropertys;
        url = imageUrl || thumbUrl || emotionUrl || emotionCoverUrl;
      }
      return url;
    },
  };
  
  export default StickerUtil;
  