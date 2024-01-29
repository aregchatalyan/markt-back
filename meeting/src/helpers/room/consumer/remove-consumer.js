export const removeConsumer = (consumerId, consumers, setMedia) => {
  setMedia(prev => {
    prev.remote.forEach((item) => {
      if (item.id === consumerId) {
        const track = item.audio || item.video;
        track.getTracks().forEach((track) => track.stop());
      }
    });

    return {
      ...prev,
      remote: [ ...prev.remote.filter(item => item.id !== consumerId) ]
    }
  });

  consumers.delete(consumerId);
}
