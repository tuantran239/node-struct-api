import { productCons } from '@api-v1/constants'

export const FilterProducts = ({
  page = 1,
  search = '',
  color = 'all',
  cate = 'all',
  gender = 'all',
  sort = 'newest',
  min = productCons.MIN,
  max = productCons.MAX
}: any) => {
  const limit = productCons.LIMIT
  const skip = (page - 1) * limit
  let filter = {}
  let options = {}
  if (search && (search as string).trim().length > 0) {
    filter = Object.assign(filter, {
      $or: [
        { $text: { $search: search } },
        {
          categories: { $regex: `${search}`, $options: 'i' }
        },
        {
          'productType.color': { $regex: `${search}`, $options: 'i' }
        }
      ]
    })
  }
  if (color && (color as string).trim().toLocaleLowerCase() !== 'all') {
    filter = Object.assign(filter, {
      'productType.color': { $regex: `${color}`, $options: 'i' }
    })
  }
  if (cate && (cate as string).trim().toLocaleLowerCase() !== 'all') {
    filter = Object.assign(filter, {
      categories: { $regex: `${cate}`, $options: 'i' }
    })
  }
  if (gender && (gender as string).trim().toLocaleLowerCase() !== 'all') {
    filter = Object.assign(filter, {
      gender: `${gender}`.trim().toUpperCase()
    })
  }
  if (min && max) {
    filter = Object.assign(filter, {
      $and: [{ price: { $gte: min } }, { price: { $lte: max } }]
    })
  }
  if (sort) {
    if ((sort as string).trim().toLocaleLowerCase() === 'newest') {
      options = Object.assign(options, { sort: { createdAt: -1 } })
    } else if ((sort as string).trim().toLocaleLowerCase() === 'price(asc)') {
      options = Object.assign(options, { sort: { price: 1 } })
    } else if ((sort as string).trim().toLocaleLowerCase() === 'price(desc)') {
      options = Object.assign(options, { sort: { price: -1 } })
    }
  }
  options = Object.assign(options, { limit, skip })
  return { filter, options }
}
