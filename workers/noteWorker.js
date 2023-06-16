self.onmessage = ({ data }) => {
    const { notes, startPos, currentPos, shiftKey } = data;

    self.postMessage(newNotes);
};
