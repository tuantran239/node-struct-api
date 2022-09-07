type NameFolder = 'avatar' | 'product'

const folder = (name: NameFolder, id: any) => {
  switch (name) {
    case 'avatar':
      return `lama/avatar/${id}`
    case 'product':
      return `lama/product/${id}`
    default:
      return 'lama/orther'
  }
}

const cloudinaryCons = {
  folder
}

export default cloudinaryCons
