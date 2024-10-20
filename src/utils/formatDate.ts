function formatDate(date: Date, type: string) {
  switch (type) {
    case 'dd/mm/yy':
      return `${
        date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate().toString()
      } / ${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1
      } / ${date.getFullYear()}`
    case 'dd/mm':
      return `${
        date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate().toString()
      } / ${date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1}}`
    case 'hh/mm':
      return ` ${
        date.getHours().toString().length > 1 ? date.getHours() : '0' + date.getHours().toString()
      } : ${
        date.getMinutes().toString().length > 1
          ? date.getMinutes()
          : '0' + date.getMinutes().toString()
      }`
  }
}

export default formatDate
