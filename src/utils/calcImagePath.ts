const clacImagePath = (filename: string) =>
  [
    filename.substring(0, 2),
    filename.substring(2, 4),
    filename.substring(4, 6),
  ].join('/')

export default clacImagePath
